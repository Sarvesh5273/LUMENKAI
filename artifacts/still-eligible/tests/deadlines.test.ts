import {
  daysUntilAnniversary,
  deadlineSortValue,
  formatDate,
  formatDeadlineLong,
  formatDeadlineShort,
  getDeadlineInfo,
  isExpectedNextCycle,
  isUpcoming,
  parseIsoDate,
} from '../lib/deadlines';
import { Opportunity } from '../lib/types';

// A fixed "now" so the tests do not depend on the day they run.
const NOW = new Date(2026, 8, 21, 15, 30); // 21 Sep 2026, 3:30 pm local

describe('parseIsoDate', () => {
  test('parses a real date as local midnight', () => {
    const date = parseIsoDate('2026-09-30');
    expect(date).not.toBeNull();
    expect(date!.getFullYear()).toBe(2026);
    expect(date!.getMonth()).toBe(8);
    expect(date!.getDate()).toBe(30);
    expect(date!.getHours()).toBe(0);
  });

  test('rejects malformed and impossible dates', () => {
    expect(parseIsoDate('2026-9-30')).toBeNull();
    expect(parseIsoDate('30-09-2026')).toBeNull();
    expect(parseIsoDate('2026-02-30')).toBeNull();
    expect(parseIsoDate('rolling')).toBeNull();
  });
});

describe('getDeadlineInfo', () => {
  test('rolling and tbd pass through', () => {
    expect(getDeadlineInfo('rolling', NOW)).toEqual({ kind: 'rolling' });
    expect(getDeadlineInfo('tbd', NOW)).toEqual({ kind: 'tbd' });
  });

  test('counts whole calendar days, and the deadline day is still open', () => {
    expect(getDeadlineInfo('2026-09-30', NOW)).toMatchObject({ kind: 'upcoming', daysLeft: 9 });
    expect(getDeadlineInfo('2026-09-22', NOW)).toMatchObject({ kind: 'upcoming', daysLeft: 1 });
    expect(getDeadlineInfo('2026-09-21', NOW)).toMatchObject({ kind: 'upcoming', daysLeft: 0 });
    expect(getDeadlineInfo('2026-09-20', NOW)).toMatchObject({ kind: 'passed', daysAgo: 1 });
  });

  test('a malformed stored date degrades to tbd instead of crashing', () => {
    expect(getDeadlineInfo('2026-13-01', NOW)).toEqual({ kind: 'tbd' });
  });
});

describe('formatting', () => {
  test('short chip text', () => {
    expect(formatDeadlineShort('rolling', NOW)).toBe('Rolling');
    expect(formatDeadlineShort('tbd', NOW)).toBe('Dates not announced');
    expect(formatDeadlineShort('2026-09-21', NOW)).toBe('Closes today');
    expect(formatDeadlineShort('2026-09-22', NOW)).toBe('1 day left');
    expect(formatDeadlineShort('2026-09-30', NOW)).toBe('9 days left');
    expect(formatDeadlineShort('2026-02-15', NOW)).toBe('Expected next cycle');
  });

  test('formatDate is locale independent', () => {
    expect(formatDate(new Date(2026, 8, 30))).toBe('30 Sep 2026');
    expect(formatDate(new Date(2027, 0, 5))).toBe('5 Jan 2027');
  });

  test('long text includes the typical window when the cycle has passed', () => {
    const base = {
      deadline: '2026-02-15',
      typical_window: 'Applications usually open in late January and close mid February.',
    } as Opportunity;
    expect(formatDeadlineLong(base, NOW)).toBe(
      'The last cycle closed on 15 Feb 2026. Expected next cycle. Applications usually open in late January and close mid February.',
    );
    expect(formatDeadlineLong({ ...base, deadline: '2026-09-30' }, NOW)).toBe('Closes 30 Sep 2026 (9 days left).');
    expect(formatDeadlineLong({ ...base, deadline: 'tbd' }, NOW)).toBe(
      'Next cycle dates are not announced yet. Applications usually open in late January and close mid February.',
    );
    expect(formatDeadlineLong({ deadline: 'rolling', typical_window: null } as Opportunity, NOW)).toBe(
      'Rolling applications, no fixed deadline.',
    );
  });
});

describe('predicates and sorting', () => {
  test('isExpectedNextCycle and isUpcoming', () => {
    expect(isExpectedNextCycle('2026-02-15', NOW)).toBe(true);
    expect(isExpectedNextCycle('tbd', NOW)).toBe(true);
    expect(isExpectedNextCycle('2026-09-30', NOW)).toBe(false);
    expect(isExpectedNextCycle('rolling', NOW)).toBe(false);
    expect(isUpcoming('2026-09-30', NOW)).toBe(true);
    expect(isUpcoming('rolling', NOW)).toBe(false);
  });

  test('sort order: soonest first, then rolling, then passed by next expected window, then tbd', () => {
    // NOW is 21 Sep 2026. 2026-02-15 comes round again in about 5 months;
    // 2026-08-30 closed three weeks ago and is almost a year away.
    const deadlines: Opportunity['deadline'][] = ['tbd', '2026-08-30', '2026-02-15', 'rolling', '2026-10-05', '2026-09-25'];
    const sorted = [...deadlines].sort((a, b) => deadlineSortValue(a, NOW) - deadlineSortValue(b, NOW));
    expect(sorted).toEqual(['2026-09-25', '2026-10-05', 'rolling', '2026-02-15', '2026-08-30', 'tbd']);
  });

  test('daysUntilAnniversary counts to the next occurrence of the calendar date', () => {
    expect(daysUntilAnniversary(new Date(2026, 8, 20), NOW)).toBe(364);
    expect(daysUntilAnniversary(new Date(2025, 8, 22), NOW)).toBe(1);
    // The anniversary that falls today is treated as passed; the next one is a year out.
    expect(daysUntilAnniversary(new Date(2024, 8, 21), NOW)).toBe(365);
  });
});
