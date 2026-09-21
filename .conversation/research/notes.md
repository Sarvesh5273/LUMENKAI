# Shipaton 2026 decision research

Status: complete
Depth: Standard, with final findings delivered directly in chat
Date: 2026-09-21

## Plan
- Question: Is a ten-day attempt rational for a student seeking a prize, rather than merely a submission?
- Scope: official eligibility and judging, relevant prize tracks, actual competition, historical winners, shipping bottlenecks, and feasible scope.
- Audience: Sarvesh, a BTech student weighing opportunity cost.
- Deliverable: blunt go/no-go recommendation, factual blockers, uncertainty, and a bounded commitment test.

## Focus areas
1. Rules, Next Gen, and stacking/category restrictions: checked against official rules and FAQ
2. Previous winners and standards of execution: checked against organizer's 2025 winner retrospective
3. Current visible competition and limitations of public counts: gallery unpublished; entrant quality and category counts unavailable
4. App-store publication, accounts, and review bottlenecks: checked against Google, Apple, Samsung documentation
5. RevenueCat integration and ten-day student-route feasibility: checked against Test Store and Expo documentation

## Coverage checklist
- [x] Exact deadline and India conversion: September 30, 23:45 PDT = October 1, 12:15 IST.
- [x] Student eligibility and Next Gen exemption requirements: active student, qualifying academic email, public licensed code repository and demo; store listing not required.
- [x] Prize tracks, judging, and restrictions: Next Gen judges concept, working progress, thoughtful RevenueCat use, technical/product/presentation care.
- [x] Current competitor evidence: limitation, gallery not published. Homepage shows 18,474 participants, not submitted projects or student entrants.
- [x] Prior winning projects: 812 submissions in 2025; Payout had substantial revenue/users; Studient built in seven days and placed fourth in OneSignal category.
- [x] Store/account and technical blockers: Google fresh personal-account testing minimum exceeds remaining window; Next Gen removes publication gate, not RevenueCat requirement.
- [x] Recommendation: no-go for grand-prize-first plan; at most conditional Next Gen go after a 48-hour test. No reliable win-probability estimate.
- [x] Important user unknowns: builder-hours, mobile experience, team, existing code, accounts, academic email, reachable test users.

## Findings log
- [@official-rules] Deadline September 30, 2026, 11:45 pm PDT. UTC-7 to UTC+5:30 conversion adds 12h30m.
- [@official-rules] Grand Prize shortlisting uses total event revenue in RevenueCat, followed by growth judging. Earlier unreleased development explicitly allowed.
- [@official-rules] Next Gen: student academic email, public repository with open-source license, under-two-minute demo, native mobile/desktop supported platforms, RevenueCat integration remains required.
- [@official-rules] Next Gen rubric: clear/useful/interesting/original idea; meaningful progress; thoughtful monetization integration; technical/product/presentation care. No numerical weights given.
- [@official-faq] Next Gen can overlap another award only when satisfying both code and store submission requirements.
- [@official-rules] Next Gen prizes $15k/$10k/$5k; rules prevail over inconsistent marketing.
- [@event-home] Homepage lists Next Gen $20k/$10k/$5k and 18,474 participants as checked September 21.
- [@current-gallery] Managers have not published gallery. No claim that it will necessarily open on a specific date.
- [@winners-2025] 812 projects in 2025, versus tens of thousands of participants. Payout had 17,000+ users, $30,017 revenue, 1,750 paying subscribers.
- [@winners-2025] Studient reportedly built in seven days, fourth in 2025 OneSignal Boost. Existence proof of short-build prize placement, not probability or 2026 Next Gen precedent.
- [@google-testing] New personal Google Play accounts require 12 opted-in testers continuously for 14 days before production application.
- [@apple-enrollment] Enrollment/verification introduces uncertainty; no guaranteed ten-day completion established.
- [@samsung-onboarding] Commercial seller verification can consume remaining window; not a dependable workaround.
- [@revenuecat-test-store] Test Store exercises SDK, CustomerInfo, entitlements and dashboard without store setup. Purchases simulated and reported as sandbox.
- [@revenuecat-expo] Expo Go uses mock APIs; development build needed for real RevenueCat purchase integration testing.

## Conflicts and open questions
- Resolved: controlling rules accept RevenueCat purchases or RevenueCat Ads; homepage description is less complete.
- Unresolved: $15k versus $20k Next Gen first prize. Plan against controlling $15k rules until organizer clarification; do not present either as unanimously confirmed.
- Unresolved: no explicit official statement found that Test Store-only integration satisfies Next Gen. Request organizer clarification before relying on it.
- Limitation: Next Gen entrants/count/quality are not visible. Cannot calculate odds.
- Limitation: rules do not clearly establish academic-email proof requirements for every member of a mixed team.
- Limitation: team availability, mobile experience, developer accounts, and daily hours unknown.

## Recommended commitment gate
- Spend at most 48 hours proving a real core workflow on a device, RevenueCat integration, academic eligibility, and usefulness with five reachable target users.
- Stop if those gates fail, if only generic features are available, or if the work has no value to the user without a cash prize.
- If gates pass, reserve days 3-6 for one core flow, 7-8 for testing/polish, and 9-10 for repository, demo and submission.
- A reusable core product reduces opportunity cost, but later hackathons must independently allow prior work.

## Evidence handling
- Final response delivered directly in chat, matching user's format preference.
- Claims verified against saved source text, rather than relying solely on extracted summaries.
- Two slow auxiliary investigations were cancelled after parent verified historical winners and public gallery directly.