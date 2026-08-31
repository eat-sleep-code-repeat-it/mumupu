# Londonderry Air Natural Layout and Rounding Parity

Date: 2026-08-31

## Symptoms

- `LondonderryAir.jps` diverged from its cached SVG at the first note of row three.
- Local output was three bytes shorter because row-three coordinates used a slightly smaller natural-layout scale.
- After correcting the scale, one beam still differed at the eleventh decimal place.

## Root Cause

- High-octave beat-boundary spacing reserved `0.4` units when a beamed phrase returned from an upper-octave note to the ordinary staff.
- Beam endpoints derived from an already normalized note coordinate did not share its oracle-compatible decimal normalization.

## Fix

- Reserve high-octave beat-boundary space only when the following note also remains above the ordinary staff.
- Normalize the corresponding beam endpoint coordinates at the same established floating-point boundary.
- Keep cached oracle SVGs validation-only; runtime output continues to use the local renderer.

## Verification

- `LondonderryAir.jps` matches its cached oracle byte-for-byte at 74906 bytes.
- `Londonderry.jps` remains byte-for-byte exact at 50962 bytes.
- `pnpm run verify:songs` reports 4 exact, 34 mismatched, and 0 missing caches.