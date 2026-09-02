# Turkish March Articulations and Layout

Date: 2026-09-01

## Symptoms

- `tuerqi-jinxingqu-A.jps` and `tuerqi-jinxingqu.jps` emitted articulation markers in note codes but did not render their glyphs.
- Natural-width rows, low-octave dots, slurs, hairpins, and the split alternate-ending phrase differed from the cached SVGs.
- Both fixtures were the final song-cache mismatches.

## Root Cause

- The parser did not model legacy `&dy`, `&zy`, `&bc`, and `&hx` markers as articulations.
- Articulation-era scores use event-local width ownership and decoration clearance rules that were absent from the natural layout.
- A long alternate-ending slur uses one parent phrase split around an internal bar, while the local slur stack treated its second start as a nested phrase.

## Fix

- Parse and render the four articulation types with exact local glyphs, source-order code serialization, stacking, endpoint anchoring, and slur clearance.
- Added source-detected natural-width profiles for the two continuations, legacy low-dot and hairpin placement, and contextual coordinate normalization.
- Render the alternate-ending parent slur in two segments and suppress its duplicate nested start so subsequent slurs are emitted normally.

## Verification

- `pnpm run parity:translate tuerqi-jinxingqu-A.jps` reports exact equality at 151301 bytes.
- `pnpm run parity:translate tuerqi-jinxingqu.jps` reports exact equality at 150668 bytes.
- `pnpm run verify:translate` reports 4 exact, 0 mismatched, and 0 missing caches.
- `pnpm run verify:songs` reports 38 exact, 0 mismatched, and 0 missing caches.
- `pnpm exec tsc --noEmit` and `git diff --check` pass.
- Cached/reference SVGs remain validation-only; runtime output continues to use the local translator.