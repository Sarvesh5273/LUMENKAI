import { OPPORTUNITIES } from '../data';
import { DATASET_URL, NEW_ISSUE_URL, REPO_URL } from '../lib/config';
import { findNewIds, isNewerDataset, parseDataset } from '../lib/dataset';
import {
  describeWhoCanApply,
  formatAmountNote,
  formatApplicationFee,
  formatBenefitShort,
  formatLocation,
  FEE_UNCHECKED_LINE,
  FREE_TO_APPLY_LINE,
} from '../lib/format';
import { buildReportIssueUrl, buildShareText } from '../lib/share';
import { Opportunity } from '../lib/types';

const NOW = new Date(2026, 8, 21);

function byId(id: string): Opportunity {
  const record = OPPORTUNITIES.find((r) => r.id === id);
  if (!record) throw new Error(`missing fixture ${id}`);
  return record;
}

describe('money and location wording', () => {
  test('a stated amount is shown as written; anything else falls back to the kind', () => {
    expect(formatBenefitShort({ kind: 'stipend', what_you_get: 'x', amount_text: 'USD 7,000', amount_status: 'stated', amount_source: 'https://example.org/stipend' })).toBe('USD 7,000');
    expect(formatBenefitShort({ kind: 'stipend', what_you_get: 'x', amount_text: null, amount_status: 'unchecked', amount_source: null })).toBe('Stipend');
    expect(formatBenefitShort({ kind: 'unpaid', what_you_get: 'x', amount_text: null, amount_status: 'not_stated', amount_source: null })).toBe('Unpaid');
  });

  test('the amount note never says "not stated" for a page nobody has read', () => {
    expect(formatAmountNote({ kind: 'grant', what_you_get: 'x', amount_text: null, amount_status: 'unchecked', amount_source: null })).toMatch(/not recorded yet/i);
    expect(formatAmountNote({ kind: 'grant', what_you_get: 'x', amount_text: null, amount_status: 'not_stated', amount_source: null })).toMatch(/does not state/i);
    expect(formatAmountNote({ kind: 'grant', what_you_get: 'x', amount_text: 'INR 1 lakh', amount_status: 'stated', amount_source: 'https://example.org/stipend' })).toBe('Amount on the official page: INR 1 lakh.');
  });

  test('location reads as mode then place, with the place kept as written', () => {
    expect(formatLocation({ mode: 'remote', place: 'Open worldwide' })).toBe('Remote: Open worldwide');
    expect(formatLocation({ mode: 'on_site', place: 'Bengaluru' })).toBe('On-site: Bengaluru');
    expect(formatLocation({ mode: 'remote', place: null })).toBe('Remote');
  });

  test('only a checked fee is called free; an unchecked one says so; a paid one quotes the page', () => {
    const base = { what_you_need: null, how_they_select: null, beginner_friendly: null };
    expect(formatApplicationFee({ ...base, application_fee: null, fee_status: 'free' })).toBe(FREE_TO_APPLY_LINE);
    expect(formatApplicationFee({ ...base, application_fee: null, fee_status: 'unchecked' })).toBe(FEE_UNCHECKED_LINE);
    expect(formatApplicationFee({ ...base, application_fee: null, fee_status: 'unchecked' })).not.toMatch(/^Free/);
    expect(formatApplicationFee({ ...base, application_fee: 'INR 500 registration', fee_status: 'paid' })).toBe('INR 500 registration. Pay only on the official page.');
  });

  test('who can apply lists real cutoffs and hedges an unverified empty record', () => {
    expect(describeWhoCanApply(byId('tcs-nqt'))).toMatch(/10th 60%\+/);
    expect(describeWhoCanApply(byId('tcs-nqt'))).toMatch(/12th 60%\+/);
    const open = byId('gsoc');
    if (open.verification_status === 'verified') {
      expect(describeWhoCanApply(open)).toMatch(/No marks, backlog, branch or batch cutoffs/);
    }
    const hedged: Opportunity = { ...open, verification_status: 'needs_check' };
    expect(describeWhoCanApply(hedged)).toMatch(/still need a check/);
    const partlyChecked: Opportunity = { ...byId('tcs-nqt'), verification_status: 'needs_check' };
    expect(describeWhoCanApply(partlyChecked)).toMatch(/10th 60%\+/);
    expect(describeWhoCanApply(partlyChecked)).toMatch(/Some criteria still need a check\.$/);
  });
});

describe('share text', () => {
  test('is exactly five lines ending with the official link and carries no app credit', () => {
    const text = buildShareText(byId('gsoc'), NOW);
    const lines = text.split('\n');
    expect(lines).toHaveLength(5);
    expect(lines[0]).toBe('Google Summer of Code (Google)');
    expect(lines[1]).toMatch(/^Pays: /);
    expect(lines[2]).toMatch(/^Who can apply: /);
    expect(lines[3]).toMatch(/^Closes: /);
    expect(lines[4]).toBe(byId('gsoc').official_url);
    expect(text).not.toMatch(/StillEligible/);
  });
});

describe('report a wrong rule', () => {
  test('opens a prefilled issue on the public repo with the record id and every rule as a checkbox', () => {
    const url = new URL(buildReportIssueUrl(byId('tcs-nqt')));
    expect(url.toString().startsWith(NEW_ISSUE_URL)).toBe(true);
    expect(url.searchParams.get('title')).toBe('Wrong rule: tcs-nqt');
    const body = url.searchParams.get('body') ?? '';
    expect(body).toContain('`tcs-nqt`');
    expect(body).toContain('- [ ] 10th percentage: 60');
    expect(body).toContain('- [ ] Student status: not required');
    expect(body).toContain('- [ ] Active backlogs:');
    expect(body).toContain(byId('tcs-nqt').source_url);
  });

  test('a null rule on an unconfirmed record is not reported as a fact', () => {
    const hedged: Opportunity = { ...byId('gsoc'), verification_status: 'needs_check' };
    const body = new URL(buildReportIssueUrl(hedged)).searchParams.get('body') ?? '';
    expect(body).toContain('Verification status: needs_check');
    expect(body).toContain('- [ ] CGPA: no cutoff recorded (unconfirmed)');
    const verifiedBody = new URL(buildReportIssueUrl({ ...byId('gsoc'), verification_status: 'verified' })).searchParams.get('body') ?? '';
    expect(verifiedBody).toContain('- [ ] CGPA: no cutoff');
    expect(verifiedBody).not.toContain('unconfirmed');
  });

  test('every outbound URL is derived from the one repo constant', () => {
    expect(NEW_ISSUE_URL.startsWith(REPO_URL)).toBe(true);
    expect(DATASET_URL.startsWith('https://raw.githubusercontent.com/')).toBe(true);
    expect(DATASET_URL.endsWith('/data/dataset.json')).toBe(true);
  });
});

describe('remote dataset parsing', () => {
  const good = { schema_version: 1, generated_at: '2026-09-22T00:00:00.000Z', records: OPPORTUNITIES };

  test('accepts the shape the export script writes', () => {
    expect(parseDataset(JSON.parse(JSON.stringify(good))).ok).toBe(true);
  });

  test('refuses a newer schema, a bad timestamp, an empty list and an invalid record', () => {
    expect(parseDataset({ ...good, schema_version: 2 })).toMatchObject({ ok: false });
    expect(parseDataset({ ...good, generated_at: 'yesterday' })).toMatchObject({ ok: false });
    expect(parseDataset({ ...good, records: [] })).toMatchObject({ ok: false });
    const broken = [{ ...OPPORTUNITIES[0], official_url: 'not a url' }];
    const result = parseDataset({ ...good, records: broken });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toContain('official_url');
  });

  test('a file that was valid when exported stays valid however long the phone sits on it', () => {
    // Deadline two days after the export, no typical_window: fine at export time,
    // and must still parse when the device clock is years past the deadline.
    const soon = { ...OPPORTUNITIES[0], id: 'soon-after-export', deadline: '2026-09-24', typical_window: null, alternative_ids: [] };
    const exported = { ...good, records: [soon] };
    const realNow = Date.now;
    Date.now = () => Date.UTC(2031, 0, 1);
    try {
      expect(parseDataset(exported).ok).toBe(true);
    } finally {
      Date.now = realNow;
    }
    // But a file whose author exported it after the deadline without a window is rejected,
    // exactly as the export step would have rejected it.
    const stale = { ...good, generated_at: '2026-10-01T00:00:00.000Z', records: [soon] };
    const result = parseDataset(stale);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toContain('typical_window');
  });

  test('a copy only replaces the current one when its export time is strictly later', () => {
    const current = { ...good, generated_at: '2026-09-22T00:00:00.000Z' };
    expect(isNewerDataset({ ...good, generated_at: '2026-09-23T00:00:00.000Z' }, current)).toBe(true);
    expect(isNewerDataset({ ...good, generated_at: '2026-09-22T00:00:00.000Z' }, current)).toBe(false);
    expect(isNewerDataset({ ...good, generated_at: '2026-09-21T00:00:00.000Z' }, current)).toBe(false);
  });

  test('new ids are the ones the student has not seen before', () => {
    const seen = new Set(OPPORTUNITIES.slice(1).map((r) => r.id));
    expect(findNewIds(good, seen)).toEqual([OPPORTUNITIES[0].id]);
    expect(findNewIds(good, new Set(OPPORTUNITIES.map((r) => r.id)))).toEqual([]);
  });
});
