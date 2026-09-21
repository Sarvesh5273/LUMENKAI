---
name: Expo testing setup and UI quirks
description: Constraints for unit tests in this Expo artifact under pnpm, and layout/product quirks that took more than one attempt.
---

**Jest under pnpm:** `jest-expo` does not work here (its transformIgnorePatterns miss pnpm's `.pnpm` paths) and `ts-jest` does not support the workspace TypeScript major. Plain `babel-jest` + `babel-preset-expo` in a node environment is the working combination. When jest globals are used, the artifact tsconfig needs an explicit `types` list or `typecheck` fails while jest passes.

**Clock-sensitive logic:** every engine, deadline and validation function takes an injectable `now`; tests must pin it. A stored deadline flips from open to passed on a calendar day boundary and changes output.

**Tab headers:** the classic `Tabs` fallback renders a native header, iOS 26 `NativeTabs` does not. Screens draw their own large titles, so the classic path must keep `headerShown: false` or web and Android show the title twice.

**Web deep links:** a full reload on a stacked screen has no history; back buttons must fall back to `router.replace` on the tabs route.

**Design subagent output to re-check:** blank numeric inputs silently defaulting to 0, boolean selectors defaulting to "no" when the profile is undefined, and summary copy that counts `unknown` records as matches. All three contradict the "never assume" product rule and were present in the first UI pass.

**Typed routes lag:** expo-router's route types live in `.expo/types/router.d.ts` and are regenerated only by the running dev server. After adding a screen file, restart the Expo workflow before `typecheck`, or the new path is rejected as not assignable.

**Scripts over the data files:** Node's built-in type stripping cannot execute the data TS files (extensionless relative imports, type-only imports). Use `tsx` (artifact devDependency, `pnpm export-data`) for anything that needs to load `data/index.ts` outside jest.

**Web share:** `Share.share` on web is not reliable; check `navigator.share` first and fall back to `navigator.clipboard.writeText` with a visible "Copied" note. The testing subagent confirmed the clipboard path fires in headless Chromium.
