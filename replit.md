# StillEligible

Offline-first Expo app for Indian technical students who do not know where the money is: a curated, continuously updated, personalised feed of money-bearing opportunities (hackathons, open source, funded internships, scholarships, startup programs, company drives), with the eligibility engine as the filter and one plain-English line per rule. Not a scholarship portal; government schemes are out of scope. Built for the RevenueCat Shipaton 2026 Next Gen award (submission closes 30 Sep 2026, 11:45 pm PDT).

## Run & Operate

- Mobile app lives in `artifacts/still-eligible` (workflow `artifacts/still-eligible: expo`). Restart it with the workflow tool, never with `npx expo start`.
- `pnpm --filter @workspace/still-eligible run typecheck` and `pnpm --filter @workspace/still-eligible test` must both pass before handing work back.
- After any change under `data/`, run `pnpm --filter @workspace/still-eligible export-data` (tsx) to regenerate `data/dataset.json` and `data/dataset-meta.json`; the data test fails on drift. `pnpm --filter @workspace/still-eligible check-data` runs the same validation without writing, which is what to use while iterating on records (or when several people edit data files at once).
- `api-server` and `mockup-sandbox` artifacts are scaffold leftovers; the app has no backend by design.

## Where things live

- `artifacts/still-eligible/lib/types.ts` is the data model. Read it before touching `data/` or the engine.
- `lib/engine.ts` decides eligibility (pure functions). `lib/deadlines.ts` derives countdowns, "expected next cycle" and sort order from the device clock. `lib/validate.ts` is the zod schema the data test and the remote-dataset parser both run.
- `lib/format.ts` (money, location, apply-ready wording), `lib/share.ts` (five-line share text, prefilled wrong-rule issue URL), `lib/dataset.ts` (versioned dataset parsing, newest-wins, new ids), `lib/config.ts` (the single `REPO_URL` everything derives from; the GitHub username in it is a guess until the repo exists).
- `data/<category>.ts` holds records, `data/index.ts` merges them, `scripts/export-dataset.ts` writes `data/dataset.json`. `docs/verification/<category>.md` holds the official-page quotes each record was built from.
- `app/path-from-zero.tsx` is a static five-step guide; each step deep-links to the home feed with `?category=`.
- `docs/opportunity-schema.md` is the contributor-facing field reference. `CONTRIBUTING.md` explains the data rules.

## Architecture decisions

- No backend, no accounts, no AI, no user submissions. Everything is on-device. The dataset ships inside the app and the app also fetches `data/dataset.json` from the public repo on launch (8 s timeout, zod-validated, cached in AsyncStorage, newest `generated_at` wins, bundled copy is the floor). A data fix merged to the repo reaches installed apps without a store release.
- Rules are an object with nullable fields, not an array. `null` means "no such cutoff" and the detail screen shows that as a positive line ("No minimum CGPA required"), which is the product's point.
- Never invent criteria. Unconfirmed cutoff -> `null` + `verification_status: 'needs_check'` + explanation in `notes`. The engine's `summarizeStatus` never says "You qualify" for a `needs_check` record.
- When a record's deadline has passed or is `tbd`, an explicit `grad_years` list describes the old cycle, so the engine reports it as unknown instead of failing the student.
- No separate recruiter list. TCS NQT is a `company_drives` record with real cutoffs; recruiters without a public criteria page are left out (`docs/verification/recruiters.md`).
- Money honesty: `benefit.amount_status` is `stated` (figure copied from the page), `not_stated` (page read, no figure) or `unchecked` (nobody looked). The UI words the last two differently; never write `not_stated` without reading the page. `amount_source` (URL) is required for a stated amount. `apply.fee_status` is `free`/`paid`/`unchecked`; only `free` renders "Free to apply. Never pay anyone to get you in.", `unchecked` says the fee is not recorded. `apply.*` text nulls render as "not recorded yet". `beginner_friendly` shows a tag only when `true`. Most records are still fee `unchecked` because official pages rarely say whether applying is free; `free` is set only where a page says so.
- Unpaid stepping stones (FOSSEE, Hacktoberfest, Season of KDE) stay in the dataset, labelled Unpaid, because they lead to paid programs.
- Dataset scope (83 records across six buckets as of 2026-09-22): recurring programs only (a one-off hackathon has no next cycle, so it would show a fake "expected next cycle" once its deadline passes); equity-investment and credits-only offers are out; Indian central/state government schemes are out, foreign government scholarships are in; loan scholarships are out; mass recruiters appear only with published cutoffs, otherwise they get a row in `docs/verification/recruiters.md`.
- Every `null` rule must be earned: before writing "no cutoff", search the official page for %, CGPA, GPA, aggregate, marks, backlog, arrear, gap and quote the finding in the category log. Degree bars stated as percentages or on a 4-point scale live in `notes`, never in `min_cgpa`; only a figure the page prints on a 10-point scale goes there. `pnpm check-data` validates without writing; `pnpm export-data` regenerates `data/dataset.json`.
- Jest runs with `babel-jest` + `babel-preset-expo` in a node environment, not `jest-expo` (its transformIgnorePatterns break under pnpm).

## Product

- Onboarding profile: 10th, 12th, CGPA, backlogs, gap years, branch, grad year, citizenship, optional gender, student status, work years.
- Home: "Doors open" grouped into six categories in fixed order (hackathons and fellowships, open source, funded internships and research, scholarships, startup programs, company drives), each with a two-sentence intro. Cards show pay, location, deadline, a New chip for records added since the last visit. "Remote only" filter, category filter via the `category` route param, "Data updated <date>", pull to refresh, Path from zero entry card.
- Detail: What you get box, where, why you qualify (per rule), Report a wrong rule link, Apply-ready section, notes, official and source links, last verified, share (Share sheet; on web, clipboard when `navigator.share` is missing), track.
- Tracking stays free ("no one gonna pay for pro for just tracking"). Only backlogs and CGPA can change in a profile; everything else is fixed.
- Planned: RevenueCat Season Pass INR 149 (entitlement `pro`); the paid feature is not settled with the user yet (leaning: new doors matching your profile plus deadline alerts). Closed doors tab scope undecided.

## User preferences

- Blunt, plain-spoken partner. Plain conversational wording, no em dashes, no emojis in the UI or in prose.
- Explain decisions in chat, not in separate reports. Wants to understand what every file does.
- Ask him only for: the RevenueCat Test Store key (as a secret), criteria verification, and scope cuts.

## Gotchas

- Do not use `Link asChild` around custom components; expo-router's Slot throws on array styles. Use `useRouter().push`.
- `NativeTabs.Trigger.Icon` rejects a `fallback` prop. `useColors()` returns the palette plus `radius`.
- Profile storage key is versioned (`@still_eligible_profile_v2`); bump it whenever `UserProfile` changes shape.
- Do not use `toLocaleDateString` in the app; `lib/deadlines.ts` has `formatDate`.
- Typed routes are generated by the running Expo dev server (`.expo/types/router.d.ts`); after adding a screen, restart the workflow before `typecheck` or the new path is rejected.
- Node's type stripping cannot run the data TS files (extensionless imports); use `tsx` (a devDependency of the artifact) for scripts.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
