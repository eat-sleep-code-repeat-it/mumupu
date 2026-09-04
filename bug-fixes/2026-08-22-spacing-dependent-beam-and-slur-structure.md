# Spacing-Dependent Beam and Slur Structure

Date: 2026-08-22

## Symptoms

- `memory-from-cats.jps` emitted 116 duration beams while the cached oracle emitted 121.
- One ordinary slur was omitted because local spacing placed its endpoints in a different structural case.
- Dotted-duration rows grouped beams by consecutive slash duration instead of absolute measure beats.
- After structural parity, note metadata, decoration layering, and decimal serialization still prevented byte equality.

## Root Cause

- Mixed-row beam accumulation reset around non-slash events without preserving absolute progress through the measure.
- Rests, ordinary-slur endings, short accidental tails, and measure endings did not consistently split or begin beam groups.
- Isolated eighth-note spacing was not reserved alongside those beam breaks.
- Ordinary `(/` syntax assigned duration and slur metadata in the wrong direction, and tie audio retained accidental spelling or sounded repeated closing notes.
- Natural-layout decorations were emitted inline instead of in oracle layer order; lower-octave placement and long-tie classification also lacked notation context.

## Fix

- Added measure-aware beam grouping for sparse dotted-duration rows while preserving the established grouping path for ordinary dense rows.
- Split beams at rests, ordinary-slur endings, short accidental tails, and measure endings where required by the notation context.
- Reserved matching natural width for isolated off-beat eighth notes.
- Matched natural-width event positions, ordinary slur and long-tie rendering, playback metadata, decoration layers, glyph ordering, annotations, and SVG number formatting.
- Kept cached oracle SVGs validation-only; application output continues to come from the local `translate()` implementation.

## Verification

- `memory-from-cats.jps` matches its cached oracle byte-for-byte at 173024 bytes, including 121 duration beams and 89 slur paths.
- `pnpm run parity:translate example-001-paipaizuo.jps` remains byte-for-byte exact.
- `pnpm run parity:translate example-002-sandumojin.jps` remains byte-for-byte exact.
- `pnpm run verify:translate` reports 4 exact, 0 mismatched, and 0 missing caches.
- `pnpm exec tsc --noEmit` completes without diagnostics.
