# Example 001 Bar and Lyric Parity

Date: 2026-08-19

## Symptoms

- `example-001-paipaizuo.jps` still differed from the external oracle even after earlier layout fixes.
- The remaining mismatches showed up as stretched first-row spacing, shifted internal bars, lyric `cipos` metadata drift, float-string coordinate noise, and a missing wrapper tail element.

## Root Cause

- The renderer treated the first visible measure bar in a row as a row-leading bar even when notes had already appeared.
- Visible internal and row-closing bar glyphs were placed with local coordinates that did not match the oracle.
- Lyric `cipos` used a separate lyric counter instead of the active note `notepos`.
- Dynamic coordinate output used raw floating-point strings and low-precision decimal constants.
- The SVG wrapper tail omitted the oracle's empty `custom` group.

## Fix

- Updated `renderJpsToSvg` in `lib/translate.ts` so a visible bar is only treated as row-leading when it is preceded only by leading markers.
- Matched oracle bar placement for internal bars and row-closing bars.
- Switched lyric `cipos` to use the current note event's `notepos`.
- Normalized dynamic SVG coordinate output and replaced key layout decimals with exact fractional constants.
- Added `<g id="custom"></g>` before the closing `</svg>` tag.

## Verification

- `pnpm run parity:translate example-001-paipaizuo.jps`
- `pnpm exec tsc --noEmit`
- `pnpm exec next build`
