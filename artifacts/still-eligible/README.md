# StillEligible

A candid, offline-first eligibility checker for Indian BTech students navigating campus placements, off-campus drives, and alternative routes.

## Day 1 Capabilities
- **Local Onboarding:** 60-second profile setup storing 10th %, 12th %, CGPA, backlogs, branch, etc.
- **Offline Deterministic Engine:** Instantly evaluates eligibility based on strict rules.
- **Categorized Opportunities:** Shows curated open doors across Mass Recruiters, Product, Startups, Govt, and Higher Ed.
- **Per-Rule Transparency:** Explicitly tells you why you passed, failed, or need to verify a specific rule.
- **Tracked list:** Save opportunities you qualify for or need to verify.
- **Local Persistence:** Uses AsyncStorage. No backend, no account, absolute privacy.

## Architecture
- React Native / Expo SDK 57
- Expo Router
- Pure TypeScript Rules Engine
- Local `AsyncStorage` via React Context
- `react-native-reanimated` for reveals

## Data Provenance
The 30 starter opportunities are curated manually from publicly available notifications, FAQs, and official career portals (TCS, Infosys, Amazon, ISRO, GATE, etc.). Data is deterministic but should always be double-checked via the `official_url`.

## Running the App

### Expo Go (Physical Device)
Scan the QR code in Replit to open in Expo Go. The dev server uses `$REPLIT_EXPO_DEV_DOMAIN`.

### Web
Can also be previewed locally using the React Native Web build.

## Testing the Engine
```bash
npx tsx tests/engine.test.ts
```

## Current Limitations (Not in Day 1 Build)
- No RevenueCat / paywall
- No push notifications or system calendar sync
- UI for "Closed Doors" (permanently ineligible opportunities) is currently filtered out of the main view to focus on hope.
- The database is currently static (30 curated records) and not a live feed of 40-60 verified active links yet.
