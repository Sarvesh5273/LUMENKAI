import {
  analyzeClosedDoors,
  describeCaveat,
  describeFix,
  describeLadder,
  describeSummary,
  describeWait,
} from '../lib/closed-doors';
import { Opportunity, UserProfile } from '../lib/types';
import { OPPORTUNITIES } from '../data';

const NOW = new Date(2026, 8, 21);
const FUTURE = '2026-12-31';

function record(id: string, rules: Partial<Opportunity['rules']> = {}, extra: Partial<Opportunity> = {}): Opportunity {
  return {
    id,
    title: `Program ${id}`,
    org: 'Test Org',
    category: 'company_drives',
    summary: 'Used only in tests.',
    benefit: { kind: 'paid_role', what_you_get: 'A job.', amount_text: null, amount_status: 'unchecked', amount_source: null },
    location: { mode: 'remote', place: null },
    apply: { what_you_need: null, how_they_select: null, beginner_friendly: null, application_fee: null, fee_status: 'unchecked' },
    official_url: 'https://example.org/apply',
    source_url: 'https://example.org/rules',
    last_verified: '2026-09-21',
    deadline: FUTURE,
    typical_window: null,
    rules: {
      min_tenth_pct: null,
      min_twelfth_pct: null,
      min_cgpa: null,
      max_active_backlogs: null,
      max_gap_years: null,
      grad_years: null,
      citizenship: 'any',
      gender: 'any',
      requires_student: false,
      branches: 'any',
      min_work_years: null,
      ...rules,
    },
    verification_status: 'verified',
    tags: [],
    notes: '',
    alternative_ids: [],
    ...extra,
  };
}

const student: UserProfile = {
  tenth_pct: 70,
  twelfth_pct: 65,
  cgpa: 6.8,
  active_backlogs: 2,
  gap_years: 1,
  branch: 'ME',
  grad_year: 2028,
  citizenship: 'IN',
  gender: 'man',
  is_student: true,
  work_years: 0,
};

describe('analyzeClosedDoors', () => {
  it('ignores doors the profile passes or cannot settle', () => {
    const open = record('open');
    const unknown = record('unknown', { min_cgpa: 7 });
    const report = analyzeClosedDoors([open, unknown], { ...student, cgpa: null }, NOW);
    expect(report.doors).toHaveLength(0);
    expect(describeSummary(report.summary)).toBe('No door is closed to your profile right now.');
  });

  it('puts a door shut only by CGPA in the fixable group with the exact gap', () => {
    const report = analyzeClosedDoors([record('cgpa', { min_cgpa: 7 })], student, NOW);
    expect(report.doors).toHaveLength(1);
    const door = report.doors[0];
    expect(door.group).toBe('fixable');
    expect(door.blockers.map((b) => b.key)).toEqual(['min_cgpa']);
    expect(door.fixes).toEqual([{ kind: 'cgpa', target: 7, current: 6.8, gap: 0.2 }]);
    expect(describeFix(door.fixes[0])).toBe('Raise your CGPA to 7. You have 6.8, so 0.2 more.');
  });

  it('describes a backlog fix as the number to clear', () => {
    const report = analyzeClosedDoors(
      [record('one', { max_active_backlogs: 1 }), record('none', { max_active_backlogs: 0 })],
      student,
      NOW,
    );
    const byId = Object.fromEntries(report.doors.map((d) => [d.opportunity.id, d]));
    expect(describeFix(byId.one.fixes[0])).toBe('Clear 1 of your 2 active backlogs. This program allows at most 1.');
    expect(describeFix(byId.none.fixes[0])).toBe('Clear all 2 active backlogs. This program allows none.');
    expect(describeFix({ kind: 'backlogs', allowed: 0, current: 1, clear: 1 })).toBe(
      'Clear your 1 active backlog. This program allows none.',
    );
  });

  it('lists both fixes when CGPA and backlogs both block', () => {
    const report = analyzeClosedDoors([record('both', { min_cgpa: 7.5, max_active_backlogs: 0 })], student, NOW);
    expect(report.doors[0].group).toBe('fixable');
    expect(report.doors[0].fixes.map((f) => f.kind)).toEqual(['cgpa', 'backlogs']);
  });

  it('marks a door shut by a fixed field as permanent and offers no fix', () => {
    const report = analyzeClosedDoors(
      [record('twelfth', { min_twelfth_pct: 70, min_cgpa: 7 })],
      student,
      NOW,
    );
    const door = report.doors[0];
    expect(door.group).toBe('permanent');
    expect(door.fixes).toEqual([]);
    // Both blockers are still reported, so the student sees the whole picture.
    expect(door.blockers.map((b) => b.key)).toEqual(['min_twelfth_pct', 'min_cgpa']);
  });

  it.each([
    ['min_tenth_pct', { min_tenth_pct: 75 }],
    ['max_gap_years', { max_gap_years: 0 }],
    ['branches', { branches: ['CSE'] }],
    ['citizenship', { citizenship: ['OTHER'] }],
    ['gender', { gender: 'women' }],
    ['requires_student', { requires_student: true }],
  ] as const)('treats %s as permanent', (_key, rules) => {
    const profile = _key === 'requires_student' ? { ...student, is_student: false } : student;
    const report = analyzeClosedDoors([record('p', rules as Partial<Opportunity['rules']>)], profile, NOW);
    expect(report.doors[0].group).toBe('permanent');
  });

  it('puts a younger batch and missing work experience in the later group with a factual wait line', () => {
    const report = analyzeClosedDoors(
      [record('batch', { grad_years: [2026, 2027] }), record('work', { min_work_years: 2 })],
      student, // graduates 2028, after every listed batch
      NOW,
    );
    expect(report.doors.map((d) => d.group)).toEqual(['later', 'later']);
    const byId = Object.fromEntries(report.doors.map((d) => [d.opportunity.id, d]));
    expect(describeWait(byId.batch)).toBe(
      'Your batch comes after the ones named this cycle. Check the batch list when the next cycle opens.',
    );
    expect(describeWait(byId.work)).toMatch(/after graduating/);
    expect(describeWait(byId.batch)).not.toMatch(/usually/);
  });

  it('treats a batch list of younger batches as closed for good', () => {
    // Graduating 2026 while the cycle names 2027 and 2028: no later list reaches back.
    const older = { ...student, grad_year: 2026 };
    const report = analyzeClosedDoors([record('batch', { grad_years: [2027, 2028] })], older, NOW);
    expect(report.doors[0].group).toBe('permanent');
  });

  it('a temporary blocker plus a CGPA blocker is later, and still lists the CGPA fix', () => {
    const report = analyzeClosedDoors([record('mix', { grad_years: [2027], min_cgpa: 7 })], student, NOW);
    expect(report.doors[0].group).toBe('later');
    expect(report.doors[0].fixes).toEqual([{ kind: 'cgpa', target: 7, current: 6.8, gap: 0.2 }]);
  });

  it('says what a fix does not settle', () => {
    const clean = record('clean', { min_cgpa: 7 });
    const withUnknown = record('unknown', { min_cgpa: 7, branches: ['CSE'] });
    const unconfirmed = { ...record('unconfirmed', { min_cgpa: 7 }), verification_status: 'needs_check' as const };
    const report = analyzeClosedDoors([clean, withUnknown, unconfirmed], { ...student, branch: null }, NOW);
    const byId = Object.fromEntries(report.doors.map((d) => [d.opportunity.id, d]));
    expect(describeCaveat(byId.clean)).toBe('');
    expect(describeCaveat(byId.unknown)).toBe('Even then, one rule is still unchecked: branch.');
    expect(describeCaveat(byId.unconfirmed)).toMatch(/not fully confirmed/);
    // Only the clean door counts as opening on the ladder.
    expect(report.summary.cgpaLadder).toEqual([{ target: 7, opens: 1 }]);
  });

  it('does not count a closed cycle batch list as a blocker', () => {
    // A passed deadline turns grad_years into unknown, so the door is not closed at all.
    const report = analyzeClosedDoors([record('old', { grad_years: [2026] }, { deadline: '2026-03-31' })], student, NOW);
    expect(report.doors).toHaveLength(0);
  });

  it('orders fixable doors in tiers: backlogs only, CGPA only by gap, then both', () => {
    const report = analyzeClosedDoors(
      [
        record('both', { min_cgpa: 6.9, max_active_backlogs: 0 }),
        record('far', { min_cgpa: 8 }),
        record('perm', { min_tenth_pct: 80 }),
        record('near', { min_cgpa: 7 }),
        record('later', { min_work_years: 1 }),
        record('backlog', { max_active_backlogs: 1 }),
      ],
      student,
      NOW,
    );
    expect(report.doors.map((d) => d.opportunity.id)).toEqual(['backlog', 'near', 'far', 'both', 'later', 'perm']);
  });

  it('builds the CGPA ladder cumulatively from CGPA-only doors', () => {
    const report = analyzeClosedDoors(
      [
        record('a', { min_cgpa: 7 }),
        record('b', { min_cgpa: 7 }),
        record('c', { min_cgpa: 7.5 }),
        record('d', { min_cgpa: 8 }),
        record('e', { min_cgpa: 8.5 }),
        record('f', { min_cgpa: 7, max_active_backlogs: 0 }), // needs both, not on the ladder
        record('g', { max_active_backlogs: 0 }),
      ],
      student,
      NOW,
    );
    expect(report.summary).toMatchObject({ total: 7, fixable: 7, later: 0, permanent: 0, backlogOnlyDoors: 1 });
    expect(report.summary.cgpaLadder).toEqual([
      { target: 7, opens: 2 },
      { target: 7.5, opens: 3 },
      { target: 8, opens: 4 },
    ]);
    expect(describeLadder(report.summary)).toBe('CGPA 7 opens 2 doors, 7.5 opens 3 doors, 8 opens 4 doors, nothing else needed.');
    expect(describeSummary(report.summary)).toBe(
      '7 doors are closed to your profile. 7 of them come down to your CGPA or backlogs, which you can still change.',
    );
  });

  it('keeps only the alternatives the profile does not fail', () => {
    const closedAlt = record('closed-alt', { min_tenth_pct: 90 });
    const openAlt = record('open-alt');
    const door = record('door', { min_cgpa: 9 }, { alternative_ids: ['closed-alt', 'open-alt', 'missing'] });
    const report = analyzeClosedDoors([door, closedAlt, openAlt], student, NOW);
    const main = report.doors.find((d) => d.opportunity.id === 'door')!;
    expect(main.openAlternatives.map((a) => a.id)).toEqual(['open-alt']);
  });

  it('runs over the real dataset without an unexplained door', () => {
    const report = analyzeClosedDoors(OPPORTUNITIES, student, NOW);
    for (const door of report.doors) {
      expect(door.blockers.length).toBeGreaterThan(0);
      if (door.group === 'fixable') {
        expect(door.fixes.length).toBeGreaterThan(0);
      } else if (door.group === 'permanent') {
        expect(door.fixes).toEqual([]);
      }
    }
    expect(report.summary.total).toBe(report.summary.fixable + report.summary.later + report.summary.permanent);
  });
});
