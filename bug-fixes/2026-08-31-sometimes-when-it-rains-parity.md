# Sometimes When It Rains Parity

Date: 2026-08-31

## Symptoms

- `sometime-when-it-rains.jps` differed in internal double-bar placement, tied-note audio, dense sixteenth spacing, and final-row scaling.
- Low-octave dots, ordinary slurs, annotations, and crescendo/diminuendo geometry also differed from the cached SVG.

## Root Cause

- Internal end bars were treated as row-closing bars, while tie audio did not retain enough group-origin context across rows.
- Dense sixteenth and adjacent high-octave slur transitions used generic width allowances.
- Decoration and expression clearance used row-wide or binary rules instead of measure, endpoint, phrase, and octave context.
- Moderately ragged final rows closing a carried phrase did not inherit the preceding row's scale.

## Fix

- Place only the actual row-closing end bar at the right edge and retain group opening rows for tie audio.
- Refine dense-sixteenth, adjacent-slur, and carried-phrase final-row spacing.
- Use measure-local accidental clearance for lower octave dots and endpoint octave clearance for short slurs.
- Apply phrase-aware annotation and hairpin offsets, including upper-octave clearance and unmatched close serialization.
- Normalize the remaining oracle coordinate rounding edges.

## Verification

- `sometime-when-it-rains.jps` is byte-exact against its 133976-byte cached oracle.
- `pnpm run verify:translate` reports 4 exact focused fixtures.
- `pnpm run verify:songs` reports 14 exact, 24 mismatched, and 0 missing caches.
- `pnpm exec tsc --noEmit` passes.