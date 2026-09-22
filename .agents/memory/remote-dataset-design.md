---
name: Remote dataset design
description: Why the dataset is fetched from the public repo with no backend, and the honesty rules for the money and fee fields that must survive future schema work.
---

**Rule:** the app has no backend by design, so "continuously updated" means fetching a committed `data/dataset.json` from the repo's raw URL, validating it with the same zod schema the data tests use, and letting the newest `generated_at` win over the cached and bundled copies. The bundled copy is the floor; an unknown `schema_version` is refused.

**Why:** a merged data fix must reach installed phones without a store release, and the validator gate is the only thing between a bad merge and a broken feed on every device.

**How to apply:**
- TS files under `data/` are the source of truth; the JSON is generated and drift fails the test suite. The export keeps the previous `generated_at` when records are unchanged so a no-op re-run never marks the whole feed New.
- Everything keyed on the set of record ids (New markers, seen baseline, tracked-id pruning) belongs in the single adopt step, so a remote copy adopted mid-session behaves like a launch. First launch marks nothing New, including a remote copy that lands seconds later.
- Three-valued status fields are deliberate and were added after a review caught the app calling every unchecked fee "free": `amount_status` stated / not_stated / unchecked with a required `amount_source` URL when stated, and `fee_status` free / paid / unchecked. Only a checked value may be worded as a fact. Do not collapse these to nullable strings again.
- Runtime validation of a fetched or cached file must use the file's own `generated_at` as "now", never the device clock, or a file that was valid when exported is thrown away once any deadline in it passes. The date-sensitive rule (passed deadline needs a typical window) belongs to the export and the test suite, which run on the real clock so contributors are told to update stale records.
- Verifying the remote path end to end: the dev console logs the launch fetch outcome (HTTP status, or the fetched `generated_at` and whether it was adopted); the browser log from a web screenshot of the Expo app shows it. A copy with the same `generated_at` as the bundled one is fetched but deliberately not adopted, so right after a plain push the expected line is "not newer, keeping that". Seeing an actual adoption needs a record change, `pnpm export-data` (a no-op export keeps the old timestamp), and a push.
