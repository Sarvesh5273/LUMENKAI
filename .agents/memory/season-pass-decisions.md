---
name: Season Pass decisions
description: Conventions behind the paid "closed doors" feature and the RevenueCat wiring that are not obvious from the code.
---

**Rule: a fix line clears a known blocker; only a verified record with no unknown rules may be described as "opens".**
**Why:** a first draft counted a `needs_check` record and doors with unchecked rules on the CGPA ladder as "opens", which the engine itself would still call unknown. Same honesty bar as the free feed.
**How to apply:** any new summary, badge or share text about closed doors must go through the strict "fully opens" standard or use hedged wording ("comes down to", "clears the last known blocker").

**Rule: never predict future eligibility from a batch list.** Younger than every listed batch = "not this cycle"; older than the list = closed for good.
**Why:** "batch lists usually move up a year" was flagged as an invented criterion; older batches never get added back.

**Rule: a production web build gets no RevenueCat key (paywall says the pass is sold in the mobile apps).**
**Why:** the SDK's web mode only takes the Test Store key here, which would hand out the `pro` entitlement free on a public URL. Dev web preview and Expo Go still use the Test Store key.

**Gotcha:** `@replit/revenuecat-sdk` generic `client.post<T>()` returns a union that hides `T`'s fields; cast the `data` when reading it. Top-level await in scripts needs `.mts` under tsx.
