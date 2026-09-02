# Hejiayi Barcarolle Pagination and Trailing Grace

Date: 2026-09-01

## Symptoms

- `hejiayi-barcarolle.jps` rendered score rows after `[fenye]` into the first-page SVG.
- Attached `[h3,]` after-note grace syntax was parsed as an invalid pitch and omitted its trailing connector geometry.
- The pre-break score rows had local 0.4-unit spacing transfers, one incorrectly split rest-to-note beam, and several final-coordinate rounding differences.

## Root Cause

- Pagination did not separate full-document feature discovery from first-page score-row emission.
- Grace parsing had no trailing direction marker or after-note glyph/clearance model.
- The paginated short-form `固定调` profile used row-level normalization without the event-local width ownership and rest-beam continuation used by the cached renderer.

## Fix

- Reused full-document parsing with first-page-only row rendering and paginated natural-width layout.
- Added trailing grace parsing, the local `yiyinxian_hou` glyph, trailing clearance, and the oracle-compatible after-note anchor.
- Added profile-scoped event-width transfers, row normalization, rest-to-note beam continuation, and deterministic coordinate normalization.

## Verification

- `pnpm run parity:translate hejiayi-barcarolle.jps` reports exact equality at 99114 bytes.
- `pnpm run verify:translate` reports 4 exact, 0 mismatched, and 0 missing caches.
- `pnpm run verify:songs` reports 38 checked, 35 exact, 3 mismatched, and 0 missing caches; only `swan.jps` and the two Turkish March fixtures remain mismatched.
- `Haydn-Serenade-AlternativeKey.jps`, `hejiayi-G-string-original.jps`, `tianyi.jps`, and `WaltzNo2.jps` remain byte-exact.
- `pnpm exec tsc --noEmit` passes.
- Cached/reference SVGs remain validation-only; runtime output continues to use the local translator.