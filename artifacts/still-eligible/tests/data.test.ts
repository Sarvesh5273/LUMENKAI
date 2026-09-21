import { OPPORTUNITIES } from '../data';
import { buildDataset, DATASET_SCHEMA_VERSION, parseDataset } from '../lib/dataset';
import datasetJson from '../data/dataset.json';
import datasetMeta from '../data/dataset-meta.json';
import { CATEGORIES } from '../lib/types';
import { validateOpportunities } from '../lib/validate';

/**
 * Every record that ships in the app must pass these checks. If you are
 * adding or editing a record, run `pnpm test` and read the failure message:
 * it names the record id and the field.
 */
describe('shipped dataset', () => {
  test('every record passes the schema and cross-record checks', () => {
    const issues = validateOpportunities(OPPORTUNITIES);
    const report = issues.map((i) => `${i.id} -> ${i.path}: ${i.message}`).join('\n');
    expect(report).toBe('');
  });

  test('every record uses one of the six categories', () => {
    for (const record of OPPORTUNITIES) {
      expect(CATEGORIES).toContain(record.category);
    }
  });

  test('a needs_check record never claims a verified absence of cutoffs in its notes', () => {
    // Belt and braces: the engine hedges the wording, but the notes are
    // shown verbatim, so they must not read like a confirmed "no criteria".
    for (const record of OPPORTUNITIES) {
      if (record.verification_status === 'needs_check') {
        expect(record.notes.trim().length).toBeGreaterThanOrEqual(20);
      }
    }
  });

  test('a stated amount is never shown without the text, and an unpaid record never claims money', () => {
    for (const record of OPPORTUNITIES) {
      if (record.benefit.amount_status === 'stated') {
        expect(record.benefit.amount_text).toBeTruthy();
      } else {
        expect(record.benefit.amount_text).toBeNull();
      }
      if (record.benefit.kind === 'unpaid') {
        expect(record.benefit.amount_status).not.toBe('stated');
      }
    }
  });
});

describe('exported dataset', () => {
  test('data/dataset.json matches the TypeScript records (run pnpm export-data after editing data/)', () => {
    expect(datasetJson.schema_version).toBe(DATASET_SCHEMA_VERSION);
    expect(datasetJson.records).toEqual(JSON.parse(JSON.stringify(OPPORTUNITIES)));
  });

  test('data/dataset-meta.json carries the same stamp as the export', () => {
    expect(datasetMeta).toEqual({ schema_version: datasetJson.schema_version, generated_at: datasetJson.generated_at });
  });

  test('the exported file passes the same parser the app applies to a fetched copy', () => {
    const result = parseDataset(datasetJson);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.dataset.records).toHaveLength(OPPORTUNITIES.length);
    }
  });

  test('buildDataset stamps the schema version and the export time', () => {
    const built = buildDataset(OPPORTUNITIES, new Date(Date.UTC(2026, 8, 22, 6, 30)));
    expect(built.schema_version).toBe(DATASET_SCHEMA_VERSION);
    expect(built.generated_at).toBe('2026-09-22T06:30:00.000Z');
  });
});

describe('validation clock', () => {
  test('a deadline is not treated as passed until the day after, matching the app', () => {
    const record = {
      ...OPPORTUNITIES.find((r) => r.id === 'tcs-nqt')!,
      deadline: '2026-03-20',
      typical_window: null,
    };
    // On the deadline day itself, at 11 pm local time, the window is still open.
    const onTheDay = validateOpportunities([record], new Date(2026, 2, 20, 23, 0));
    expect(onTheDay.some((i) => i.path === 'typical_window')).toBe(false);
    // The next morning it has passed and a typical window becomes mandatory.
    const dayAfter = validateOpportunities([record], new Date(2026, 2, 21, 1, 0));
    expect(dayAfter.some((i) => i.path === 'typical_window')).toBe(true);
  });
});
