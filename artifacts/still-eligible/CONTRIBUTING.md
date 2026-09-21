# Contributing to the StillEligible dataset

Most useful contributions are data fixes: a cutoff that changed, a deadline that moved, a program that closed, a program that is missing. You do not need to know React Native to help. You need a browser, an official page, and about ten minutes.

## Where records live

One file per category in `data/`:

| File | Shows up as |
| --- | --- |
| `data/hackathons_fellowships.ts` | Hackathons and fellowships |
| `data/open_source.ts` | Open source programs |
| `data/funded_internships.ts` | Funded internships and research |
| `data/scholarships.ts` | Scholarships |
| `data/startup_programs.ts` | Startup programs |
| `data/company_drives.ts` | Company drives |

`data/index.ts` merges them. You should not need to touch it. `data/dataset.json` is generated from these files (see step 3 below) and is what installed apps download, so never edit it by hand.

The field-by-field reference is in [`docs/opportunity-schema.md`](docs/opportunity-schema.md). Read it once.

## The four rules

1. **Official sources only.** The program's own site, the company's own careers page, or a government notification. Not a coaching site, not a Telegram forward, not a blog, not a screenshot from a placement group. Put the exact page you read in `source_url`.
2. **Never invent a number.** If the official page does not state a cutoff, the rule is `null`. If you are not sure whether a cutoff exists, set `verification_status: 'needs_check'` and say what you could not confirm in `notes`. A missing number is a gap the student can check. A made-up number is a lie the student will trust.
3. **Never guess a date.** `deadline` is the date on the official page, or `'rolling'`, or `'tbd'`. When the last known window has passed, leave the old date in place and fill `typical_window` so the app can say "expected next cycle".
4. **Never guess the money.** `benefit.amount_text` is copied from the official page with its currency, or it is null, and `amount_source` is the page you copied it from. `amount_status: 'not_stated'` means you read the page and it gives no figure; if you did not look, leave `'unchecked'`. The same goes for the fee: `fee_status: 'free'` only after you checked, otherwise `'unchecked'`. `beginner_friendly: true` only when the page says so.

## Adding or fixing a record

1. Open the official page. Copy the eligibility text into `docs/verification/<category>.md` under the record id, with the URL and today's date. This is the paper trail the next person will need.
2. Edit the record in the matching `data/*.ts` file. Set `last_verified` to today in `YYYY-MM-DD`.
3. Regenerate the dataset file and run the checks from the repo root:

   ```bash
   pnpm --filter @workspace/still-eligible export-data
   pnpm --filter @workspace/still-eligible run typecheck
   pnpm --filter @workspace/still-eligible test
   ```

   The data test names the record id and field when something is wrong, and fails if `data/dataset.json` is out of date.
4. Open a pull request. In the description, paste the sentence from the official page that supports each number you changed.

Once the pull request is merged, every installed app picks up the new `data/dataset.json` on its next launch. No app store release is needed for a data fix.

## Removing a record

Programs close. When one does, delete the record and remove its id from every other record's `alternative_ids` (the test will tell you where). Add one line to the pull request explaining what the official page now says.

## Style

- Plain English. Short sentences. No emojis and no em dashes in any text the app shows.
- `summary` says what the program is and what the student gets. Nothing promotional.
- `notes` is for caveats a student would want to know before applying: age limits, nationality quirks, things you could not confirm.
- `benefit.what_you_get` is one sentence in the student's terms. "A stipend paid over 12 weeks", not "a life-changing opportunity".

## Reporting a wrong rule from the app

Every record's detail screen has a "Report a wrong rule" link. It opens a prefilled issue on this repo with the record id and each rule as a checkbox. If you are fixing one of those issues, the checked box is the field to look at and the reporter's paste is the new source sentence.

## What not to send

- Records for programs you found on aggregator sites but could not trace to an official page.
- Records whose only source is a past year's PDF with no sign the program still runs.
- Edits that change ids. Tracked lists on students' phones are stored by id.
