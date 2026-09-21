import { evaluateEligibility, evaluateAll, hasNoMarksCutoff, summarizeStatus } from '../lib/engine';
import { EMPTY_PROFILE, Opportunity, UserProfile } from '../lib/types';

// Every test pins the clock so a stored deadline never flips from upcoming
// to passed depending on the day the suite runs.
const NOW = new Date(2026, 8, 21);
const FUTURE = '2026-12-31';
const PAST = '2026-03-31';

/** A record with no cutoffs at all, like most open source programs. */
function openRecord(overrides: Partial<Opportunity['rules']> = {}): Opportunity {
  return {
    id: 'test-open',
    title: 'Test Open Program',
    org: 'Test Org',
    category: 'open_source',
    summary: 'A program with no cutoffs, used only in tests.',
    benefit: { kind: 'stipend', what_you_get: 'A stipend for the test.', amount_text: null, amount_status: 'unchecked', amount_source: null },
    location: { mode: 'remote', place: 'Open worldwide' },
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
      ...overrides,
    },
    verification_status: 'verified',
    tags: ['test'],
    notes: '',
    alternative_ids: [],
  };
}

/** A company drive style record with the classic five cutoffs. */
function recruiterRecord(): Opportunity {
  return {
    ...openRecord({
      min_tenth_pct: 60,
      min_twelfth_pct: 60,
      min_cgpa: 6,
      max_active_backlogs: 1,
      max_gap_years: 2,
      grad_years: [2027],
      branches: ['CSE', 'IT', 'ECE'],
      requires_student: true,
    }),
    id: 'test-recruiter',
    category: 'company_drives',
  };
}

const fullProfile: UserProfile = {
  tenth_pct: 85,
  twelfth_pct: 78,
  cgpa: 7.4,
  active_backlogs: 0,
  gap_years: 0,
  branch: 'CSE',
  grad_year: 2027,
  citizenship: 'IN',
  gender: 'man',
  is_student: true,
  work_years: 0,
};

describe('evaluateEligibility', () => {
  test('a program with no cutoffs is eligible even for an empty profile', () => {
    const result = evaluateEligibility(openRecord(), EMPTY_PROFILE, NOW);
    expect(result.status).toBe('eligible');
    expect(result.failed).toHaveLength(0);
    expect(result.unknown).toHaveLength(0);
    expect(result.noRule).toHaveLength(11);
    expect(result.missingFields).toEqual([]);
  });

  test('a full profile that meets every cutoff is eligible', () => {
    const result = evaluateEligibility(recruiterRecord(), fullProfile, NOW);
    expect(result.status).toBe('eligible');
    expect(result.passed.map((r) => r.key)).toEqual([
      'min_tenth_pct',
      'min_twelfth_pct',
      'min_cgpa',
      'max_active_backlogs',
      'max_gap_years',
      'grad_years',
      'branches',
      'requires_student',
    ]);
  });

  test('a single failed cutoff makes the whole record not eligible and says by how much', () => {
    const result = evaluateEligibility(recruiterRecord(), { ...fullProfile, twelfth_pct: 58 }, NOW);
    expect(result.status).toBe('not_eligible');
    expect(result.failed).toHaveLength(1);
    expect(result.failed[0].key).toBe('min_twelfth_pct');
    expect(result.failed[0].reason).toBe('Needs 60% in 12th or diploma. You have 58%, which is 2% short.');
  });

  test('missing profile fields produce unknown, never fail', () => {
    const result = evaluateEligibility(recruiterRecord(), { ...fullProfile, cgpa: null, gap_years: null }, NOW);
    expect(result.status).toBe('unknown');
    expect(result.failed).toHaveLength(0);
    expect(result.unknown.map((r) => r.key)).toEqual(['min_cgpa', 'max_gap_years']);
    expect(result.missingFields).toEqual(['cgpa', 'gap_years']);
  });

  test('a fail outranks an unknown', () => {
    const result = evaluateEligibility(recruiterRecord(), { ...fullProfile, cgpa: null, active_backlogs: 3 }, NOW);
    expect(result.status).toBe('not_eligible');
    expect(result.failed[0].reason).toBe('Allows at most 1 active backlog. You have 3 active backlogs, which is 2 over the limit.');
  });

  test('zero-limit rules read naturally', () => {
    const record = openRecord({ max_active_backlogs: 0 });
    const pass = evaluateEligibility(record, { ...fullProfile, active_backlogs: 0 }, NOW);
    expect(pass.passed[0].reason).toBe('Allows no active backlogs. You have 0 active backlogs.');
    const fail = evaluateEligibility(record, { ...fullProfile, active_backlogs: 1 }, NOW);
    expect(fail.failed[0].reason).toBe('Allows no active backlogs. You have 1 active backlog, which is 1 over the limit.');
  });

  test('graduation year and branch restrictions', () => {
    const record = recruiterRecord();
    const wrongYear = evaluateEligibility(record, { ...fullProfile, grad_year: 2028 }, NOW);
    expect(wrongYear.failed[0].reason).toBe('Only for students graduating in 2027. You graduate in 2028.');
    const wrongBranch = evaluateEligibility(record, { ...fullProfile, branch: 'ME' }, NOW);
    expect(wrongBranch.failed[0].reason).toBe(
      'Only for Computer Science, Information Technology, Electronics and Communication. Your branch is Mechanical.',
    );
  });

  test('citizenship restrictions', () => {
    const record = openRecord({ citizenship: ['IN'] });
    expect(evaluateEligibility(record, fullProfile, NOW).status).toBe('eligible');
    expect(evaluateEligibility(record, { ...fullProfile, citizenship: 'OTHER' }, NOW).status).toBe('not_eligible');
    expect(evaluateEligibility(record, { ...fullProfile, citizenship: null }, NOW).status).toBe('unknown');
  });

  test('women-only programs: woman passes, man fails, unset and prefer-not stay unknown', () => {
    const record = openRecord({ gender: 'women' });
    expect(evaluateEligibility(record, { ...fullProfile, gender: 'woman' }, NOW).status).toBe('eligible');
    expect(evaluateEligibility(record, { ...fullProfile, gender: 'man' }, NOW).status).toBe('not_eligible');
    expect(evaluateEligibility(record, { ...fullProfile, gender: null }, NOW).status).toBe('unknown');
    expect(evaluateEligibility(record, { ...fullProfile, gender: 'prefer_not_to_say' }, NOW).status).toBe('unknown');
    expect(evaluateEligibility(record, { ...fullProfile, gender: 'non_binary' }, NOW).status).toBe('unknown');
  });

  test('a filled-in gender the rule cannot decide is not reported as a missing field', () => {
    const record = openRecord({ gender: 'women' });
    const result = evaluateEligibility(record, { ...fullProfile, gender: 'prefer_not_to_say' }, NOW);
    expect(result.status).toBe('unknown');
    expect(result.missingFields).toEqual([]);
  });

  test('student status requirement', () => {
    const record = openRecord({ requires_student: true });
    expect(evaluateEligibility(record, fullProfile, NOW).status).toBe('eligible');
    expect(evaluateEligibility(record, { ...fullProfile, is_student: false }, NOW).status).toBe('not_eligible');
    expect(evaluateEligibility(record, { ...fullProfile, is_student: null }, NOW).status).toBe('unknown');
  });

  test('work experience requirement, the Chevening case', () => {
    const record = openRecord({ min_work_years: 2 });
    const result = evaluateEligibility(record, fullProfile, NOW);
    expect(result.status).toBe('not_eligible');
    expect(result.failed[0].reason).toBe(
      'Needs 2 years of full-time work experience. You have 0. Most students only reach this after graduating.',
    );
    expect(evaluateEligibility(record, { ...fullProfile, work_years: 2 }, NOW).status).toBe('eligible');
  });

  test('decimal cutoffs format cleanly', () => {
    const record = openRecord({ min_cgpa: 7.5 });
    const result = evaluateEligibility(record, { ...fullProfile, cgpa: 7.25 }, NOW);
    expect(result.failed[0].reason).toBe('Needs 7.5 in CGPA. You have 7.25, which is 0.25 short.');
  });

  test('a boundary value passes (exactly the cutoff)', () => {
    const record = openRecord({ min_cgpa: 6 });
    expect(evaluateEligibility(record, { ...fullProfile, cgpa: 6 }, NOW).status).toBe('eligible');
  });
});

describe('batch lists after a cycle has closed', () => {
  test('an open cycle compares graduation year strictly', () => {
    const record = { ...openRecord({ grad_years: [2027] }), deadline: FUTURE };
    expect(evaluateEligibility(record, { ...fullProfile, grad_year: 2028 }, NOW).status).toBe('not_eligible');
  });

  test('a closed cycle turns the batch rule into unknown instead of shutting the door', () => {
    const record = { ...openRecord({ grad_years: [2027] }), deadline: PAST, typical_window: 'Usually opens in March.' };
    const result = evaluateEligibility(record, { ...fullProfile, grad_year: 2028 }, NOW);
    expect(result.status).toBe('unknown');
    expect(result.unknown[0].key).toBe('grad_years');
    expect(result.unknown[0].reason).toBe(
      'The last cycle was open to the 2027 batch. The next cycle has not announced its batches yet, so check this when it opens.',
    );
    // The student's graduation year is filled in, so nothing is "missing".
    expect(result.missingFields).toEqual([]);
  });

  test('a tbd deadline is treated the same way as a closed cycle', () => {
    const record = { ...openRecord({ grad_years: [2027] }), deadline: 'tbd' as const, typical_window: 'Usually opens in March.' };
    expect(evaluateEligibility(record, { ...fullProfile, grad_year: 2027 }, NOW).status).toBe('unknown');
  });

  test('a rolling record with a batch list still compares strictly', () => {
    const record = { ...openRecord({ grad_years: [2027] }), deadline: 'rolling' as const };
    expect(evaluateEligibility(record, { ...fullProfile, grad_year: 2027 }, NOW).status).toBe('eligible');
    expect(evaluateEligibility(record, { ...fullProfile, grad_year: 2028 }, NOW).status).toBe('not_eligible');
  });
});

describe('null rules on an unconfirmed record', () => {
  test('a verified record states the absence of a cutoff as a fact', () => {
    const result = evaluateEligibility(openRecord(), fullProfile, NOW);
    expect(result.noRule.find((r) => r.key === 'min_cgpa')?.reason).toBe('No minimum CGPA required.');
  });

  test('a needs_check record only says nothing was found', () => {
    const record = { ...openRecord(), verification_status: 'needs_check' as const };
    const result = evaluateEligibility(record, fullProfile, NOW);
    const cgpa = result.noRule.find((r) => r.key === 'min_cgpa');
    expect(cgpa?.status).toBe('no_rule');
    expect(cgpa?.reason).toBe('No CGPA cutoff was found on the official page. Not confirmed yet, see the notes.');
    // Every null rule gets the hedged wording, none of the old promises survive.
    expect(result.noRule.every((r) => r.reason.includes('Not confirmed yet'))).toBe(true);
    // The door is still not shut: the overall status is unchanged.
    expect(result.status).toBe('eligible');
  });

  test('a real cutoff on a needs_check record is still evaluated normally', () => {
    const record = { ...openRecord({ min_cgpa: 6 }), verification_status: 'needs_check' as const };
    const result = evaluateEligibility(record, { ...fullProfile, cgpa: 5 }, NOW);
    expect(result.status).toBe('not_eligible');
    expect(result.failed[0].key).toBe('min_cgpa');
  });
});

describe('summarizeStatus', () => {
  test('verified and eligible says You qualify', () => {
    const record = openRecord();
    expect(summarizeStatus(record, evaluateEligibility(record, fullProfile, NOW))).toEqual({
      headline: 'You qualify',
      tone: 'open',
    });
  });

  test('needs_check never gets an unqualified You qualify', () => {
    const record = { ...openRecord(), verification_status: 'needs_check' as const };
    expect(summarizeStatus(record, evaluateEligibility(record, fullProfile, NOW))).toEqual({
      headline: 'Likely open, confirm the criteria',
      tone: 'check',
    });
  });

  test('one missing field names the field', () => {
    const record = openRecord({ min_cgpa: 6 });
    const summary = summarizeStatus(record, evaluateEligibility(record, { ...fullProfile, cgpa: null }, NOW));
    expect(summary).toEqual({ headline: 'Add your CGPA to check', tone: 'check' });
  });

  test('several unknowns count them', () => {
    const record = recruiterRecord();
    const summary = summarizeStatus(record, evaluateEligibility(record, { ...fullProfile, cgpa: null, gap_years: null }, NOW));
    expect(summary).toEqual({ headline: 'Check 2 details', tone: 'check' });
  });

  test('a failure names the rule that closed the door', () => {
    const record = recruiterRecord();
    const summary = summarizeStatus(record, evaluateEligibility(record, { ...fullProfile, twelfth_pct: 40 }, NOW));
    expect(summary).toEqual({ headline: 'Closed: 12th percentage', tone: 'closed' });
  });
});

describe('evaluateAll and helpers', () => {
  test('evaluateAll preserves order and evaluates every record', () => {
    const results = evaluateAll([openRecord(), recruiterRecord()], EMPTY_PROFILE, NOW);
    expect(results.map((r) => r.opportunity.id)).toEqual(['test-open', 'test-recruiter']);
    expect(results[0].eligibility.status).toBe('eligible');
    expect(results[1].eligibility.status).toBe('unknown');
  });

  test('hasNoMarksCutoff only looks at the five classic cutoffs', () => {
    expect(hasNoMarksCutoff(openRecord().rules)).toBe(true);
    expect(hasNoMarksCutoff(openRecord({ requires_student: true, citizenship: ['IN'] }).rules)).toBe(true);
    expect(hasNoMarksCutoff(openRecord({ min_cgpa: 6 }).rules)).toBe(false);
    expect(hasNoMarksCutoff(openRecord({ max_gap_years: 1 }).rules)).toBe(false);
  });
});
