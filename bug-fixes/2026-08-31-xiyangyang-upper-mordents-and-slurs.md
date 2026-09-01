# Xiyangyang Upper Mordents and Slurs

Date: 2026-08-31

## Symptoms

- `xiyangyang.jps` omitted upper-mordent glyphs for `&sby` and treated compact text such as `2'/&sby1'/` as one malformed note.
- Left accompaniment-bracket clearance was assigned immediately after a short marked note instead of at the containing beat boundary.
- Repeated cross-bar slur rows used incorrect dotted-opener, accidental, internal-bar, closing-note, and cap-height clearance.
- Matching geometry retained several eleventh-decimal coordinate differences.

## Root Cause

- The tokenizer and event model had no upper-mordent marker support.
- Accompaniment-bracket spacing assumed marked events were whole beats.
- Natural-width and long-cap rules did not distinguish ornamented repeated cross-bar slurs or whether a particular slur contained the ornament.
- Shared coordinate formatters retained JavaScript rounding representations that differed from the oracle.

## Fix

- Split compact notation after `&sby`, normalize it to `+sby`, and render the oracle `boyinfu_shang1` glyph at the owning note and octave height.
- Defer left-bracket post-clearance to the end of its beat while preserving right-bracket ownership.
- Track repeated cross-bar slurs and per-slur ornament presence to assign note, bar, and cap clearance locally without changing lyric-bearing or marker-free slurs.
- Order octave decorations before note-level accompaniment brackets and normalize the remaining coordinates in existing formatters.

## Verification

- `xiyangyang.jps` is byte-exact against its 106014-byte cached oracle.
- `ganlanshu.jps`, `sometime-when-it-rains.jps`, and `Londonderry-hanshan.jps` remain byte-exact.
- `pnpm run verify:translate` reports 4 exact focused fixtures.
- `pnpm exec tsc --noEmit` passes, and `lib/translate.ts` has no editor diagnostics.
- `pnpm run verify:songs` reports 21 exact, 17 mismatched, and 0 missing caches; it exits nonzero because the 17 known mismatches remain.