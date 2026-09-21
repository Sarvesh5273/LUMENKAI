## Key Facts
- **Student exception:** The Next Gen page says eligible students may submit **video + source code instead of an app-store listing**. It does not, in the fetched text, say that a mocked purchase satisfies any RevenueCat-integration requirement. https://www.shipaton.com/next-gen
- **Eligibility:** Active students include college/university students, with academic-email verification indicated. A BTech student likely fits, but final eligibility remains subject to Devpost rules. https://revenuecat-shipaton-2026.devpost.com/rules
- **Deadline:** Search evidence advertises **September 30, 2026, 11:45pm**; from September 21 this is roughly nine full days plus deadline day, depending on timezone. https://shipaton.com/
- **Expo Go is not genuine purchase proof:** RevenueCat Preview API Mode replaces native calls with JavaScript mocks. It can preview UI/logic, but actual IAP testing requires an Expo development build. https://www.revenuecat.com/docs/getting-started/installation/expo
- **Test Store is simulated, but functional:** It requires React Native SDK **9.5.4+** and a Test Store API key. Its modal simulates success/failure/cancellation while updating CustomerInfo, entitlements, and RevenueCat dashboard data. It is not a native Apple/Google checkout or real-money purchase. https://www.revenuecat.com/docs/test-and-launch/sandbox/test-store
- **No public release is technically needed for this student prototype:** Test Store needs no App Store/Play setup, and the student category waives the listing. This is an interpretation combining two official facts—not an explicit judging guarantee.

## Minimum Credible Functional Demonstration — Recommendation, Not Official Judging
Build an Expo **development build**, integrate current `react-native-purchases`, load a real RevenueCat Offering/paywall, demonstrate Test Store success/cancel/failure, unlock and persist an entitlement-gated feature, show CustomerInfo/dashboard evidence, and include source plus a concise video. Label the transaction clearly as **RevenueCat Test Store simulated purchase**. If time/accounts permit, add an Apple/Google sandbox transaction through the native store flow; sandbox still is not a real-money purchase but is stronger integration evidence. Do not present Expo Go mock UI as a completed purchase.

**Go/no-go interpretation:** A ten-day technically credible student submission is feasible if scope is tiny and a development build works early. Enter for learning/portfolio value, not on an expectation of prize winnings: no source found gives entrant count, acceptance odds, or confirms Test Store alone meets judging expectations.

## Notable Claims Requiring Cross-Reference
- Full Devpost rules and judging criteria were not fetched; verify whether RevenueCat integration, new-app dates, team size, country eligibility, and video format add constraints.
- The general event markets “real apps to real stores,” while Next Gen expressly waives the store listing. Treat the latter as a category exception, not proof that mocked monetization qualifies.
- Search snippets indicate platform sandbox needs App Store Connect/Play Console configuration; exact account/test-track requirements should be checked before committing time.

## Source Quality Assessment
- RevenueCat Test Store and Expo installation docs: **primary technical documentation**.
- Shipaton Next Gen and Devpost rules: **primary event sources**; Devpost should control if wording conflicts.
- RevenueCat announcement/event homepage and Expo tutorial: **official but partly marketing/summary**, weaker than rules/docs.

## Gaps
No authoritative fetched text states a required purchase type for Next Gen, whether Test Store earns judging credit, entrant/prize odds, or India-specific prize/tax constraints.

## Sources
- Shipaton Next Gen Award — https://www.shipaton.com/next-gen — accessed 2026-09-21 — `research/sources/build-shipaton-next-gen.md`
- RevenueCat Test Store — https://www.revenuecat.com/docs/test-and-launch/sandbox/test-store — accessed 2026-09-21 — `research/sources/build-revenuecat-test-store.md`
- RevenueCat with Expo — https://www.revenuecat.com/docs/getting-started/installation/expo — accessed 2026-09-21 — `research/sources/build-expo-revenuecat.md`
- Devpost rules, event homepage, RevenueCat announcement, sandbox docs, Expo tutorial snippets — URLs recorded with date 2026-09-21 — `research/sources/build-search-snippets.md`