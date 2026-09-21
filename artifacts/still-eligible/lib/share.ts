/**
 * Text that leaves the app: the WhatsApp-ready share message and the
 * prefilled GitHub issue for a wrong rule. Both are pure functions so the
 * exact wording is covered by tests.
 */

import { NEW_ISSUE_URL, REPO_URL } from './config';
import { formatDeadlineShort } from './deadlines';
import { describeWhoCanApply, formatBenefitShort } from './format';
import { RULE_LABELS, RULE_ORDER } from './engine';
import { Opportunity, RuleKey } from './types';

/**
 * Five lines and nothing else: name, what it pays, who can apply, when it
 * closes, the official link. No app credit, no tracking parameters.
 */
export function buildShareText(opportunity: Opportunity, now: Date = new Date()): string {
  return [
    `${opportunity.title} (${opportunity.org})`,
    `Pays: ${formatBenefitShort(opportunity.benefit)}`,
    `Who can apply: ${describeWhoCanApply(opportunity)}`,
    `Closes: ${formatDeadlineShort(opportunity.deadline, now)}`,
    opportunity.official_url,
  ].join('\n');
}

function ruleValueText(opportunity: Opportunity, key: RuleKey): string {
  const value = opportunity.rules[key];
  // On a verified record a null rule is a read absence; on a needs_check
  // record it may just be unread, and the issue must not call it a fact.
  if (value === null) return opportunity.verification_status === 'verified' ? 'no cutoff' : 'no cutoff recorded (unconfirmed)';
  if (typeof value === 'boolean') return value ? 'required' : 'not required';
  if (Array.isArray(value)) return value.join(', ');
  return String(value);
}

/**
 * A GitHub "new issue" URL with the record id in the title and every rule
 * as a checkbox in the body, so a student only has to tick the wrong one and
 * paste where the official page says otherwise.
 */
export function buildReportIssueUrl(opportunity: Opportunity): string {
  const title = `Wrong rule: ${opportunity.id}`;
  const checklist = RULE_ORDER
    .map((key) => `- [ ] ${RULE_LABELS[key]}: ${ruleValueText(opportunity, key)}`)
    .join('\n');
  const body = [
    `Record: \`${opportunity.id}\` (${opportunity.title}, ${opportunity.org})`,
    `Last verified: ${opportunity.last_verified}`,
    `Source read: ${opportunity.source_url}`,
    `Verification status: ${opportunity.verification_status}`,
    '',
    'Tick the rule that is wrong:',
    checklist,
    '',
    'What the official page actually says (paste the sentence and the URL):',
    '',
  ].join('\n');
  const params = new URLSearchParams({ title, body, labels: 'wrong-rule' });
  return `${NEW_ISSUE_URL}?${params.toString()}`;
}

export { REPO_URL };
