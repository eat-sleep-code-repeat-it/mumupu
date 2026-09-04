# Swan Compact Prose and Expression Order

Date: 2026-09-01

## Symptoms

- `swan.jps` rendered each compact `-"..."` prose row as a fake pitch and omitted its short tail bar.
- The emitted `rit` use referenced a missing local glyph definition.
- The `atempo` annotation, attached `pp`, jump-house geometry, and hairpins were serialized in a different order from the cached SVG.

## Root Cause

- Compact quoted prose tokens fell through generic pitch parsing instead of producing an annotated hold and `|w` tail event.
- The extra local glyph library had no `xiaojiexian_weibu` or `lidu_rit` vectors.
- Scores with compact prose tails were not included in the renderer's legacy annotation/expression ordering profile.

## Fix

- Parse compact prose rows as a hold plus synthetic tail bar, preserving their legacy underscore text normalization.
- Added exact local tail-bar and ritardando glyph definitions and compact three-event row positioning.
- Emit a shared note's annotation before its dynamic and serialize jump-house geometry before hairpins for compact-prose scores.

## Verification

- `pnpm run parity:translate swan.jps` reports exact equality at 88902 bytes.
- `pnpm run verify:translate` reports 4 exact, 0 mismatched, and 0 missing caches.
- `pnpm run verify:songs` reports 38 checked, 36 exact, 2 mismatched, and 0 missing caches; only the two Turkish March fixtures remain mismatched.
- All three Hejiayi Swan-family fixtures and `hejiayi-barcarolle.jps` remain byte-exact.
- `pnpm exec tsc --noEmit` passes.
- Cached/reference SVGs remain validation-only; runtime output continues to use the local translator.