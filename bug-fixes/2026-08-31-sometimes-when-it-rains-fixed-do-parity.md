# Sometimes When It Rains FixedDo Parity

Date: 2026-08-31

## Symptoms

- `sometime-when-it-rains-FixedDo.jps` differed from its cached oracle in natural-width spacing, low-octave decoration positions, and SVG coordinate rounding.
- Sharp-slur transitions and a beat-aligned slur before a double bar shifted all later elements in their rows.

## Root Cause

- FixedDo accidental clearance was shared across some closed slurs and omitted for specific low-register sharp-slur transitions.
- The generic beat-boundary increment expanded an eighth-note slur resolution immediately before a double bar.
- Stacked low-octave dots used an 8px step instead of the FixedDo oracle's 6px step, and low sixteenth dots could lose beam clearance when another note in the measure had an accidental.
- Binary floating-point serialization left a small set of coordinates one unit off at the eleventh decimal place.

## Fix

- Scope sharp-slur clearance ownership by FixedDo mode, expression context, slur closure, register, and neighboring note structure.
- Suppress beat-boundary expansion for FixedDo eighth-note slur resolutions directly before a double bar.
- Use FixedDo-specific low-octave dot spacing and preserve low-sixteenth beam clearance.
- Normalize the remaining measured SVG coordinate rounding edges consistently across notes, duration lines, and slurs.

## Verification

- `sometime-when-it-rains-FixedDo.jps` is byte-exact against its 147954-byte cached oracle.
- `sometime-when-it-rains-FixedDoH.jps` remains byte-exact at 139341 bytes.
- `pnpm run verify:translate` reports 4 exact focused fixtures.
- `pnpm run verify:songs` reports 16 exact, 22 mismatched, and 0 missing caches; it exits nonzero because the 22 known mismatches remain.
- `pnpm exec tsc --noEmit` passes, and `lib/translate.ts` has no editor diagnostics.
