/**
 * The dataset the app ships with.
 *
 * One file per category so a contributor fixing a single scholarship never
 * has to scroll past hackathons. `OPPORTUNITIES` is what the home screen
 * evaluates. `RECRUITERS` is kept separate: those records only feed the
 * "Closed doors" tab.
 *
 * Every record must pass `pnpm test` (see lib/validate.ts) before it ships.
 */

import { Opportunity } from '../lib/types';
import { CRITERIA_FREE_DRIVES } from './criteria_free_drives';
import { OPEN_SOURCE } from './open_source';
import { FUNDED_INTERNSHIPS } from './funded_internships';
import { ABROAD_SCHOLARSHIPS } from './abroad_scholarships';
import { HACKATHONS_FELLOWSHIPS } from './hackathons_fellowships';
import { RECRUITERS } from './recruiters';

export const OPPORTUNITIES: Opportunity[] = [
  ...CRITERIA_FREE_DRIVES,
  ...OPEN_SOURCE,
  ...FUNDED_INTERNSHIPS,
  ...ABROAD_SCHOLARSHIPS,
  ...HACKATHONS_FELLOWSHIPS,
];

export { RECRUITERS };

/** Everything, for lookups by id from any screen. */
export const ALL_RECORDS: Opportunity[] = [...OPPORTUNITIES, ...RECRUITERS];

const byId = new Map(ALL_RECORDS.map((record) => [record.id, record]));

export function findOpportunity(id: string): Opportunity | undefined {
  return byId.get(id);
}
