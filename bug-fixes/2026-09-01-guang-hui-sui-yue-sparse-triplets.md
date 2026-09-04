# Guang Hui Sui Yue Sparse Triplets

Date: 2026-09-01

## Symptoms

- `guang-hui-sui-yue.jps` matched its cached SVG through row two, then rows containing one triplet reset grouped notes toward the left margin.
- Dotted-note measures with a low-register sixteenth pair placed the second sixteenth and its beams one natural-width unit too far right.
- Definition order and a few tuple/beam coordinates differed despite matching element counts.

## Root Cause

- Any grouped note selected the dense grouped-row layout, even when a row mixed one triplet with ordinary notes.
- Low-dotted mixed spacing assigned beat-boundary clearance to the first note of a sixteenth pair instead of the second.
- Sparse tuple decorations were emitted inline, changing glyph discovery order, and several calculated coordinates required deterministic serialization.

## Fix

- Added a sparse mixed-group row mode for rows with at most two groups and ordinary notes, while retaining the existing dense grouped profile.
- Reused natural widths and deferred pitch decorations for sparse mixed rows, with one-third width clearance per triplet member.
- Transferred low-dotted pair clearance to the beat-closing second sixteenth.
- Normalized the remaining primary, beam, and tuple control coordinates in their owning formatters.

## Verification

- `pnpm run parity:translate guang-hui-sui-yue.jps` reports exact equality at 89773 bytes.
- `yidongdexin.jps` and dense-grouped `yinjie-mojin-daokou.jps` remain byte-exact.
- `pnpm run verify:translate` reports 4 exact, 0 mismatched, and 0 missing caches.
- `pnpm run verify:songs` reports 38 checked, 31 exact, 7 mismatched, and 0 missing caches.
- `pnpm exec tsc --noEmit` passes.