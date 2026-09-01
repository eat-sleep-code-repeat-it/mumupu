# Yinjie Mojin Daokou Parity

Date: 2026-08-31

## Symptoms

- `yinjie-mojin-daokou.jps` differed from its cached oracle across annotated exercise rows, dense triplets, mixed-duration tuplets, and the closing repeat row.
- Notes, beams, octave dots, grouped slurs, and annotations also retained small coordinate and serialization differences after the row geometry matched.

## Root Cause

- Annotated FixedDo rows inherited high-octave beat expansion intended for plain rows.
- Tuplet timing discarded written duration ratios, and dense grouped rows used spacing and cursor advancement rules intended for shorter groups.
- Mixed tuplets extended beams through unslashed notes and applied beam clearance to their low-octave dots.
- The closing repeat row was normalized as a materially ragged row even though its natural width was already sufficient.
- Deferred and grouped pitch decorations were emitted in separate buckets instead of score order, and several formatter paths rounded recurring coordinates differently from the oracle.

## Fix

- Preserve written duration ratios inside tuplets and use dense-triplet spacing that accounts for internal bars and trailing rests.
- Restrict annotated-row beat expansion, advance grouped cursors across bars, and scale only materially short closing-repeat rows.
- End mixed-tuplet beams at the last slashed note and apply low-dot beam clearance only to slashed notes.
- Record pitch decorations in event traversal order while preserving glyph-definition discovery order.
- Normalize the remaining primary, beam, slur, and annotation coordinate representations in their owning formatters.

## Verification

- `yinjie-mojin-daokou.jps` is byte-exact against its 212544-byte cached oracle.
- Both checked FixedDo guards remain byte-exact.
- `pnpm run verify:translate` reports 4 exact focused fixtures, and `pnpm exec tsc --noEmit` passes.
- `pnpm run verify:songs` reports 18 exact, 20 mismatched, and 0 missing caches; it exits nonzero because the 20 known mismatches remain.
- `lib/translate.ts` has no editor diagnostics.