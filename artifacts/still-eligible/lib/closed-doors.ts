/**
 * Closed doors, with the fix. The Season Pass feature.
 *
 * The home feed hides every door the profile fails. This module looks at
 * exactly those doors and answers two questions per door, using nothing but
 * the rules already stored on the record: which rule shuts it, and what is
 * the smallest change to the profile that would clear that rule.
 *
 * Only two profile fields can change while a student is still studying:
 * CGPA and active backlogs. Everything else (10th and 12th marks, gap years,
 * branch, citizenship, gender) is fixed, and a door shut by one of those is
 * reported as closed for good rather than dressed up with a fake fix.
 * Work experience, and a batch list that names younger batches than yours,
 * shut a door for now, not forever.
 *
 * Honesty rules, same as the engine: a fix clears a known blocker, it does
 * not promise the door opens. If other rules are still unknown, or the record
 * is not fully confirmed, the door says so next to the fix. Only a verified
 * record with nothing left unknown counts as "opens" in the summary.
 *
 * Pure functions, no React, no I/O.
 */

import { evaluateEligibility } from './engine';
import { deadlineSortValue } from './deadlines';
import { EligibilityResult, Opportunity, RuleEvaluation, RuleKey, UserProfile } from './types';

export type DoorGroup = 'fixable' | 'later' | 'permanent';

export const DOOR_GROUP_ORDER: DoorGroup[] = ['fixable', 'later', 'permanent'];

export const DOOR_GROUP_LABELS: Record<DoorGroup, string> = {
  fixable: 'Comes down to CGPA or backlogs',
  later: 'Not this cycle',
  permanent: 'Closed for good',
};

export const DOOR_GROUP_INTROS: Record<DoorGroup, string> = {
  fixable:
    'Every stored rule you fail here is about your CGPA or your backlogs, the two things you can still move. The key line is the smallest change that clears it.',
  later:
    'Shut this cycle by your batch year or by work experience, which time settles. Where your marks also fall short, that fix is listed too.',
  permanent:
    'Shut by something you cannot change now. Stop spending time on these and take the alternative where one is listed.',
};

/** Profile fields a student can still move. */
const CHANGEABLE: ReadonlySet<RuleKey> = new Set<RuleKey>(['min_cgpa', 'max_active_backlogs']);

export type DoorFix =
  | { kind: 'cgpa'; target: number; current: number; gap: number }
  | { kind: 'backlogs'; allowed: number; current: number; clear: number };

export type ClosedDoor = {
  opportunity: Opportunity;
  eligibility: EligibilityResult;
  group: DoorGroup;
  /** The failed rules, in the engine's display order. */
  blockers: RuleEvaluation[];
  /**
   * Concrete profile changes that clear the CGPA or backlog blockers. Empty
   * for a door that is closed for good, where a fix would be pointless.
   */
  fixes: DoorFix[];
  /** Rules the engine could not settle. Clearing the blockers leaves these open. */
  stillUnknown: RuleEvaluation[];
  /** True when the record's criteria were not fully confirmed on the official page. */
  unconfirmed: boolean;
  /** Listed alternatives the profile does not fail. */
  openAlternatives: Opportunity[];
};

/** One rung of the CGPA ladder: reaching `target` fully opens `opens` doors. */
export type LadderRung = { target: number; opens: number };

export type ClosedDoorsSummary = {
  total: number;
  fixable: number;
  later: number;
  permanent: number;
  /**
   * Cumulative: verified doors with nothing left unknown whose only blocker
   * is a CGPA cutoff at or below each target. At most three rungs, lowest first.
   */
  cgpaLadder: LadderRung[];
  /** Same standard as the ladder, for doors whose only blocker is backlogs. */
  backlogOnlyDoors: number;
};

export type ClosedDoorsReport = {
  doors: ClosedDoor[];
  summary: ClosedDoorsSummary;
};

/**
 * Whether a failed rule shuts the door for now or for good. Only the batch
 * rule depends on the profile: a batch list never reaches back to older
 * batches, so a student who graduates before every listed year is out for
 * good, while one who graduates after them may be on a later list.
 */
function blockerKind(rule: RuleEvaluation, opportunity: Opportunity, profile: UserProfile): 'changeable' | 'temporary' | 'permanent' {
  if (CHANGEABLE.has(rule.key)) return 'changeable';
  if (rule.key === 'min_work_years') return 'temporary';
  if (rule.key === 'grad_years') {
    const list = opportunity.rules.grad_years;
    if (list && list.length > 0 && profile.grad_year !== null && profile.grad_year > Math.max(...list)) {
      return 'temporary';
    }
    return 'permanent';
  }
  return 'permanent';
}

function groupFor(blockers: RuleEvaluation[], opportunity: Opportunity, profile: UserProfile): DoorGroup {
  const kinds = blockers.map((b) => blockerKind(b, opportunity, profile));
  if (kinds.includes('permanent')) return 'permanent';
  if (kinds.includes('temporary')) return 'later';
  return 'fixable';
}

function fixesFor(opportunity: Opportunity, profile: UserProfile, blockers: RuleEvaluation[]): DoorFix[] {
  const fixes: DoorFix[] = [];
  for (const blocker of blockers) {
    if (blocker.key === 'min_cgpa' && opportunity.rules.min_cgpa !== null && profile.cgpa !== null) {
      const target = opportunity.rules.min_cgpa;
      fixes.push({ kind: 'cgpa', target, current: profile.cgpa, gap: roundTo(target - profile.cgpa, 2) });
    }
    if (
      blocker.key === 'max_active_backlogs' &&
      opportunity.rules.max_active_backlogs !== null &&
      profile.active_backlogs !== null
    ) {
      const allowed = opportunity.rules.max_active_backlogs;
      fixes.push({ kind: 'backlogs', allowed, current: profile.active_backlogs, clear: profile.active_backlogs - allowed });
    }
  }
  return fixes;
}

function roundTo(n: number, places: number): number {
  const factor = 10 ** places;
  return Math.round(n * factor) / factor;
}

/**
 * Order inside the fixable group. Backlogs and CGPA are different units, so
 * instead of mixing them into one number the doors come in tiers: backlogs
 * only (cleared by passing the papers next semester), then CGPA only by the
 * size of the gap, then doors that need both.
 */
function fixRank(door: ClosedDoor): [number, number, number] {
  const cgpa = door.fixes.find((f) => f.kind === 'cgpa');
  const backlogs = door.fixes.find((f) => f.kind === 'backlogs');
  const tier = cgpa && backlogs ? 2 : cgpa ? 1 : 0;
  return [tier, cgpa ? cgpa.gap : 0, backlogs ? backlogs.clear : 0];
}

function compareRanks(a: [number, number, number], b: [number, number, number]): number {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return a[i] - b[i];
  }
  return 0;
}

/**
 * Every door the profile fails, with its group, blockers and fixes. `now`
 * exists so tests can pin the clock; the app never passes it.
 */
export function analyzeClosedDoors(
  records: Opportunity[],
  profile: UserProfile,
  now: Date = new Date(),
): ClosedDoorsReport {
  const byId = new Map(records.map((r) => [r.id, r]));
  const verdicts = new Map(records.map((r) => [r.id, evaluateEligibility(r, profile, now)]));

  const doors: ClosedDoor[] = [];
  for (const opportunity of records) {
    const eligibility = verdicts.get(opportunity.id)!;
    if (eligibility.status !== 'not_eligible') continue;
    const blockers = eligibility.failed;
    const group = groupFor(blockers, opportunity, profile);
    const openAlternatives = opportunity.alternative_ids
      .map((id) => byId.get(id))
      .filter((alt): alt is Opportunity => alt !== undefined && verdicts.get(alt.id)!.status !== 'not_eligible');
    doors.push({
      opportunity,
      eligibility,
      group,
      blockers,
      fixes: group === 'permanent' ? [] : fixesFor(opportunity, profile, blockers),
      stillUnknown: eligibility.unknown,
      unconfirmed: opportunity.verification_status === 'needs_check',
      openAlternatives,
    });
  }

  doors.sort((a, b) => {
    const groupDiff = DOOR_GROUP_ORDER.indexOf(a.group) - DOOR_GROUP_ORDER.indexOf(b.group);
    if (groupDiff !== 0) return groupDiff;
    if (a.group === 'fixable') {
      const rankDiff = compareRanks(fixRank(a), fixRank(b));
      if (rankDiff !== 0) return rankDiff;
    }
    return deadlineSortValue(a.opportunity.deadline, now) - deadlineSortValue(b.opportunity.deadline, now);
  });

  return { doors, summary: summarize(doors) };
}

/** A door that really opens once its single fix is made: verified, nothing unknown. */
function fullyOpensWith(door: ClosedDoor, kind: DoorFix['kind']): boolean {
  return (
    door.group === 'fixable' &&
    !door.unconfirmed &&
    door.stillUnknown.length === 0 &&
    door.fixes.length === 1 &&
    door.fixes[0].kind === kind
  );
}

function cgpaTarget(door: ClosedDoor): number {
  return (door.fixes[0] as Extract<DoorFix, { kind: 'cgpa' }>).target;
}

function summarize(doors: ClosedDoor[]): ClosedDoorsSummary {
  const cgpaOnly = doors.filter((d) => fullyOpensWith(d, 'cgpa'));
  const targets = Array.from(new Set(cgpaOnly.map(cgpaTarget))).sort((a, b) => a - b);
  const cgpaLadder: LadderRung[] = targets.slice(0, 3).map((target) => ({
    target,
    opens: cgpaOnly.filter((d) => cgpaTarget(d) <= target).length,
  }));

  return {
    total: doors.length,
    fixable: doors.filter((d) => d.group === 'fixable').length,
    later: doors.filter((d) => d.group === 'later').length,
    permanent: doors.filter((d) => d.group === 'permanent').length,
    cgpaLadder,
    backlogOnlyDoors: doors.filter((d) => fullyOpensWith(d, 'backlogs')).length,
  };
}

function formatNumber(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
}

/** One plain sentence per fix, e.g. "Raise your CGPA to 7. You have 6.8, so 0.2 more." */
export function describeFix(fix: DoorFix): string {
  if (fix.kind === 'cgpa') {
    return `Raise your CGPA to ${formatNumber(fix.target)}. You have ${formatNumber(fix.current)}, so ${formatNumber(fix.gap)} more.`;
  }
  if (fix.allowed === 0) {
    return fix.current === 1
      ? 'Clear your 1 active backlog. This program allows none.'
      : `Clear all ${fix.current} active backlogs. This program allows none.`;
  }
  return `Clear ${fix.clear} of your ${fix.current} active backlogs. This program allows at most ${fix.allowed}.`;
}

/**
 * What the fix does not settle: rules still unknown, or a record whose
 * criteria are not fully confirmed. Empty when the fix alone opens the door.
 */
export function describeCaveat(door: ClosedDoor): string {
  const parts: string[] = [];
  if (door.stillUnknown.length > 0) {
    const labels = door.stillUnknown.map((r) => r.label.toLowerCase()).join(', ');
    parts.push(
      door.stillUnknown.length === 1
        ? `Even then, one rule is still unchecked: ${labels}.`
        : `Even then, ${door.stillUnknown.length} rules are still unchecked: ${labels}.`,
    );
  }
  if (door.unconfirmed) {
    parts.push('The criteria were not fully confirmed on the official page, so read the notes before counting on it.');
  }
  return parts.join(' ');
}

/** The single line under a door in the "Not this cycle" group. States facts, predicts nothing. */
export function describeWait(door: ClosedDoor): string {
  const keys = new Set(door.blockers.map((b) => b.key));
  const parts: string[] = [];
  if (keys.has('grad_years')) {
    parts.push('Your batch comes after the ones named this cycle. Check the batch list when the next cycle opens.');
  }
  if (keys.has('min_work_years')) {
    parts.push('Needs full-time work experience first, which most students only get after graduating.');
  }
  return parts.join(' ');
}

/** Headline for the summary card, free and paid alike. */
export function describeSummary(summary: ClosedDoorsSummary): string {
  if (summary.total === 0) return 'No door is closed to your profile right now.';
  const doors = summary.total === 1 ? '1 door is' : `${summary.total} doors are`;
  if (summary.fixable === 0) return `${doors} closed to your profile. None of them turns on your CGPA or backlogs.`;
  const fixable = summary.fixable === 1 ? '1 of them comes' : `${summary.fixable} of them come`;
  return `${doors} closed to your profile. ${fixable} down to your CGPA or backlogs, which you can still change.`;
}

/** "CGPA 7 opens 3 doors, 7.5 opens 5 doors." Counts only doors that fully open. */
export function describeLadder(summary: ClosedDoorsSummary): string {
  if (summary.cgpaLadder.length === 0) return '';
  const rungs = summary.cgpaLadder.map((rung, i) => {
    const doors = rung.opens === 1 ? '1 door' : `${rung.opens} doors`;
    return i === 0 ? `CGPA ${formatNumber(rung.target)} opens ${doors}` : `${formatNumber(rung.target)} opens ${doors}`;
  });
  return rungs.join(', ') + ', nothing else needed.';
}
