# StillEligible

Offline-first Expo app that takes an Indian BTech student's profile once and shows which programs they still qualify for, with one plain-English line per eligibility rule. Built for the RevenueCat Shipaton 2026 Next Gen award (submission closes 30 Sep 2026, 11:45 pm PDT).

## Run & Operate

- Mobile app lives in `artifacts/still-eligible` (workflow `artifacts/still-eligible: expo`). Restart it with the workflow tool, never with `npx expo start`.
- `pnpm --filter @workspace/still-eligible run typecheck` and `pnpm --filter @workspace/still-eligible test` must both pass before handing work back.
- `api-server` and `mockup-sandbox` artifacts are scaffold leftovers; the app has no backend by design.

## Where things live

- `artifacts/still-eligible/lib/types.ts` is the data model. Read it before touching `data/` or the engine.
- `lib/engine.ts` decides eligibility (pure functions). `lib/deadlines.ts` derives countdowns and "expected next cycle" from the device clock. `lib/validate.ts` is the zod schema the data test runs.
- `data/<category>.ts` holds records, `data/index.ts` merges them. `docs/verification/<category>.md` holds the official-page quotes each record was built from.
- `docs/opportunity-schema.md` is the contributor-facing field reference. `CONTRIBUTING.md` explains the data rules.

## Architecture decisions

- No backend, no accounts, no AI, no user submissions. Everything is on-device; the dataset ships inside the app.
- Rules are an object with nullable fields, not an array. `null` means "no such cutoff" and the detail screen shows that as a positive line ("No minimum CGPA required"), which is the product's point.
- Never invent criteria. Unconfirmed cutoff -> `null` + `verification_status: 'needs_check'` + explanation in `notes`. The engine's `summarizeStatus` never says "You qualify" for a `needs_check` record.
- When a record's deadline has passed or is `tbd`, an explicit `grad_years` list describes the old cycle, so the engine reports it as unknown instead of failing the student.
- Mass recruiter records feed only the Closed doors tab. Only recruiters with cutoffs on a public official page are kept (currently TCS NQT alone).
- Jest runs with `babel-jest` + `babel-preset-expo` in a node environment, not `jest-expo` (its transformIgnorePatterns break under pnpm).

## Product

- Onboarding profile: 10th, 12th, CGPA, backlogs, gap years, branch, grad year, citizenship, optional gender, student status, work years.
- Home: "Doors still open" grouped into five categories (criteria-free drives, open source, funded internships and research, abroad scholarships, hackathons and fellowships).
- Detail: why you qualify (per rule), official and source links, last verified, notes, apply and track.
- Planned: Closed doors tab, tracked deadlines with local reminders, RevenueCat Pro paywall (entitlement `pro`, Season Pass ~INR 149 and monthly ~INR 99, free tier = 3 tracked).

## User preferences

- Blunt, plain-spoken partner. Plain conversational wording, no em dashes, no emojis in the UI or in prose.
- Explain decisions in chat, not in separate reports. Wants to understand what every file does.
- Ask him only for: the RevenueCat Test Store key (as a secret), criteria verification, and scope cuts.

## Gotchas

- Do not use `Link asChild` around custom components; expo-router's Slot throws on array styles. Use `useRouter().push`.
- `NativeTabs.Trigger.Icon` rejects a `fallback` prop. `useColors()` returns the palette plus `radius`.
- Profile storage key is versioned (`@still_eligible_profile_v2`); bump it whenever `UserProfile` changes shape.
- Do not use `toLocaleDateString` in the app; `lib/deadlines.ts` has `formatDate`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
