---
name: Expo testing setup and UI quirks
description: Constraints for unit tests in this Expo artifact under pnpm, and layout/product quirks that took more than one attempt.
---

**Jest under pnpm:** `jest-expo` does not work here (its transformIgnorePatterns miss pnpm's `.pnpm` paths) and `ts-jest` does not support the workspace TypeScript major. Plain `babel-jest` + `babel-preset-expo` in a node environment is the working combination. When jest globals are used, the artifact tsconfig needs an explicit `types` list or `typecheck` fails while jest passes.

**Clock-sensitive logic:** every engine, deadline and validation function takes an injectable `now`; tests must pin it. A stored deadline flips from open to passed on a calendar day boundary and changes output.

**Tab headers:** the classic `Tabs` fallback renders a native header, iOS 26 `NativeTabs` does not. Screens draw their own large titles, so the classic path must keep `headerShown: false` or web and Android show the title twice.

**Web deep links:** a full reload on a stacked screen has no history; back buttons must fall back to `router.replace` on the tabs route.

**Design subagent output to re-check:** blank numeric inputs silently defaulting to 0, boolean selectors defaulting to "no" when the profile is undefined, and summary copy that counts `unknown` records as matches. All three contradict the "never assume" product rule and were present in the first UI pass.
