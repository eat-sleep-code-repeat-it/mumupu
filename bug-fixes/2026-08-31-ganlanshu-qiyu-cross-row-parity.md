# Ganlanshu Qiyu Cross-Row Parity

Date: 2026-08-31

## Symptoms

- `ganlanshu-qiyu.jps` differed in leading double-bar parsing, alternate-ending codes, lyric alignment, natural spacing, and cross-row slurs.
- Empty lyric placeholders and slash-marked ending brackets also differed from the cached SVG.

## Root Cause

- Leading `||` was only collapsed at line ends, and bar glyph selection ignored attached ending labels.
- Lyric skips did not consume notes, open groups and slurs were reset between melody rows, and exhausted lyric rows omitted oracle placeholders.
- Several dotted, sixteenth, accidental, and ending transitions assigned natural width to the wrong event.

## Fix

- Parse double bars at any position, preserve bar suffixes, and select repeat/end glyphs from semantic code prefixes.
- Align lyric markers one unit per note, render exhausted-row placeholders, and preserve ASCII punctuation placement.
- Carry parser groups and rendered ordinary slurs across rows, including cross-row cap geometry.
- Refine natural-width ownership for ending, accidental, dotted-turn, repeated dotted-pair, and sixteenth-slur transitions.
- Leave slash-marked alternate endings open on the right and normalize final coordinate edges.

## Verification

- `ganlanshu-qiyu.jps` is byte-exact against its 96631-byte cached oracle.
- `Londonderry.jps` remains byte-exact at 50962 bytes.
- `pnpm run verify:translate` reports 4 exact focused fixtures.
- `pnpm run verify:songs` reports 13 exact, 25 mismatched, and 0 missing caches.
- `pnpm exec tsc --noEmit` passes with no editor diagnostics.