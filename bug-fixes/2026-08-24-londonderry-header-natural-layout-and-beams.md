# Londonderry Header, Natural Layout, and Beam Parity

Date: 2026-08-24

## Symptoms

- `P: 2/4` songs referenced `shuzi_b_bian_2` without emitting its SVG definition.
- Free-text `J:` headers emitted a numeric tempo-note glyph that was absent from cached output.
- `Londonderry.jps` diverged in ordinary-row spacing around beamed rests, slur boundaries, dotted subdivisions, repeated figures, and closing bars.
- A melodic slur returning to its opening pitch was incorrectly muted as a tie.
- Duration beams split at ordinary rests and slur closures, while the oracle joined notes by beat and isolated dotted slash notes.

## Root Cause

- The local extra glyph registry did not contain the meter numeral `2`.
- Header layout reservation and numeric tempo rendering used the same truthy `J:` condition.
- Rich-layout compatibility reservations were also applied to ordinary natural-width rows.
- Tie detection compared only the opening and closing pitch, without tracking intervening pitch changes.
- Ordinary and rich rows shared beam split triggers even though their rest, slur, and dotted-subdivision behavior differs.

## Fix

- Added the exact locally owned `shuzi_b_bian_2` definition.
- Kept vertical space for any nonempty `J:` header but rendered `jiepaifu` only for numeric tempo values.
- Scoped rest, slur-end, pitch, octave, and closing-bar compatibility widths to the layout modes that require them.
- Added ordinary-row reservations for dotted subdivisions and their local visual groups.
- Tracked pitch changes within ordinary slurs so only uninterrupted same-pitch spans mute the closing note as ties.
- Kept ordinary beams joined across rests and slur closures, emitted dotted slash notes as singleton beams, and reset beat progress afterward.
- Kept cached oracle SVGs validation-only; runtime output continues to use the local renderer.

## Verification

- `Londonderry.jps` matches its cached oracle byte-for-byte at 50975 bytes.
- `baihualin.jps` remains byte-for-byte exact at 70841 bytes.
- `pnpm run verify:translate` reports 4 exact, 0 mismatched, and 0 missing caches.
- `pnpm run verify:songs` reports 3 exact, 35 mismatched, and 0 missing caches.
- `pnpm exec tsc --noEmit` completes without diagnostics.
