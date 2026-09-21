# StillEligible

Most placement drives in India filter on five numbers: 10th percentage, 12th percentage, CGPA, active backlogs and gap years. Students who miss one cutoff often assume every door is shut. Most doors never had that cutoff.

StillEligible is an offline-first Android and iOS app that takes a student's profile once, checks it against a hand-verified dataset of programs, and shows exactly which doors are still open and why. For every program it prints one line per rule, including the lines that matter most: "No minimum CGPA required."

Built solo by a BTech student for the RevenueCat Shipaton 2026 Next Gen award.

## What it does

- **Profile once, on the device.** 10th, 12th, CGPA, backlogs, gap years, branch, graduation year, citizenship, optional gender, student status, work experience. Stored with AsyncStorage. No account, no server, nothing leaves the phone.
- **Doors still open.** Programs you qualify for, grouped into five categories: criteria-free drives, open source programs, funded internships and research, abroad scholarships, hackathons and fellowships.
- **Why you qualify.** Every record shows each rule with pass, fail, unknown or "no such cutoff", plus the official link, the page the criteria were read from, and the date a human last read it.
- **Honest about uncertainty.** A missing profile field never fails a rule; it shows as "check this" and names the field. A record whose criteria could not be fully confirmed says so in the UI.
- **Closed doors (planned).** Mass recruiter cutoffs live in a separate list so the app can tell you which number shut a door and by how much, and point at the nearest open one. Only recruiters that publish their cutoffs on an official public page are included, which today means TCS NQT alone; the rest reach students through placement cells, not URLs.
- **Tracked deadlines.** Save what you plan to apply to. Countdowns are computed on the device from the stored date; programs whose last window has passed show "expected next cycle" with the usual annual window. Local reminders are planned.

## Where the data comes from

Every record has an `official_url`, a `source_url` (the exact page the criteria were read on) and a `last_verified` date. The reading notes for each category are in `docs/verification/`. If an official page did not state a cutoff, the rule is `null` and the record is marked `needs_check` with an explanation. No number in the dataset was made up to fill a gap. See [`CONTRIBUTING.md`](CONTRIBUTING.md) if you want to fix or add a record.

## Project layout

```
app/                Expo Router screens (onboarding, tabs, opportunity detail)
components/         Reusable UI pieces
constants/, hooks/  Theme and colour helpers
lib/types.ts        The data model. Read this first.
lib/engine.ts       Pure eligibility engine: one record + one profile -> verdict with reasons
lib/deadlines.ts    Countdown and "expected next cycle" logic, computed from the device clock
lib/conversions.ts  CGPA and percentage helpers for the onboarding form
lib/validate.ts     Runtime schema used by the data tests
lib/store.tsx       AsyncStorage-backed profile and tracked list
data/               One file per category plus index.ts that merges them
tests/              Jest tests for the engine, deadlines, conversions and the dataset
docs/               Schema reference and per-category verification logs
```

## Running it

This package lives in a pnpm workspace. From the repo root:

```bash
pnpm install
pnpm --filter @workspace/still-eligible run typecheck
pnpm --filter @workspace/still-eligible test
```

The Expo dev server is started by the workspace's `expo` workflow. Scan the QR code with Expo Go on a phone, or open the web preview.

## Stack

- Expo SDK 57 (React Native 0.86, Expo Router), TypeScript
- Zod for runtime validation of the dataset
- Jest with babel-preset-expo for the pure logic tests
- RevenueCat for the Pro tier (planned, not wired yet)

## Licence

MIT. See [`LICENSE`](../../LICENSE).
