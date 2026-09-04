# Ganlanshu Accompaniment Brackets

Date: 2026-08-31

## Symptoms

- `ganlanshu.jps` rendered `&zkh` and `&ykh` as literal pitch suffixes instead of accompaniment brackets.
- Standalone `-&ykh` tokens became bogus notes, changing row widths and omitting hold events.
- A dangling `|[` failed to reserve alternate-ending vertical clearance or preserve its normalized bar code.
- After geometry matched, a small set of natural-width coordinates differed at the eleventh decimal place.

## Root Cause

- The token parser recognized dynamics after `&` but had no model for left and right accompaniment-bracket markers.
- Natural-width spacing did not reserve the bracket glyph's event and leading-bar clearance or transfer sharp-pair clearance within marked rows.
- Jump-house handling required an opening bracket and quoted label on the same score row.
- Shared coordinate formatters retained JavaScript rounding representations that differed from the oracle.

## Fix

- Parse `&zkh` and `&ykh` into event metadata, normalize their codes to `+zkh` and `+ykh`, and keep standalone marked dashes as holds.
- Add the oracle bracket glyphs and emit them at their owning event anchors in pitch-decoration order.
- Assign bracket and sharp-transition width reservations to their owning events and bars.
- Preserve unlabeled trailing opening brackets, reserve their 12-pixel row clearance, and normalize the remaining coordinates in the existing formatters.

## Verification

- `ganlanshu.jps` is byte-exact against its 127826-byte cached oracle.
- `ganlanshu-qiyu.jps` and `sometime-when-it-rains-FixedDoHK.jps` remain byte-exact.
- `pnpm run verify:translate` reports 4 exact focused fixtures.
- `pnpm exec tsc --noEmit` passes, and `lib/translate.ts` has no editor diagnostics.
- `pnpm run verify:songs` reports 20 exact, 18 mismatched, and 0 missing caches; it exits nonzero because the 18 known mismatches remain.