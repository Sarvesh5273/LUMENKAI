/**
 * The eligibility engine.
 *
 * Pure functions, no React, no I/O. Give it one opportunity and one profile
 * and it returns a verdict plus one plain-English line per rule. The UI never
 * decides eligibility on its own; it only displays what this file returns.
 *
 * Rule of thumb for every evaluator below:
 *   - the program has no such cutoff          -> 'no_rule'
 *   - the profile is missing the needed field -> 'unknown' (never 'fail')
 *   - otherwise compare and return pass/fail with a readable reason
 */

import {
  BRANCH_LABELS,
  CITIZENSHIP_LABELS,
  EligibilityResult,
  EligibilityRules,
  Opportunity,
  RuleEvaluation,
  RuleKey,
  UserProfile,
} from './types';
import { isExpectedNextCycle } from './deadlines';

/**
 * Facts about the record that some rules need beyond the rules block.
 * `expectedNextCycle` is true when the stored deadline has passed or is not
 * announced, which means any batch list in the record describes the last
 * cycle, not the next one.
 */
type EvalContext = { expectedNextCycle: boolean };

type Evaluator = (rules: EligibilityRules, profile: UserProfile, ctx: EvalContext) => RuleEvaluation;

/** Profile field each rule depends on. Used to build `missingFields`. */
export const RULE_PROFILE_FIELD: Record<RuleKey, keyof UserProfile> = {
  min_tenth_pct: 'tenth_pct',
  min_twelfth_pct: 'twelfth_pct',
  min_cgpa: 'cgpa',
  max_active_backlogs: 'active_backlogs',
  max_gap_years: 'gap_years',
  grad_years: 'grad_year',
  citizenship: 'citizenship',
  gender: 'gender',
  requires_student: 'is_student',
  branches: 'branch',
  min_work_years: 'work_years',
};

export const RULE_LABELS: Record<RuleKey, string> = {
  min_tenth_pct: '10th percentage',
  min_twelfth_pct: '12th percentage',
  min_cgpa: 'CGPA',
  max_active_backlogs: 'Active backlogs',
  max_gap_years: 'Gap years',
  grad_years: 'Graduation year',
  citizenship: 'Citizenship',
  gender: 'Gender',
  requires_student: 'Student status',
  branches: 'Branch',
  min_work_years: 'Work experience',
};

/** Fixed display order: the five classic cutoffs first, then the rest. */
export const RULE_ORDER: RuleKey[] = [
  'min_tenth_pct',
  'min_twelfth_pct',
  'min_cgpa',
  'max_active_backlogs',
  'max_gap_years',
  'grad_years',
  'branches',
  'citizenship',
  'gender',
  'requires_student',
  'min_work_years',
];

/**
 * Wording for a null rule on a record that is not fully confirmed. Each
 * sentence says what was looked for and admits it may still exist.
 */
const UNCONFIRMED_NO_RULE: Record<RuleKey, string> = {
  min_tenth_pct: 'No 10th percentage cutoff was found on the official page. Not confirmed yet, see the notes.',
  min_twelfth_pct: 'No 12th percentage cutoff was found on the official page. Not confirmed yet, see the notes.',
  min_cgpa: 'No CGPA cutoff was found on the official page. Not confirmed yet, see the notes.',
  max_active_backlogs: 'No backlog limit was found on the official page. Not confirmed yet, see the notes.',
  max_gap_years: 'No gap year limit was found on the official page. Not confirmed yet, see the notes.',
  grad_years: 'No graduation year restriction was found on the official page. Not confirmed yet, see the notes.',
  branches: 'No branch restriction was found on the official page. Not confirmed yet, see the notes.',
  citizenship: 'No nationality restriction was found on the official page. Not confirmed yet, see the notes.',
  gender: 'No gender restriction was found on the official page. Not confirmed yet, see the notes.',
  requires_student: 'No current-student requirement was found on the official page. Not confirmed yet, see the notes.',
  min_work_years: 'No work experience requirement was found on the official page. Not confirmed yet, see the notes.',
};

function formatNumber(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
}

function makeEval(key: RuleKey, status: RuleEvaluation['status'], reason: string): RuleEvaluation {
  return { key, label: RULE_LABELS[key], status, reason };
}

/**
 * Shared logic for "at least X" percentage and CGPA rules.
 */
function minimumRule(
  key: RuleKey,
  required: number | null,
  actual: number | null,
  unit: string,
  noun: string,
): RuleEvaluation {
  if (required === null) {
    return makeEval(key, 'no_rule', `No minimum ${noun} required.`);
  }
  if (actual === null) {
    return makeEval(
      key,
      'unknown',
      `Needs at least ${formatNumber(required)}${unit} in ${noun}. Add your ${noun} to your profile to check this.`,
    );
  }
  if (actual >= required) {
    return makeEval(
      key,
      'pass',
      `Needs ${formatNumber(required)}${unit} in ${noun}. You have ${formatNumber(actual)}${unit}.`,
    );
  }
  const gap = required - actual;
  return makeEval(
    key,
    'fail',
    `Needs ${formatNumber(required)}${unit} in ${noun}. You have ${formatNumber(actual)}${unit}, which is ${formatNumber(gap)}${unit} short.`,
  );
}

/**
 * Shared logic for "at most X" rules (backlogs, gap years).
 */
function maximumRule(
  key: RuleKey,
  allowed: number | null,
  actual: number | null,
  singular: string,
  plural: string,
): RuleEvaluation {
  if (allowed === null) {
    return makeEval(key, 'no_rule', `No limit on ${plural}.`);
  }
  const allowedText =
    allowed === 0 ? `no ${plural}` : `at most ${allowed} ${allowed === 1 ? singular : plural}`;
  if (actual === null) {
    return makeEval(
      key,
      'unknown',
      `Allows ${allowedText}. Add your ${plural} count to your profile to check this.`,
    );
  }
  const actualText = `${actual} ${actual === 1 ? singular : plural}`;
  if (actual <= allowed) {
    return makeEval(key, 'pass', `Allows ${allowedText}. You have ${actualText}.`);
  }
  return makeEval(
    key,
    'fail',
    `Allows ${allowedText}. You have ${actualText}, which is ${actual - allowed} over the limit.`,
  );
}

const evaluators: Record<RuleKey, Evaluator> = {
  min_tenth_pct: (r, p) => minimumRule('min_tenth_pct', r.min_tenth_pct, p.tenth_pct, '%', '10th'),
  min_twelfth_pct: (r, p) =>
    minimumRule('min_twelfth_pct', r.min_twelfth_pct, p.twelfth_pct, '%', '12th or diploma'),
  min_cgpa: (r, p) => minimumRule('min_cgpa', r.min_cgpa, p.cgpa, '', 'CGPA'),
  max_active_backlogs: (r, p) =>
    maximumRule('max_active_backlogs', r.max_active_backlogs, p.active_backlogs, 'active backlog', 'active backlogs'),
  max_gap_years: (r, p) => maximumRule('max_gap_years', r.max_gap_years, p.gap_years, 'gap year', 'gap years'),
  min_work_years: (r, p) => {
    if (r.min_work_years === null) {
      return makeEval('min_work_years', 'no_rule', 'No work experience required.');
    }
    const years = r.min_work_years;
    const label = `${formatNumber(years)} ${years === 1 ? 'year' : 'years'} of full-time work experience`;
    if (p.work_years === null) {
      return makeEval(
        'min_work_years',
        'unknown',
        `Needs ${label}. Add your work experience to your profile to check this.`,
      );
    }
    if (p.work_years >= years) {
      return makeEval('min_work_years', 'pass', `Needs ${label}. You have ${formatNumber(p.work_years)}.`);
    }
    return makeEval(
      'min_work_years',
      'fail',
      `Needs ${label}. You have ${formatNumber(p.work_years)}. Most students only reach this after graduating.`,
    );
  },
  grad_years: (r, p, ctx) => {
    if (r.grad_years === null) {
      return makeEval('grad_years', 'no_rule', 'Open to any graduation year.');
    }
    const list = r.grad_years.join(', ');
    if (ctx.expectedNextCycle) {
      // The batch list belongs to a cycle that has already closed. Guessing
      // next year's list would be inventing a rule, so this stays unknown.
      return makeEval(
        'grad_years',
        'unknown',
        `The last cycle was open to the ${list} batch. The next cycle has not announced its batches yet, so check this when it opens.`,
      );
    }
    if (p.grad_year === null) {
      return makeEval(
        'grad_years',
        'unknown',
        `Only for students graduating in ${list}. Add your graduation year to your profile to check this.`,
      );
    }
    if (r.grad_years.includes(p.grad_year)) {
      return makeEval('grad_years', 'pass', `Open to the ${list} batch. You graduate in ${p.grad_year}.`);
    }
    return makeEval(
      'grad_years',
      'fail',
      `Only for students graduating in ${list}. You graduate in ${p.grad_year}.`,
    );
  },
  branches: (r, p) => {
    if (r.branches === 'any') {
      return makeEval('branches', 'no_rule', 'Open to every branch.');
    }
    const list = r.branches.map((b) => BRANCH_LABELS[b]).join(', ');
    if (p.branch === null) {
      return makeEval(
        'branches',
        'unknown',
        `Only for ${list}. Add your branch to your profile to check this.`,
      );
    }
    if (r.branches.includes(p.branch)) {
      return makeEval('branches', 'pass', `Open to ${list}. Your branch, ${BRANCH_LABELS[p.branch]}, is on the list.`);
    }
    return makeEval(
      'branches',
      'fail',
      `Only for ${list}. Your branch is ${BRANCH_LABELS[p.branch]}.`,
    );
  },
  citizenship: (r, p) => {
    if (r.citizenship === 'any') {
      return makeEval('citizenship', 'no_rule', 'Open to any nationality.');
    }
    const list = r.citizenship.map((c) => CITIZENSHIP_LABELS[c]).join(' or ');
    if (p.citizenship === null) {
      return makeEval(
        'citizenship',
        'unknown',
        `Only for ${list}. Add your citizenship to your profile to check this.`,
      );
    }
    if (r.citizenship.includes(p.citizenship)) {
      return makeEval('citizenship', 'pass', `Only for ${list}. That matches your profile.`);
    }
    return makeEval('citizenship', 'fail', `Only for ${list}. Your profile says ${CITIZENSHIP_LABELS[p.citizenship]}.`);
  },
  gender: (r, p) => {
    if (r.gender === 'any') {
      return makeEval('gender', 'no_rule', 'Open to everyone regardless of gender.');
    }
    // Women-only program.
    if (p.gender === null || p.gender === 'prefer_not_to_say') {
      return makeEval(
        'gender',
        'unknown',
        'This program is for women. Your profile does not say, so this stays unchecked. You can leave it that way.',
      );
    }
    if (p.gender === 'woman') {
      return makeEval('gender', 'pass', 'This program is for women. That matches your profile.');
    }
    if (p.gender === 'non_binary') {
      return makeEval(
        'gender',
        'unknown',
        'This program is for women. Some women-focused programs also welcome non-binary applicants. Check the official page.',
      );
    }
    return makeEval('gender', 'fail', 'This program is for women only.');
  },
  requires_student: (r, p) => {
    if (!r.requires_student) {
      return makeEval('requires_student', 'no_rule', 'You do not need to be a current student.');
    }
    if (p.is_student === null) {
      return makeEval(
        'requires_student',
        'unknown',
        'You must be a currently enrolled student. Add your student status to your profile to check this.',
      );
    }
    if (p.is_student) {
      return makeEval('requires_student', 'pass', 'You must be a currently enrolled student. You are.');
    }
    return makeEval('requires_student', 'fail', 'You must be a currently enrolled student. Your profile says you are not.');
  },
};

/**
 * Evaluate one opportunity against one profile. `now` exists so tests can
 * pin the clock; the app never passes it.
 */
export function evaluateEligibility(
  opportunity: Opportunity,
  profile: UserProfile,
  now: Date = new Date(),
): EligibilityResult {
  const ctx: EvalContext = { expectedNextCycle: isExpectedNextCycle(opportunity.deadline, now) };
  const unconfirmed = opportunity.verification_status === 'needs_check';
  const rules = RULE_ORDER.map((key) => {
    const evaluation = evaluators[key](opportunity.rules, profile, ctx);
    // On an unconfirmed record a null rule means "nothing was found on the
    // official page", which is weaker than "the program has no such cutoff".
    // The status stays no_rule so the door is not shut, but the sentence
    // must not promise anything.
    if (unconfirmed && evaluation.status === 'no_rule') {
      return { ...evaluation, reason: UNCONFIRMED_NO_RULE[key] };
    }
    return evaluation;
  });

  const failed = rules.filter((r) => r.status === 'fail');
  const unknown = rules.filter((r) => r.status === 'unknown');
  const passed = rules.filter((r) => r.status === 'pass');
  const noRule = rules.filter((r) => r.status === 'no_rule');

  const status = failed.length > 0 ? 'not_eligible' : unknown.length > 0 ? 'unknown' : 'eligible';

  const missingFields = Array.from(
    new Set(
      unknown
        .map((r) => RULE_PROFILE_FIELD[r.key])
        // A filled-in gender that the rule cannot decide is not "missing".
        .filter((field) => profile[field] === null),
    ),
  );

  return { status, rules, failed, unknown, passed, noRule, missingFields };
}

export type EvaluatedOpportunity = {
  opportunity: Opportunity;
  eligibility: EligibilityResult;
};

/** Evaluate a whole list at once. Order is preserved. */
export function evaluateAll(
  opportunities: Opportunity[],
  profile: UserProfile,
  now: Date = new Date(),
): EvaluatedOpportunity[] {
  return opportunities.map((opportunity) => ({
    opportunity,
    eligibility: evaluateEligibility(opportunity, profile, now),
  }));
}

export type StatusTone = 'open' | 'check' | 'closed';

export type StatusSummary = {
  /** Short line for a card, e.g. "You qualify" or "Check 2 details". */
  headline: string;
  /** Lets the UI pick a colour without re-deriving the logic. */
  tone: StatusTone;
};

/**
 * The one place that turns a verdict into words for a card. A record whose
 * criteria could not be fully confirmed never gets an unqualified
 * "You qualify", even when every stored rule passes.
 */
export function summarizeStatus(opportunity: Opportunity, result: EligibilityResult): StatusSummary {
  if (result.status === 'not_eligible') {
    const first = result.failed[0];
    return { headline: `Closed: ${first.label.toLowerCase()}`, tone: 'closed' };
  }
  if (result.status === 'unknown') {
    const n = result.unknown.length;
    if (n === 1 && result.missingFields.length === 1) {
      return { headline: `Add your ${PROFILE_FIELD_LABELS[result.missingFields[0]]} to check`, tone: 'check' };
    }
    return { headline: n === 1 ? 'Check 1 detail' : `Check ${n} details`, tone: 'check' };
  }
  if (opportunity.verification_status === 'needs_check') {
    return { headline: 'Likely open, confirm the criteria', tone: 'check' };
  }
  return { headline: 'You qualify', tone: 'open' };
}

/** Plain labels for profile fields, used in prompts like "Add your CGPA". */
export const PROFILE_FIELD_LABELS: Record<keyof UserProfile, string> = {
  tenth_pct: '10th percentage',
  twelfth_pct: '12th percentage',
  cgpa: 'CGPA',
  active_backlogs: 'active backlog count',
  gap_years: 'gap years',
  branch: 'branch',
  grad_year: 'graduation year',
  citizenship: 'citizenship',
  gender: 'gender',
  is_student: 'student status',
  work_years: 'work experience',
};

/**
 * True when the program applies none of the five classic placement cutoffs.
 * The home screen uses this for the "No marks cutoff" badge.
 */
export function hasNoMarksCutoff(rules: EligibilityRules): boolean {
  return (
    rules.min_tenth_pct === null &&
    rules.min_twelfth_pct === null &&
    rules.min_cgpa === null &&
    rules.max_active_backlogs === null &&
    rules.max_gap_years === null
  );
}
