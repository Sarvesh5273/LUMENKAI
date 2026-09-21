import { ALL_RECORDS, OPPORTUNITIES, RECRUITERS } from '../data';
import { CATEGORIES } from '../lib/types';
import { validateOpportunities } from '../lib/validate';

/**
 * Every record that ships in the app must pass these checks. If you are
 * adding or editing a record, run `pnpm test` and read the failure message:
 * it names the record id and the field.
 */
describe('shipped dataset', () => {
  test('every record passes the schema and cross-record checks', () => {
    const issues = validateOpportunities(ALL_RECORDS);
    const report = issues.map((i) => `${i.id} -> ${i.path}: ${i.message}`).join('\n');
    expect(report).toBe('');
  });

  test('home screen records use one of the five home categories', () => {
    for (const record of OPPORTUNITIES) {
      expect(CATEGORIES).toContain(record.category);
    }
  });

  test('a needs_check record never claims a verified absence of cutoffs in its notes', () => {
    // Belt and braces: the engine hedges the wording, but the notes are
    // shown verbatim, so they must not read like a confirmed "no criteria".
    for (const record of ALL_RECORDS) {
      if (record.verification_status === 'needs_check') {
        expect(record.notes.trim().length).toBeGreaterThanOrEqual(20);
      }
    }
  });

  test('recruiter records are kept out of the home list', () => {
    for (const record of RECRUITERS) {
      expect(record.category).toBe('mass_recruiter');
    }
    const homeIds = new Set(OPPORTUNITIES.map((r) => r.id));
    for (const record of RECRUITERS) {
      expect(homeIds.has(record.id)).toBe(false);
    }
  });
});

describe('validation clock', () => {
  test('a deadline is not treated as passed until the day after, matching the app', () => {
    const record = {
      ...ALL_RECORDS.find((r) => r.id === 'tcs-nqt')!,
      deadline: '2026-03-20',
      typical_window: null,
    };
    // On the deadline day itself, at 11 pm local time, the window is still open.
    const onTheDay = validateOpportunities([record], new Date(2026, 2, 20, 23, 0));
    expect(onTheDay.some((i) => i.path === 'typical_window')).toBe(false);
    // The next morning it has passed and a typical window becomes mandatory.
    const dayAfter = validateOpportunities([record], new Date(2026, 2, 21, 1, 0));
    expect(dayAfter.some((i) => i.path === 'typical_window')).toBe(true);
  });
});
