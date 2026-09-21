/**
 * Validate the bundled records without writing anything. Same checks as the
 * export and the data test, so a contributor can iterate on a data file and
 * see exactly which record and field is wrong:
 *
 *   pnpm --filter @workspace/still-eligible check-data
 *
 * Exit code 1 when any record fails.
 */

import { OPPORTUNITIES } from '../data';
import { CATEGORIES } from '../lib/types';
import { validateOpportunities } from '../lib/validate';

const issues = validateOpportunities(OPPORTUNITIES);
for (const issue of issues) {
  console.error(`${issue.id} -> ${issue.path}: ${issue.message}`);
}

const counts = new Map<string, number>(CATEGORIES.map((c) => [c, 0]));
for (const record of OPPORTUNITIES) counts.set(record.category, (counts.get(record.category) ?? 0) + 1);
console.log(`${OPPORTUNITIES.length} records`);
for (const [category, n] of counts) console.log(`  ${category}: ${n}`);

if (issues.length > 0) {
  console.error(`\n${issues.length} issue(s).`);
  process.exit(1);
}
console.log('All records valid.');
