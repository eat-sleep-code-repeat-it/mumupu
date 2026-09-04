# Waltz No. 2 Paginated Layout

Date: 2026-09-01

## Symptoms

- `WaltzNo2.jps` rendered all 20 score rows even though its cached SVG contained only the 13 rows before `[fenye]`.
- After limiting output to the first page, ordinary rows and two mixed eighth-note rows still used the wrong horizontal layout.
- Three final bar and hold coordinates differed only in floating-point serialization.

## Root Cause

- The parser ignored `[fenye]`, so rows from the second page were appended to the single-page SVG.
- Paginated scores did not select the reference renderer's natural-width row layout.
- Two repeated `2/ 1/ 2/` valleys and one `7/ 6/ 7/` valley retained compatibility clearance that the Waltz layout does not use.

## Fix

- Parse the complete document for notation and layout feature discovery, but render only `Q:` rows before the first `[fenye]` marker.
- Select natural-width layout for paginated documents.
- Added a narrowly scoped Waltz profile that removes the three legacy 0.4-unit clearances from their owning event advances.
- Normalized the remaining natural-primary coordinates deterministically.

## Verification

- `pnpm run parity:translate WaltzNo2.jps` reports exact equality at 100195 bytes.
- `pnpm run verify:translate` reports 4 exact, 0 mismatched, and 0 missing caches.
- `pnpm run verify:songs` reports 38 checked, 33 exact, 5 mismatched, and 0 missing caches.
- `pnpm exec tsc --noEmit` passes.
- Oracle-cache SVGs remain validation-only; runtime output continues to use the local translator.
