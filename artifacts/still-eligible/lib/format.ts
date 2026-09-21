/**
 * Plain-text renderings of the money, location and apply-ready fields.
 *
 * Kept out of the components so the wording is tested once and shared by the
 * card, the detail screen and the share text.
 */

import {
  ApplyReady,
  Benefit,
  BENEFIT_KIND_LABELS,
  Location,
  LOCATION_MODE_LABELS,
  Opportunity,
  BRANCH_LABELS,
} from './types';

/** Short money line for a card: the amount if the page states one, else the kind. */
export function formatBenefitShort(benefit: Benefit): string {
  if (benefit.amount_status === 'stated' && benefit.amount_text) {
    return benefit.amount_text;
  }
  return BENEFIT_KIND_LABELS[benefit.kind];
}

/**
 * The one-line amount note under "What you get" on the detail screen. Each
 * status is worded differently so an unread page is never presented as a
 * program that pays nothing.
 */
export function formatAmountNote(benefit: Benefit): string {
  switch (benefit.amount_status) {
    case 'stated':
      return `Amount on the official page: ${benefit.amount_text}.`;
    case 'not_stated':
      return 'The official page does not state an amount.';
    case 'unchecked':
      return 'Amount not recorded yet. Check the official page.';
  }
}

/** "Remote: Open worldwide" or "On-site: Bengaluru". Place text is kept as written since it is usually a proper noun. */
export function formatLocation(location: Location): string {
  const mode = LOCATION_MODE_LABELS[location.mode];
  if (!location.place) return mode;
  return `${mode}: ${location.place}`;
}

export const FREE_TO_APPLY_LINE = 'Free to apply. Never pay anyone to get you in.';
export const FEE_UNCHECKED_LINE = 'Fee not recorded yet. Check the official page, and never pay a middleman to get you in.';

/**
 * Only a fee someone has checked is called free. An unchecked fee says so;
 * a paid one quotes the page and tells the student to pay only there.
 */
export function formatApplicationFee(apply: ApplyReady): string {
  switch (apply.fee_status) {
    case 'free':
      return FREE_TO_APPLY_LINE;
    case 'paid':
      return `${apply.application_fee ?? 'There is a fee'}. Pay only on the official page.`;
    default:
      return FEE_UNCHECKED_LINE;
  }
}

export const NOT_RECORDED_LINE = 'Not recorded yet. Read the official page before you start.';

/**
 * One plain sentence describing who can apply, built from the rules the
 * record actually has. Used by the share text so a friend sees the gate
 * before they open the link.
 */
export function describeWhoCanApply(opportunity: Opportunity): string {
  const r = opportunity.rules;
  const parts: string[] = [];

  if (r.gender === 'women') parts.push('women only');
  if (r.requires_student) parts.push('current students');
  if (r.branches !== 'any') parts.push(r.branches.map((b) => BRANCH_LABELS[b]).join(', '));
  if (r.grad_years) parts.push(`batch of ${r.grad_years.join(', ')}`);
  if (r.citizenship !== 'any') parts.push(r.citizenship.includes('IN') && r.citizenship.length === 1 ? 'Indian citizens' : 'restricted nationalities');
  if (r.min_tenth_pct !== null) parts.push(`10th ${r.min_tenth_pct}%+`);
  if (r.min_twelfth_pct !== null) parts.push(`12th ${r.min_twelfth_pct}%+`);
  if (r.min_cgpa !== null) parts.push(`CGPA ${r.min_cgpa}+`);
  if (r.max_active_backlogs !== null) parts.push(r.max_active_backlogs === 0 ? 'no active backlogs' : `up to ${r.max_active_backlogs} active backlogs`);
  if (r.max_gap_years !== null) parts.push(r.max_gap_years === 0 ? 'no gap years' : `up to ${r.max_gap_years} gap years`);
  if (r.min_work_years !== null && r.min_work_years > 0) parts.push(`${r.min_work_years}+ years of work experience`);

  const hedged = opportunity.verification_status !== 'verified';
  if (parts.length === 0) {
    return hedged
      ? 'No cutoffs found yet; the criteria still need a check.'
      : 'No marks, backlog, branch or batch cutoffs on the official page.';
  }
  const sentence = parts.join(', ');
  const base = sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
  // A partly verified record must not read as the full list of gates.
  return hedged ? `${base} Some criteria still need a check.` : base;
}
