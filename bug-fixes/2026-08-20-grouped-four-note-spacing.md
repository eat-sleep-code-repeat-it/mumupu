# Grouped Four-Note Spacing

Date: 2026-08-20

## Symptoms

- Four-note grouped rows in `example-002-sandumojin.jps` still drifted horizontally from the cached oracle layout.
- Three-note tuplet rows were closer, but four-note tuplets were visibly too compressed.

## Root Cause

- The grouped row spacing branch in `lib/translate.ts` used an incorrect hard-coded step for four-note tuplets.
- That made every x-position in those rows accumulate error even when the group metadata and slur formulas were otherwise correct.

## Fix

- Replaced the four-note grouped spacing constant with the oracle-derived step used by the cached reference geometry.

## Verification

- `pnpm exec tsc --noEmit`
- `pnpm run parity:translate example-002-sandumojin.jps` still reports overall inequality, but the remaining mismatch is in other grouped-decoration/layout details rather than the corrected four-note spacing constant.