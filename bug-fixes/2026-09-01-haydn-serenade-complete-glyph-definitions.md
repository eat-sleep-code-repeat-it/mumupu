# Haydn Serenade Grace-Note Parity

Date: 2026-09-01

## Symptoms

- Attached bracket notes were parsed as timed jump-house content instead of front grace notes.
- Dynamic marks were emitted as text, beam groups split at slur boundaries, and grace clearance scaled with note spacing.
- Natural-restoration ties, low-octave sixteenth dots, and several SVG coordinates differed from the cached reference.
- Four grace/dynamic glyph definitions still used provisional geometry.
- The original-key companion retained surplus quote delimiters in note metadata and duplicated low-slur clearance on annotated rows.

## Root Cause

- The event model had no attached grace-note metadata, and natural-width layout treated grace clearance as a scaled advance.
- Rich-layout beam and tie heuristics did not account for grace-score rhythmic grouping or octave-crossing sharp-to-natural slurs.
- `yiyin_bianyinfu_sheng`, `lidu_p`, `lidu_mf`, and `lidu_pp` did not contain the complete local paths used by the reference SVG.
- Inline annotation parsing preserved trailing quote delimiters, and dynamics and annotations were collected into separate layers instead of score encounter order.

## Fix

- Parse attached bracket notes into grace metadata without consuming timing or note positions, and render generated `qy*` composites.
- Reserve grace clearance as fixed pixels, preserve beat-based beam groups across slurs, and render dynamics with local glyphs.
- Correct accidental-restoration audio, octave-dot clearance, natural widths, and fixture-compatible coordinate serialization.
- Replace the four provisional glyph definitions with exact local static paths; cached oracle output remains validation-only.
- Strip surplus inline annotation delimiters, avoid duplicate annotated-row clearance, and preserve encounter order across dynamic and annotation markings.

## Verification

- `pnpm run parity:translate Haydn-Serenade-AlternativeKey.jps` reports exact equality at 117843 bytes.
- `pnpm run parity:translate Haydn-Serenade-Original.jps` reports exact equality at 118253 bytes.
- `pnpm run parity:translate memory-from-cats.jps` and `pnpm run parity:translate ren-jian-gong-ming-bB.jps` remain exact.
- `pnpm exec tsc --noEmit` passes.
- `pnpm run verify:songs` reports 25 exact, 13 mismatched, and 0 missing caches.