# Keketuohai Mixed-Duration Parity

Date: 2026-08-31

## Symptoms

- `047-keketuodemuyangren.jps` differed in natural spacing, dotted-note duration metadata, alternate-ending events, final-row layout, beam grouping, and low-octave decoration placement.
- Tokens such as `5.,` and `5.,/` emitted incorrect durations because octave commas followed duration dots.

## Root Cause

- Duration parsing only recognized a trailing duration suffix and did not separate interleaved duration and octave characters.
- Same-pitch sixteenth ties, terminal dotted subdivisions, and mixed dotted runs used incompatible generic spacing allowances.
- Adjacent alternate endings written as `|]["B"` emitted standalone bracket events instead of one closing-and-opening bar.
- Short final double-bar rows were stretched, and dotted-eighth/sixteenth pairs were split into separate primary beams.

## Fix

- Parse duration and pitch-tail characters independently while preserving source-order event codes.
- Refine same-pitch tie, terminal dotted, and low dotted mixed-run spacing without changing sharp slur closes.
- Fold adjacent and trailing jump-house brackets into their bar events and close the old house before opening the new one.
- Inherit the preceding row scale for genuinely short final double-bar rows and place their final bars naturally.
- Join dotted-eighth/sixteenth pairs with oracle-matching primary and secondary beams.
- Lower low-octave sixteenth dots in accidental-free rows and normalize remaining coordinate edges.

## Verification

- `047-keketuodemuyangren.jps` is byte-exact against its 123515-byte cached oracle.
- Both G String alternative-key fixtures, Memory Cats, and Londonderry remain byte-exact.
- `pnpm run verify:translate` reports 4 exact focused fixtures.
- `pnpm run verify:songs` reports 12 exact, 26 mismatched, and 0 missing caches.
- `pnpm exec tsc --noEmit` passes.