# Song Repeat, Multi-Lyric, and Natural Layout Parity

Date: 2026-08-22

## Symptoms

- Song fixtures with `D: E`, `D: F`, or `D: G` diverged in the SVG definition block before notation rendering began.
- `|:` and `:|` repeat bars were split or ignored instead of producing repeat glyphs.
- Only the first `C:` line after a score row rendered, so lyric elements and following row positions diverged.
- Ordinary rows emitted pitch decorations in the wrong layer and used uniform spacing for dotted and subdivided notes.
- `baihualin.jps` had matching semantic elements after parser fixes but still differed in natural-width coordinates and decimal serialization.

## Root Cause

- The local glyph set lacked the F key signature, sharp accidental, and repeat-bar definitions required by this song cluster.
- Tokenization and event parsing did not treat repeat delimiters as atomic bar forms.
- Score rendering collected one lyric line instead of all consecutive lyric lines belonging to the row.
- Natural-width spacing was limited to the existing rich-layout fixture and included compatibility reservations that were too broad for ordinary song rows.
- JavaScript floating-point accumulation crossed a few oracle rounding boundaries by one unit in the eleventh decimal place.

## Fix

- Added locally owned E, F, and G key, sharp accidental, and left/right repeat glyph definitions.
- Parsed and rendered `|:` and `:|` as repeat bars.
- Collected all consecutive `C:` lines, rendered each lyric row, and reserved matching vertical space.
- Deferred ordinary-row pitch decorations to the oracle-compatible layer and enabled natural widths only for rows that require them.
- Split established rich-row beat spacing from ordinary song spacing, reserving ordinary width for actual octave and accidental clearance.
- Matched significant-digit lyric formatting and normalized isolated floating-point boundaries through the existing coordinate compatibility maps.
- Kept cached oracle SVGs validation-only; runtime output continues to use the local renderer.

## Verification

- `baihualin.jps` matches its cached oracle byte-for-byte at 70841 bytes.
- All seven E/G-key fixtures that previously diverged at byte 601 now advance beyond the SVG definition block.
- `pnpm run verify:translate` reports 4 exact, 0 mismatched, and 0 missing caches.
- `pnpm run verify:songs` reports 2 exact, 36 mismatched, and 0 missing caches.
- `pnpm exec tsc --noEmit` completes without diagnostics.
