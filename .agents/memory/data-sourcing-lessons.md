---
name: Opportunity data sourcing lessons
description: What official eligibility pages actually yield for Indian students, and the traps when turning research into records.
---

**Rule:** all-null rules only mean "no cutoff" when the record is `verified`. An all-null `needs_check` record is a data gap; the engine hedges every null-rule sentence and the UI must not badge or count it as qualified.

**Why:** the first recruiter research pass produced a dozen mass-recruiter records with every rule null simply because those companies publish no fresher cutoffs on any public page. Shipped as-is they would have read as "no cutoff", the opposite of the truth. Only TCS NQT publishes numbers.

**How to apply:**
- Company drives stay thin unless the user supplies official placement-cell or company drive notices; those count as official sources. There is no separate recruiter list any more; a recruiter is either a company drive with published criteria or left out.
- Spot-check research subagent output for silent conversions (4-point GPA to CGPA, "60% or equivalent" turned into a CGPA number) and for batch lists that describe an already-closed cycle. The engine handles closed-cycle `grad_years` itself; do not pre-shift years by hand.
- Global open-source and scholarship programs state criteria clearly; India roles at large tech companies never expose a cutoff table, so they stay `needs_check` and are candidates for scope cuts.
- Deadlines are stored as the organiser's published calendar date; the app closes them at the end of that day on the device clock (conservative for India when the organiser is west of it). Never pad dates forward.
