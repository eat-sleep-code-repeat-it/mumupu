# Hongyan Compact Grace and Accompaniment Parity

Date: 2026-09-01

## Symptoms

- `hongyan.jps` rendered each note in `[1/2/1/]` as a separate grace composite instead of one three-note composite.
- A colon after the quoted `B-I-II-降A调` jump-house label became a stray score event and shifted subsequent event positions.
- The accompaniment continuation row had different natural spacing and joined two low eighth-note beams that the cached SVG rendered separately.

## Root Cause

- Generated grace rendering assumed every parsed grace note owned an independent glyph and fixed clearance.
- The parser handled repeat-bar colons but not a colon following a quoted jump-house label.
- Accompaniment spacing and beam grouping lacked the repeated low-eighth to dotted-eighth transition used by this score.

## Fix

- Rendered bracketed multi-note grace groups as one generated composite, added local grace digit glyphs `1` and `2`, reserved per-note fixed clearance, and anchored the composite by its full width.
- Attached a post-label colon to its owning jump-house bar event.
- Added accompaniment clearance and isolated-beam handling for the repeated low-eighth transition, plus scoped coordinate serialization for combined grace/accompaniment layouts.

## Verification

- `pnpm run parity:translate hongyan.jps`
- `pnpm run verify:translate`
- `pnpm run verify:songs`
- `pnpm exec tsc --noEmit`