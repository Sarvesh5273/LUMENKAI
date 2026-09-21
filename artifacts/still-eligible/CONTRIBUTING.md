# Contributing to StillEligible Data

To add new opportunities, open `data/opportunities.ts` and add a record matching the schema.

## Guidelines
1. **Never invent criteria:** If a mass recruiter does not explicitly state a gap year limit, do not add `max_gap_years`.
2. **URLs:** `official_url` must be the direct application portal. `source_url` should be the place where the criteria was verified (e.g., a specific PDF notification or official career page FAQ).
3. **Deadlines:** If the annual window has closed, set `expected_next_cycle: true` and `deadline: null`.
4. **Accuracy:** This app is meant to be a reliable partner during high-stress placement seasons. Verify before committing.
