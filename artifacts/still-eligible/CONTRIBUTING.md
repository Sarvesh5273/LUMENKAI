# Contributing to the StillEligible dataset

Most useful contributions are data fixes: a cutoff that changed, a deadline that moved, a program that closed, a program that is missing. You do not need to know React Native to help. You need a browser, an official page, and about ten minutes.

## Where records live

One file per category in `data/`:

| File | Shows up as |
| --- | --- |
| `data/criteria_free_drives.ts` | Criteria-free drives |
| `data/open_source.ts` | Open source programs |
| `data/funded_internships.ts` | Funded internships and research |
| `data/abroad_scholarships.ts` | Abroad scholarships |
| `data/hackathons_fellowships.ts` | Hackathons and fellowships |
| `data/recruiters.ts` | Closed doors tab only (mass recruiter cutoffs) |

`data/index.ts` merges them. You should not need to touch it.

The field-by-field reference is in [`docs/opportunity-schema.md`](docs/opportunity-schema.md). Read it once.

## The three rules

1. **Official sources only.** The program's own site, the company's own careers page, or a government notification. Not a coaching site, not a Telegram forward, not a blog, not a screenshot from a placement group. Put the exact page you read in `source_url`.
2. **Never invent a number.** If the official page does not state a cutoff, the rule is `null`. If you are not sure whether a cutoff exists, set `verification_status: 'needs_check'` and say what you could not confirm in `notes`. A missing number is a gap the student can check. A made-up number is a lie the student will trust.
3. **Never guess a date.** `deadline` is the date on the official page, or `'rolling'`, or `'tbd'`. When the last known window has passed, leave the old date in place and fill `typical_window` so the app can say "expected next cycle".

## Adding or fixing a record

1. Open the official page. Copy the eligibility text into `docs/verification/<category>.md` under the record id, with the URL and today's date. This is the paper trail the next person will need.
2. Edit the record in the matching `data/*.ts` file. Set `last_verified` to today in `YYYY-MM-DD`.
3. Run the checks from the repo root:

   ```bash
   pnpm --filter @workspace/still-eligible run typecheck
   pnpm --filter @workspace/still-eligible test
   ```

   The data test names the record id and field when something is wrong.
4. Open a pull request. In the description, paste the sentence from the official page that supports each number you changed.

## Removing a record

Programs close. When one does, delete the record and remove its id from every other record's `alternative_ids` (the test will tell you where). Add one line to the pull request explaining what the official page now says.

## Style

- Plain English. Short sentences. No emojis and no em dashes in any text the app shows.
- `summary` says what the program is and what the student gets. Nothing promotional.
- `notes` is for caveats a student would want to know before applying: age limits, nationality quirks, things you could not confirm.

## What not to send

- Records for programs you found on aggregator sites but could not trace to an official page.
- Records whose only source is a past year's PDF with no sign the program still runs.
- Edits that change ids. Tracked lists on students' phones are stored by id.
