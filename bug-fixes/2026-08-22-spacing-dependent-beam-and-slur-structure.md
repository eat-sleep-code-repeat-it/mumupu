# Spacing-Dependent Beam and Slur Structure

Date: 2026-08-22

## Symptoms

- `memory-from-cats.jps` emitted 116 duration beams while the cached oracle emitted 121.
- One ordinary slur was omitted because local spacing placed its endpoints in a different structural case.
- Dotted-duration rows grouped beams by consecutive slash duration instead of absolute measure beats.

## Root Cause

- Mixed-row beam accumulation reset around non-slash events without preserving absolute progress through the measure.
- Rests, ordinary-slur endings, short accidental tails, and measure endings did not consistently split or begin beam groups.
- Isolated eighth-note spacing was not reserved alongside those beam breaks.

## Fix

- Added measure-aware beam grouping for sparse dotted-duration rows while preserving the established grouping path for ordinary dense rows.
- Split beams at rests, ordinary-slur endings, short accidental tails, and measure endings where required by the notation context.
- Reserved matching natural width for isolated off-beat eighth notes.

## Verification

- `memory-from-cats.jps` now emits 121 duration beams and 89 ordinary slur paths, matching the cached oracle element counts.
- Beam source-position ranges match the cached oracle across all rows.
- `pnpm run parity:translate example-001-paipaizuo.jps` remains byte-for-byte exact.
- `pnpm run parity:translate example-002-sandumojin.jps` remains byte-for-byte exact.
- `pnpm exec tsc --noEmit` completes without diagnostics.
- Overall `memory-from-cats.jps` byte parity remains open because natural-width coordinates and SVG ordering still differ.
