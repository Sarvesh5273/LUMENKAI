/**
 * Runtime schema for opportunity records.
 *
 * TypeScript already checks shapes at compile time. This schema checks the
 * things TypeScript cannot: that dates are real dates, that URLs are https,
 * that percentages are inside 0 to 100, that ids are unique, and that a
 * record which admits uncertainty actually explains it in `notes`.
 *
 * Used by the data tests (`pnpm test`). Contributors run the same check.
 */

import { z } from 'zod';
import { BENEFIT_KINDS, BRANCHES, CATEGORIES, CITIZENSHIPS, LOCATION_MODES, Opportunity } from './types';
import { isExpectedNextCycle, parseIsoDate } from './deadlines';

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'must be YYYY-MM-DD')
  .refine((value) => parseIsoDate(value) !== null, 'must be a real calendar date');

const httpsUrl = z.string().url().startsWith('https://', 'must be an https URL');

const percentage = z.number().min(0).max(100);
const cgpa = z.number().min(0).max(10);
const smallCount = z.number().int().min(0).max(20);
const gradYear = z.number().int().min(2020).max(2040);

export const rulesSchema = z.object({
  min_tenth_pct: percentage.nullable(),
  min_twelfth_pct: percentage.nullable(),
  min_cgpa: cgpa.nullable(),
  max_active_backlogs: smallCount.nullable(),
  max_gap_years: smallCount.nullable(),
  grad_years: z.array(gradYear).min(1).nullable(),
  citizenship: z.union([z.literal('any'), z.array(z.enum(CITIZENSHIPS)).min(1)]),
  gender: z.enum(['any', 'women']),
  requires_student: z.boolean(),
  branches: z.union([z.literal('any'), z.array(z.enum(BRANCHES)).min(1)]),
  min_work_years: z.number().min(0).max(30).nullable(),
});

/** A short user-facing phrase: long enough to mean something, short enough for a card. */
const shortText = (max: number) => z.string().trim().min(3).max(max);

export const benefitSchema = z
  .object({
    kind: z.enum(BENEFIT_KINDS),
    what_you_get: z.string().trim().min(10).max(240),
    amount_text: shortText(80).nullable(),
    amount_status: z.enum(['stated', 'not_stated', 'unchecked']),
    amount_source: httpsUrl.nullable(),
  })
  .superRefine((benefit, ctx) => {
    if (benefit.amount_status === 'stated' && benefit.amount_source === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['amount_source'],
        message: 'amount_status "stated" needs the URL of the page the amount was read on',
      });
    }
    if (benefit.amount_status !== 'stated' && benefit.amount_source !== null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['amount_source'],
        message: 'amount_source is only allowed when amount_status is "stated"',
      });
    }
    if (benefit.amount_status === 'stated' && benefit.amount_text === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['amount_text'],
        message: 'amount_status "stated" needs the amount as the official page prints it',
      });
    }
    if (benefit.amount_status !== 'stated' && benefit.amount_text !== null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['amount_text'],
        message: 'amount_text is only allowed when amount_status is "stated"',
      });
    }
  });

export const locationSchema = z
  .object({
    mode: z.enum(LOCATION_MODES),
    place: shortText(80).nullable(),
  })
  .superRefine((location, ctx) => {
    if (location.mode !== 'remote' && location.place === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['place'],
        message: 'an on_site or hybrid record must say where',
      });
    }
  });

export const applyReadySchema = z
  .object({
    what_you_need: z.string().trim().min(10).max(300).nullable(),
    how_they_select: z.string().trim().min(10).max(300).nullable(),
    beginner_friendly: z.boolean().nullable(),
    application_fee: shortText(80).nullable(),
    fee_status: z.enum(['free', 'paid', 'unchecked']),
  })
  .superRefine((apply, ctx) => {
    if (apply.fee_status === 'paid' && apply.application_fee === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['application_fee'],
        message: 'fee_status "paid" needs the fee as the official page prints it',
      });
    }
    if (apply.fee_status !== 'paid' && apply.application_fee !== null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['application_fee'],
        message: 'application_fee is only allowed when fee_status is "paid"',
      });
    }
  });

export function buildOpportunitySchema(now: Date) {
  return z
  .object({
    id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'id must be kebab-case'),
    title: z.string().min(3).max(120),
    org: z.string().min(2).max(120),
    category: z.enum(CATEGORIES),
    summary: z.string().min(20).max(400),
    benefit: benefitSchema,
    location: locationSchema,
    apply: applyReadySchema,
    official_url: httpsUrl,
    source_url: httpsUrl,
    last_verified: isoDate,
    deadline: z.union([z.literal('rolling'), z.literal('tbd'), isoDate]),
    typical_window: z.string().min(10).max(300).nullable(),
    rules: rulesSchema,
    verification_status: z.enum(['verified', 'needs_check']),
    tags: z.array(z.string().min(2).max(30)).min(1).max(6),
    notes: z.string().max(1200),
    alternative_ids: z.array(z.string()),
  })
  .superRefine((record, ctx) => {
    if (record.verification_status === 'needs_check' && record.notes.trim().length < 20) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['notes'],
        message: 'a needs_check record must explain in notes what still has to be checked',
      });
    }
    // Same clock rule as the app: a deadline stays open through the whole of
    // its calendar day on the device, so validation and runtime agree.
    if (isExpectedNextCycle(record.deadline, now) && record.typical_window === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['typical_window'],
        message:
          'a tbd or already-passed deadline needs a typical_window so the card can say when to expect the next cycle',
      });
    }
    const userFacing = [
      record.title,
      record.summary,
      record.notes,
      record.benefit.what_you_get,
      record.benefit.amount_text,
      record.location.place,
      record.apply.what_you_need,
      record.apply.how_they_select,
      record.apply.application_fee,
      record.typical_window,
    ];
    if (userFacing.some((text) => text !== null && /\u2014/.test(text))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['summary'],
        message: 'do not use em dashes in user-facing text',
      });
    }
  });
}

/** Schema bound to the current clock. Tests that need a fixed date build their own. */
export const opportunitySchema = buildOpportunitySchema(new Date());

export type ValidationIssue = { id: string; path: string; message: string };

/**
 * Validate a whole dataset. Returns a flat list of problems, empty when the
 * data is clean. Checks cross-record rules (unique ids, alternative_ids that
 * point at real records) on top of the per-record schema.
 */
/** Matches "80 percent", "75%" or "3.0 on a 4-point scale". */
const NUMERIC_BAR = /(\d{2}(\.\d+)?\s?(%|percent)|\b[0-4]\.\d\s?(on|\/)\s?(a\s)?4)/i;
/** Words that tie a numeric bar to the degree rather than to school marks. */
const DEGREE_WORDS = /(degree|graduat|bachelor|undergraduate|semester|grade point average|\bGPA\b)/i;

/**
 * True when a sentence in the notes states a numeric bar for the degree
 * (a percentage or a 4-point GPA). Such a bar cannot live in min_cgpa, so a
 * record that carries one must stay needs_check, no matter which school
 * thresholds are encoded.
 */
export function notesStateDegreeBar(notes: string): boolean {
  return notes.split(/(?<=[.!?])\s+/).some((sentence) => {
    const match = NUMERIC_BAR.exec(sentence);
    if (!match) return false;
    // Look at the words just before the figure and everything after it, so
    // "75% marks in Class 12" is not mistaken for a degree bar because the
    // sentence happened to mention graduation earlier.
    return DEGREE_WORDS.test(sentence.slice(Math.max(0, match.index - 40)));
  });
}

export function validateOpportunities(records: Opportunity[], now: Date = new Date()): ValidationIssue[] {
  const schema = buildOpportunitySchema(now);
  const issues: ValidationIssue[] = [];
  const seen = new Set<string>();
  const ids = new Set(records.map((r) => r.id));

  for (const record of records) {
    const parsed = schema.safeParse(record);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        issues.push({ id: record.id ?? '(no id)', path: issue.path.join('.'), message: issue.message });
      }
    }
    if (seen.has(record.id)) {
      issues.push({ id: record.id, path: 'id', message: 'duplicate id' });
    }
    seen.add(record.id);

    // A degree bar printed as a percentage or on a 4-point scale cannot be
    // encoded in min_cgpa, and a verified record renders a null min_cgpa as
    // "No minimum CGPA required". Encoded school thresholds do not excuse it.
    if (
      record.verification_status === 'verified' &&
      record.rules &&
      record.rules.min_cgpa === null &&
      notesStateDegreeBar(record.notes ?? '')
    ) {
      issues.push({
        id: record.id,
        path: 'verification_status',
        message: 'notes state a degree bar (percent or 4-point GPA) that min_cgpa does not encode; keep the record needs_check',
      });
    }

    for (const alt of record.alternative_ids ?? []) {
      if (alt === record.id) {
        issues.push({ id: record.id, path: 'alternative_ids', message: 'a record cannot be its own alternative' });
      } else if (!ids.has(alt)) {
        issues.push({ id: record.id, path: 'alternative_ids', message: `unknown alternative id "${alt}"` });
      }
    }
  }

  return issues;
}
