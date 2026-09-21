# Opportunity schema

Every opportunity in StillEligible is one object in a TypeScript file under `data/`. The shape is defined once in `lib/types.ts` and checked at runtime by `lib/validate.ts` when you run `pnpm test`. This page explains each field in plain language and the rules for filling it in.

## The record

```ts
{
  id: 'gsoc',
  title: 'Google Summer of Code',
  org: 'Google Open Source',
  category: 'open_source',
  summary: 'A paid 12 week (or longer) open source contribution program with a mentor. Stipend depends on project size and your country.',
  benefit: {
    kind: 'stipend',
    what_you_get: 'A stipend paid over the coding period, sized by project length and your country.',
    amount_text: null,
    amount_status: 'unchecked',
    amount_source: null,
  },
  location: { mode: 'remote', place: 'Open worldwide' },
  apply: {
    what_you_need: 'A proposal written with a mentoring organisation, and ideally a small merged contribution to it.',
    how_they_select: 'Mentoring organisations rank proposals; Google confirms the slots.',
    beginner_friendly: true,
    application_fee: null,
    fee_status: 'unchecked',
  },
  official_url: 'https://summerofcode.withgoogle.com/',
  source_url: 'https://summerofcode.withgoogle.com/rules',
  last_verified: '2026-09-21',
  deadline: '2026-04-02',
  typical_window: 'Contributor applications usually open in late March and close in early April.',
  rules: {
    min_tenth_pct: null,
    min_twelfth_pct: null,
    min_cgpa: null,
    max_active_backlogs: null,
    max_gap_years: null,
    grad_years: null,
    citizenship: 'any',
    gender: 'any',
    requires_student: false,
    branches: 'any',
    min_work_years: null,
  },
  verification_status: 'verified',
  tags: ['stipend', 'remote', 'open source'],
  notes: 'You must be 18 or older. Contributors from countries under US sanctions cannot take part.',
  alternative_ids: ['mlh-fellowship'],
}
```

## Fields

| Field | Type | What it means |
| --- | --- | --- |
| `id` | string | Stable kebab-case id, no year suffix (`gsoc`, not `gsoc-2027`). Tracked lists are stored by id, so never rename one. |
| `title` | string | The program name as the organisation writes it. |
| `org` | string | Who runs it. |
| `category` | one of the six codes below | Which home screen section it belongs in. |
| `summary` | string | One or two plain sentences: what it is and what you get. No marketing language. |
| `benefit` | object | The money. See [Benefit](#benefit). |
| `location` | object | Where you would be. See [Location](#location). |
| `apply` | object | What it takes to apply. See [Apply-ready](#apply-ready). |
| `official_url` | https URL | Where the student applies. |
| `source_url` | https URL | The exact page where you read the eligibility criteria. Often the same as `official_url`. Prefer a rules or FAQ page over a landing page. |
| `last_verified` | `YYYY-MM-DD` | The date a human last read `source_url`. Update it every time you re-check. |
| `deadline` | `YYYY-MM-DD`, `'rolling'` or `'tbd'` | The application close date, written as the calendar date the organiser publishes (in the organiser's own timezone). The app keeps the door open through the end of that date on the device clock and closes it the next morning. For an organiser west of India this closes a few hours early, which is the safe direction; never pad the date forward to compensate. `rolling` means applications are always open. `tbd` means the next cycle date is not announced. Never guess a date. |
| `typical_window` | string or null | When the program usually opens and closes each year. Required when `deadline` is `tbd` or already in the past, because the card will say "expected next cycle" and the student needs to know when. |
| `rules` | object | The cutoffs. See below. |
| `verification_status` | `'verified'` or `'needs_check'` | `verified` means every rule was read on an official page. `needs_check` means at least one thing could not be confirmed. |
| `tags` | 1 to 6 short strings | Free-form labels shown as chips. |
| `notes` | string | Caveats, unconfirmed criteria, context. Required (at least 20 characters) when `verification_status` is `needs_check`. |
| `alternative_ids` | string[] | Ids of similar programs. The "Closed doors" tab uses these to suggest a next step. |

## Categories

The six categories, in the order the home screen shows them:

| Code | Label | What belongs here |
| --- | --- | --- |
| `hackathons_fellowships` | Hackathons and fellowships | Prize money or a fellowship stipend; no marks needed to enter. |
| `open_source` | Open source programs | Paid contribution programs and the unpaid stepping stones that lead to them. |
| `funded_internships` | Funded internships and research | Stipend or costs covered; India and abroad. |
| `scholarships` | Scholarships | Merit or need based, student-facing, from a foundation, university or company. No government portals. |
| `startup_programs` | Startup programs | Grants, fellowships and incubators that put money behind a student founder. Credit-only offers are out. |
| `company_drives` | Company drives | Off-campus hiring where the company publishes its criteria on an official page. |

There is no separate recruiter list. A mass recruiter that publishes its cutoffs (today, TCS NQT) is a `company_drives` record with real rules; the app shows the student which rule failed. Recruiters whose cutoffs only reach colleges through placement cells are left out on purpose; see `docs/verification/recruiters.md`.

## Benefit

| Field | Type | What it means |
| --- | --- | --- |
| `kind` | `stipend`, `prize_money`, `funded_study`, `grant`, `paid_role`, `costs_covered`, `unpaid` | The shape of the money. `unpaid` is allowed only for stepping stones that lead somewhere paid, and the app labels them Unpaid. |
| `what_you_get` | string, 10 to 240 chars | One plain sentence in the student's terms: "A stipend paid over 12 weeks", "Tuition, a monthly allowance and one flight". |
| `amount_text` | string or null | The amount exactly as the official page states it, with the currency: `'USD 7,000'`, `'INR 1 to 1.1 lakh per month'`, `'Up to EUR 700 per month'`. Required when `amount_status` is `stated`, must be null otherwise. |
| `amount_status` | `stated`, `not_stated`, `unchecked` | `stated`: the page names a figure and it is in `amount_text`. `not_stated`: a human read the page and it gives no figure. `unchecked`: nobody has looked for a figure yet. Never write `not_stated` without reading the page; the app words the two differently. |
| `amount_source` | https URL or null | The page the amount was read on. Required when `amount_status` is `stated`, null otherwise. Copy the sentence into `docs/verification/<category>.md` as well. |

## Location

| Field | Type | What it means |
| --- | --- | --- |
| `mode` | `remote`, `on_site`, `hybrid` | `remote` powers the "Remote only" filter, so use it only when the whole program can be done from home. |
| `place` | string or null | Where, in a few words: `'Open worldwide'`, `'Bengaluru'`, `'Online rounds, finals in person'`. Required for `on_site` and `hybrid`. |

## Apply-ready

| Field | Type | What it means |
| --- | --- | --- |
| `what_you_need` | string or null | What to have ready before starting: a proposal, a resume, a team, a GitHub profile. Null means not recorded yet; the app says so and sends the student to the official page. |
| `how_they_select` | string or null | The selection route in one sentence: coding test then interviews, proposal review, jury. Null means not recorded yet. |
| `beginner_friendly` | boolean or null | `true` only when the official page says beginners or first-time contributors are welcome. `false` when it asks for prior experience. Null when the page does not say. The app shows a tag only for `true`. |
| `application_fee` | string or null | The fee as the page states it, e.g. `'INR 500 registration fee'`. Required when `fee_status` is `paid`, null otherwise. |
| `fee_status` | `free`, `paid`, `unchecked` | `free` only when the page says there is no fee or you went through the application flow and found none; the app then prints "Free to apply. Never pay anyone to get you in." `paid` quotes `application_fee`. `unchecked` means nobody has looked, and the app says the fee is not recorded. Never write `free` without checking. |

## Rules

Every rule is present on every record. `null` means the program does not apply that cutoff. The engine treats a `null` rule as `no_rule` and the detail screen shows it as a line like "No minimum CGPA required." That line is the whole point of the app, so do not leave rules out to save typing.

| Rule | Type | Passes when |
| --- | --- | --- |
| `min_tenth_pct` | number 0 to 100 or null | profile `tenth_pct` is at least this |
| `min_twelfth_pct` | number 0 to 100 or null | profile `twelfth_pct` is at least this |
| `min_cgpa` | number 0 to 10 or null | profile `cgpa` is at least this |
| `max_active_backlogs` | integer or null | profile `active_backlogs` is at most this |
| `max_gap_years` | integer or null | profile `gap_years` is at most this |
| `grad_years` | number[] or null | profile `grad_year` is in the list |
| `branches` | Branch[] or `'any'` | profile `branch` is in the list |
| `citizenship` | `('IN' \| 'OTHER')[]` or `'any'` | profile `citizenship` is in the list |
| `gender` | `'any'` or `'women'` | see below |
| `requires_student` | boolean | when true, profile `is_student` must be true |
| `min_work_years` | number or null | profile `work_years` is at least this |

Branch codes: `CSE`, `IT`, `AI_DS`, `ECE`, `EE`, `ME`, `CE`, `CHEM`, `OTHER`. Labels live in `BRANCH_LABELS` in `lib/types.ts`.

Gender: `'women'` marks women-only programs. A profile that says `woman` passes, `man` fails, and `prefer_not_to_say`, `non_binary` or unset stays `unknown`. The app never fails someone for not disclosing.

`min_work_years` is not one of the classic placement cutoffs, but Chevening and Fulbright-Nehru gate on it, and without it the app would tell a third-year student "you qualify" when they do not.

## How the engine reads a record

For each rule, `lib/engine.ts` returns one of four statuses:

- `pass`: the student meets the rule
- `fail`: the student does not
- `unknown`: the rule exists but the profile field it needs is empty
- `no_rule`: the program does not apply this cutoff

The overall status is `not_eligible` if anything failed, otherwise `unknown` if anything is unknown, otherwise `eligible`. The home screen hides `not_eligible` records and shows the rest.

## What the tests enforce

`pnpm test` runs `lib/validate.ts` over every record and fails on:

- duplicate ids, or ids that are not kebab-case
- URLs that are not `https://`
- dates that are not real calendar dates
- percentages outside 0 to 100, CGPA outside 0 to 10
- `needs_check` records without an explanation in `notes`
- `tbd` or already-passed deadlines without a `typical_window`
- `alternative_ids` that point at records that do not exist
- em dashes in user-facing text
- recruiter records leaking into the home list

## Where the numbers must come from

Only official pages: the program's own site, the company's own careers page, a government notification PDF. Never a coaching site, a Telegram forward, a blog post or a placement group screenshot. If an official page does not state a cutoff, the rule is `null` and the record says so in `notes` with `verification_status: 'needs_check'`. Inventing a number is worse than leaving it out, because the student will trust it.
