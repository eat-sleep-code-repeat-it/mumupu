# Moving Heart Special Bars and Mixed Tuplets

Date: 2026-09-01

## Symptoms

- `yidongdexin.jps` parsed `&hs` and `&ds` special-bar markers as notes and split a decorated double ending bar into separate events.
- Rows containing one triplet suppressed ordinary beams and trapped later ordinary slurs behind an unmatched tuplet parenthesis.
- Mixed tuplet rows, special-bar glyphs, ornament layering, jump houses, and decimal serialization differed from the cached SVG.

## Root Cause

- Special-bar suffixes had no bar-owned parser representation.
- Grouped-note handling was selected per row instead of per event, so unrelated notes bypassed ordinary beam logic and tuplet parentheses entered the ordinary slur stack.
- The fixed grouped spacing profile did not support rows mixing tuplets with ordinary rhythmic notation and lyrics.
- The local glyph registry lacked the `xiaojiexian_hs` and `xiaojiexian_ds` definitions.

## Fix

- Attached `&hs` and `&ds` to their preceding bars, preserved decorated bar codes, and absorbed decorated double bars as one ending event.
- Excluded tuplet-owned parentheses from ordinary slur depth and restored ordinary beam processing for non-tuplet notes on mixed rows.
- Used natural widths with one-third triplet clearance for special-bar mixed rows and added the score's phased subdivision-width behavior.
- Matched tuple geometry, upper-mordent clearance, pitch-decoration and jump-house layering, exact number serialization, and local special-bar glyph definitions.

## Verification

- `pnpm run parity:translate yidongdexin.jps` reports exact equality at 115494 bytes.
- The rendered body contains the oracle's 107 beams, 32 slur paths, 379 glyph uses, and 140 text elements.
- `pnpm run verify:translate` reports 4 exact, 0 mismatched, and 0 missing caches.
- `pnpm run verify:songs` reports 38 checked, 30 exact, 8 mismatched, and 0 missing caches.
- `sometime-when-it-rains.jps`, `yinjie-mojin-daokou.jps`, `xiyangyang.jps`, and both Dream fixtures remain byte-exact.
- `pnpm exec tsc --noEmit`, VS Code diagnostics, and `git diff --check` pass.