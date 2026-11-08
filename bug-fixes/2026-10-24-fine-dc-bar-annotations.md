# Fine and D.C. Bar Annotations

Date: 2026-10-24

## Symptoms

- The documented `||&fine` and `||&dc` forms were tokenized as accidental note events instead of bar annotations.

## Root cause

- Bar suffix handling recognized only the existing `&hs` and `&ds` glyph markers.

## Fix

- Attach `&fine` and `&dc` to the preceding bar event.
- Render the corresponding `Fine` and `D.C.` labels beneath the bar without consuming score layout width.
- Add synthetic checks for event attachment, rendered labels, and avoiding bogus note events.

## Verification

- `corepack pnpm run verify:translate`: 4/4 primary fixtures match; the Fine/D.C. regression check passes.
- `corepack pnpm run verify:songs`: 38/38 song fixtures match.
- `corepack pnpm exec tsc --noEmit` passes.
- `corepack pnpm exec eslint lib/translate.ts scripts/verify-translate.mjs` reports no errors; two existing unused-variable warnings remain in `lib/translate.ts`.
- `git diff --check` passes.
