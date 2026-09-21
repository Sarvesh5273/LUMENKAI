/**
 * The dataset the app ships with.
 *
 * One file per category so a contributor fixing a single scholarship never
 * has to scroll past hackathons. `OPPORTUNITIES` is the bundled copy: it is
 * what the app shows until a newer dataset has been fetched from the public
 * repo (see lib/dataset.ts), and what it falls back to offline.
 *
 * Every record must pass `pnpm test` (see lib/validate.ts) before it ships,
 * and `pnpm export-data` must be run so data/dataset.json matches.
 */

import { Opportunity } from '../lib/types';
import { HACKATHONS_FELLOWSHIPS } from './hackathons_fellowships';
import { OPEN_SOURCE } from './open_source';
import { FUNDED_INTERNSHIPS } from './funded_internships';
import { SCHOLARSHIPS } from './scholarships';
import { STARTUP_PROGRAMS } from './startup_programs';
import { COMPANY_DRIVES } from './company_drives';

export const OPPORTUNITIES: Opportunity[] = [
  ...HACKATHONS_FELLOWSHIPS,
  ...OPEN_SOURCE,
  ...FUNDED_INTERNSHIPS,
  ...SCHOLARSHIPS,
  ...STARTUP_PROGRAMS,
  ...COMPANY_DRIVES,
];

const byId = new Map(OPPORTUNITIES.map((record) => [record.id, record]));

/** Lookup in the bundled copy only. Screens should use `findRecord` from the store, which also knows fetched records. */
export function findBundledOpportunity(id: string): Opportunity | undefined {
  return byId.get(id);
}
