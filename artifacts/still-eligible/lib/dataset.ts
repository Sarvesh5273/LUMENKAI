/**
 * The versioned dataset file and how the app picks which copy to show.
 *
 * Three copies can exist on a device:
 *   - bundled: the records compiled into the app (data/index.ts)
 *   - cached:  the last dataset fetched from the repo, kept in AsyncStorage
 *   - remote:  whatever data/dataset.json says on the repo right now
 *
 * The newest `generated_at` wins, and a copy is only ever accepted after it
 * passes the same schema the data tests run. The bundled copy is the floor:
 * the app can never end up with fewer checks than it shipped with.
 */

import { Opportunity } from './types';
import { validateOpportunities } from './validate';

/** Bump when a change to the record shape would break an older app reading the file. */
export const DATASET_SCHEMA_VERSION = 1;

export type Dataset = {
  schema_version: number;
  /** ISO 8601 timestamp of the export, e.g. "2026-09-22T10:15:00.000Z". */
  generated_at: string;
  records: Opportunity[];
};

export type DatasetSource = 'bundled' | 'cached' | 'remote';

export type ParseResult = { ok: true; dataset: Dataset } | { ok: false; reason: string };

/** Build the file contents from the bundled records. Used by the export script and the drift test. */
export function buildDataset(records: Opportunity[], generatedAt: Date): Dataset {
  return {
    schema_version: DATASET_SCHEMA_VERSION,
    generated_at: generatedAt.toISOString(),
    records,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Parse and validate a dataset read from the network or the cache. A file
 * written for a newer schema is refused outright: this app build cannot know
 * what the new fields mean, and the bundled copy is safer than a guess.
 *
 * Validation runs against the dataset's own `generated_at`, never the device
 * clock. The one date-sensitive rule (a passed deadline needs a
 * `typical_window`) was checked by the export at that moment; re-checking it
 * against today would make a good file go bad on its own as days pass, and
 * the app would throw away its cache for no reason. Deadlines that have
 * passed since are handled at render time by the deadline helpers.
 */
export function parseDataset(raw: unknown): ParseResult {
  if (!isRecord(raw)) return { ok: false, reason: 'dataset is not an object' };
  if (raw.schema_version !== DATASET_SCHEMA_VERSION) {
    return { ok: false, reason: `schema_version ${String(raw.schema_version)} is not ${DATASET_SCHEMA_VERSION}` };
  }
  if (typeof raw.generated_at !== 'string' || Number.isNaN(Date.parse(raw.generated_at))) {
    return { ok: false, reason: 'generated_at is not a timestamp' };
  }
  if (!Array.isArray(raw.records) || raw.records.length === 0) {
    return { ok: false, reason: 'records is empty or missing' };
  }
  if (!raw.records.every(isRecord)) {
    return { ok: false, reason: 'records contains a non-object entry' };
  }
  const records = raw.records as unknown as Opportunity[];
  const issues = validateOpportunities(records, new Date(raw.generated_at));
  if (issues.length > 0) {
    const first = issues[0];
    return { ok: false, reason: `${issues.length} validation issue(s), first: ${first.id} ${first.path}: ${first.message}` };
  }
  return { ok: true, dataset: { schema_version: DATASET_SCHEMA_VERSION, generated_at: raw.generated_at, records } };
}

/** True when `candidate` was exported after `current`. Equal timestamps do not count as newer. */
export function isNewerDataset(candidate: Dataset, current: Dataset): boolean {
  return Date.parse(candidate.generated_at) > Date.parse(current.generated_at);
}

/** Ids present in `dataset` that the student has not had in their feed before. */
export function findNewIds(dataset: Dataset, seenIds: ReadonlySet<string>): string[] {
  return dataset.records.map((r) => r.id).filter((id) => !seenIds.has(id));
}
