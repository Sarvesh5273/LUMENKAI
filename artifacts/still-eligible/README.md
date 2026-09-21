# StillEligible

Most placement drives in India filter on five numbers: 10th percentage, 12th percentage, CGPA, active backlogs and gap years. Students who miss one cutoff often assume every door is shut. Most doors never had that cutoff.

StillEligible is an offline-first Android and iOS app that takes a student's profile once, checks it against a hand-verified dataset of programs, and shows exactly which doors are still open and why. For every program it prints one line per rule, including the lines that matter most: "No minimum CGPA required."

Built solo by a BTech student for the RevenueCat Shipaton 2026 Next Gen award.

## What it does

- **Profile once, on the device.** 10th, 12th, CGPA, backlogs, gap years, branch, graduation year, citizenship, optional gender, student status, work experience. Stored with AsyncStorage. No account, no server, nothing leaves the phone.
- **Doors open.** Money-bearing opportunities you qualify for, grouped into six categories: hackathons and fellowships, open source programs, funded internships and research, scholarships, startup programs, company drives. Every card shows what it pays and where you would be, and a "Remote only" filter cuts the list to what you can do from home.
- **Honest about money.** Each record carries the benefit as the official page states it, with the page it was read on. An amount nobody has checked is shown as "not recorded yet", never as "nothing".
- **Apply-ready.** What you need before you start, how they select, whether beginners are welcome, and the application fee. A record whose fee has been checked and found to be zero says so outright: never pay anyone to get you in. A fee nobody has checked is shown as unchecked, not as free.
- **Path from zero.** A fixed five-step route for a student with weak marks and no network: one hackathon, one merged pull request, a paid remote mentorship, a funded internship, then product companies directly. Each step links to the matching section of the feed.
- **Always current.** The app ships with the dataset built in and downloads the newest `data/dataset.json` from this repo on launch. A merged data fix reaches every installed app without a store release. Records added since your last visit are marked New.
- **Share and report.** A five-line WhatsApp-ready share message (name, pay, who can apply, deadline, official link) and a "Report a wrong rule" link that opens a prefilled issue here.
- **Why you qualify.** Every record shows each rule with pass, fail, unknown or "no such cutoff", plus the official link, the page the criteria were read from, and the date a human last read it.
- **Honest about uncertainty.** A missing profile field never fails a rule; it shows as "check this" and names the field. A record whose criteria could not be fully confirmed says so in the UI.
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
lib/deadlines.ts    Countdown, "expected next cycle" and sort order, computed from the device clock
lib/format.ts       Wording for money, location and apply-ready fields
lib/share.ts        Share text and the prefilled "wrong rule" issue link
lib/dataset.ts      Versioned dataset file: parsing, which copy wins, what counts as new
lib/config.ts       The repo URL everything else derives from
lib/conversions.ts  CGPA and percentage helpers for the onboarding form
lib/validate.ts     Runtime schema used by the data tests
lib/store.tsx       AsyncStorage-backed profile, tracked list and dataset cache
data/               One file per category, index.ts that merges them, and the generated dataset.json
scripts/check-data.ts      Validates every record without writing anything (pnpm check-data)
scripts/export-dataset.ts  Writes data/dataset.json; run it after any data change
tests/              Jest tests for the engine, deadlines, conversions, wording, dataset parsing and data drift
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
