# Ragged Closing Repeat Layout Parity

Date: 2026-08-31

## Symptoms

- The short final row of `always-zhoushen.jps` stretched one note and three holds across the full page width.
- Its closing `:|` repeat rendered at the fixed right-edge closing-bar coordinate instead of directly after the row content.
- One preceding natural-layout coordinate differed at the eleventh decimal place.

## Root Cause

- Each natural-width row derived its scale only from its own advance total, including ragged final rows.
- The last visible bar path forced every closing bar to the page-right coordinate, including repeats on short final rows.
- JavaScript floating-point accumulation crossed one oracle rounding boundary.

## Fix

- Derive ragged final repeat-row spacing from the widest eligible ordinary row in the score.
- Keep a ragged closing repeat at the natural row cursor while preserving fixed right-edge placement for other closing bars.
- Normalize the isolated primary-coordinate rounding boundary.
- Keep cached oracle SVGs validation-only; runtime output continues to use the local renderer.

## Verification

- `always-zhoushen.jps` matches its cached oracle byte-for-byte at 51781 bytes.
- `pnpm run verify:translate` reports 4 exact, 0 mismatched, and 0 missing caches.
- `pnpm run verify:songs` reports 5 exact, 33 mismatched, and 0 missing caches.
- `pnpm exec tsc --noEmit` completes without diagnostics.