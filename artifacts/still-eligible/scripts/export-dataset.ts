/**
 * Export the bundled records to data/dataset.json, the file the app fetches
 * from the public repo on launch. Run after any change under data/:
 *
 *   pnpm --filter @workspace/still-eligible export-data
 *
 * The data test fails when dataset.json drifts from the TypeScript records,
 * so a forgotten export never reaches the repo.
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { OPPORTUNITIES } from '../data';
import { buildDataset, DATASET_SCHEMA_VERSION } from '../lib/dataset';
import { validateOpportunities } from '../lib/validate';

const outPath = resolve(__dirname, '../data/dataset.json');
const metaPath = resolve(__dirname, '../data/dataset-meta.json');

const issues = validateOpportunities(OPPORTUNITIES);
if (issues.length > 0) {
  for (const issue of issues) {
    console.error(`${issue.id} -> ${issue.path}: ${issue.message}`);
  }
  console.error(`\n${issues.length} issue(s). Fix the records before exporting.`);
  process.exit(1);
}

// Keep the timestamp stable when nothing changed, so a re-run does not
// produce a noisy diff or make every installed app think there is news.
let generatedAt = new Date();
try {
  const previous = JSON.parse(readFileSync(outPath, 'utf8')) as { generated_at?: string; records?: unknown };
  if (
    previous.generated_at &&
    JSON.stringify(previous.records) === JSON.stringify(OPPORTUNITIES)
  ) {
    generatedAt = new Date(previous.generated_at);
  }
} catch {
  // No previous export: first run.
}

const dataset = buildDataset(OPPORTUNITIES, generatedAt);
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(dataset, null, 2) + '\n');
writeFileSync(
  metaPath,
  JSON.stringify({ schema_version: DATASET_SCHEMA_VERSION, generated_at: dataset.generated_at }, null, 2) + '\n',
);

console.log(`Wrote ${dataset.records.length} records to ${outPath}`);
console.log(`generated_at ${dataset.generated_at}, schema_version ${dataset.schema_version}`);
