/**
 * Deadline helpers.
 *
 * Records store a deadline as 'YYYY-MM-DD', 'rolling' or 'tbd'. Everything
 * the UI shows about time (countdowns, "expected next cycle", sort order) is
 * derived here from the device clock, never stored in the data. That way a
 * record cannot silently go stale between app updates.
 */

import { Opportunity } from './types';

export type DeadlineInfo =
  | { kind: 'rolling' }
  | { kind: 'tbd' }
  | { kind: 'upcoming'; date: Date; daysLeft: number }
  | { kind: 'passed'; date: Date; daysAgo: number };

const DAY_MS = 24 * 60 * 60 * 1000;

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Parse 'YYYY-MM-DD' as a local calendar date. Returns null for bad input. */
export function parseIsoDate(value: string): Date | null {
  const match = ISO_DATE.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  // Reject things like 2026-02-30, which JS would silently roll forward.
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return date;
}

function startOfLocalDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

/**
 * Whole calendar days from `now` to the deadline. The deadline day itself
 * counts as still open (0 days left), because "closes 30 September" means
 * you can still apply on 30 September.
 */
export function getDeadlineInfo(deadline: Opportunity['deadline'], now: Date = new Date()): DeadlineInfo {
  if (deadline === 'rolling') return { kind: 'rolling' };
  if (deadline === 'tbd') return { kind: 'tbd' };

  const date = parseIsoDate(deadline);
  if (!date) {
    // A malformed date is a data bug. Treat it like "not announced" so the
    // app keeps working, and let the data tests catch it.
    return { kind: 'tbd' };
  }

  const diffDays = Math.round((startOfLocalDay(date) - startOfLocalDay(now)) / DAY_MS);
  if (diffDays >= 0) {
    return { kind: 'upcoming', date, daysLeft: diffDays };
  }
  return { kind: 'passed', date, daysAgo: -diffDays };
}

/** True when the stored deadline is in the past or not announced yet. */
export function isExpectedNextCycle(deadline: Opportunity['deadline'], now: Date = new Date()): boolean {
  const info = getDeadlineInfo(deadline, now);
  return info.kind === 'passed' || info.kind === 'tbd';
}

/** True when a reminder or countdown makes sense right now. */
export function isUpcoming(deadline: Opportunity['deadline'], now: Date = new Date()): boolean {
  return getDeadlineInfo(deadline, now).kind === 'upcoming';
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** '2026-09-30' -> '30 Sep 2026'. Locale-independent so it renders the same everywhere. */
export function formatDate(date: Date): string {
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * Short text for a card chip.
 * Examples: "Rolling", "Dates not announced", "Closes today", "3 days left",
 * "Expected next cycle".
 */
export function formatDeadlineShort(deadline: Opportunity['deadline'], now: Date = new Date()): string {
  const info = getDeadlineInfo(deadline, now);
  switch (info.kind) {
    case 'rolling':
      return 'Rolling';
    case 'tbd':
      return 'Dates not announced';
    case 'passed':
      return 'Expected next cycle';
    case 'upcoming':
      if (info.daysLeft === 0) return 'Closes today';
      if (info.daysLeft === 1) return '1 day left';
      return `${info.daysLeft} days left`;
  }
}

/**
 * Longer text for the detail screen.
 * Examples: "Closes 30 Sep 2026 (9 days left)", "Closed 15 Feb 2026. Applications usually open in January."
 */
export function formatDeadlineLong(opportunity: Opportunity, now: Date = new Date()): string {
  const info = getDeadlineInfo(opportunity.deadline, now);
  const window = opportunity.typical_window ? ` ${opportunity.typical_window}` : '';
  switch (info.kind) {
    case 'rolling':
      return `Rolling applications, no fixed deadline.${window}`;
    case 'tbd':
      return `Next cycle dates are not announced yet.${window}`;
    case 'passed':
      return `The last cycle closed on ${formatDate(info.date)}. Expected next cycle.${window}`;
    case 'upcoming':
      return `Closes ${formatDate(info.date)} (${formatDeadlineShort(opportunity.deadline, now).toLowerCase()}).`;
  }
}

/**
 * Days until the next anniversary of a passed deadline, counted from `now`.
 * A cycle that closed 11 months ago is probably about to reopen; one that
 * closed last week will not be back for almost a year.
 */
export function daysUntilAnniversary(date: Date, now: Date): number {
  const today = startOfLocalDay(now);
  let next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  while (next.getTime() <= today) {
    next = new Date(next.getFullYear() + 1, next.getMonth(), next.getDate());
  }
  return Math.round((next.getTime() - today) / DAY_MS);
}

/**
 * Sort key for lists: soonest real deadline first, then rolling, then
 * expected-next-cycle records ordered by how soon their usual window comes
 * round again, and tbd at the end.
 */
export function deadlineSortValue(deadline: Opportunity['deadline'], now: Date = new Date()): number {
  const info = getDeadlineInfo(deadline, now);
  switch (info.kind) {
    case 'upcoming':
      return info.daysLeft;
    case 'rolling':
      return 100_000;
    case 'passed':
      return 200_000 + daysUntilAnniversary(info.date, now);
    case 'tbd':
      return 300_000;
  }
}
