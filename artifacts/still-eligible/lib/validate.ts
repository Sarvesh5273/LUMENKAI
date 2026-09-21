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
import { BRANCHES, CATEGORIES, CITIZENSHIPS, Opportunity, RECRUITER_CATEGORY } from './types';
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

export function buildOpportunitySchema(now: Date) {
  return z
  .object({
    id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'id must be kebab-case'),
    title: z.string().min(3).max(120),
    org: z.string().min(2).max(120),
    category: z.enum([...CATEGORIES, RECRUITER_CATEGORY]),
    summary: z.string().min(20).max(400),
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
    if (/\u2014/.test(record.summary + record.notes + record.title)) {
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
