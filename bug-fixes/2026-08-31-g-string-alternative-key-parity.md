# G String Alternative-Key Parity

Date: 2026-08-31

## Symptoms

- `hejiayi-G-string-alternativeKeys.jps` differed from its cached oracle in row spacing, sharp-clearance ownership, expression tokens, octave dots, hairpins, and coordinate serialization.
- Prefix hairpin endings such as `!-` rendered as pitched notes instead of closing the previous note and emitting a hold.

## Root Cause

- Expression clearance was applied to every score row instead of only rows containing expression marks.
- Sharp chains require duration-, octave-, slur-, and expression-aware spacing rules that differ from flat chains.
- Hairpin rendering only closed on notes, used one vertical offset, and emitted before detached annotations.

## Fix

- Apply expression vertical clearance per score row and preserve prefix and suffix hold-ending semantics.
- Allocate sharp clearance according to accidental direction, duration, octave, slur ownership, and neighboring opener/close shape.
- Render hairpin endings on notes and holds with oracle-matching offsets and output order.
- Lower octave dots for low sharp sixteenths and preserve oracle coordinate rounding at known edge values.

## Verification

- `hejiayi-G-string-alternativeKeys.jps` is byte-exact at 95012 bytes.
- `hejiayi-G-string-original.jps`, both exact Swan Lake fixtures, and `hejiayi-swan-shengsan.jps` remain byte-exact.
- `pnpm run verify:translate` reports 4 exact focused fixtures.
- `pnpm run verify:songs` reports 10 exact, 28 mismatched, and 0 missing caches.
- `pnpm exec tsc --noEmit` passes.