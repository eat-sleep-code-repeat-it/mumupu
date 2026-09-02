# Muge Quintuplets and Mezzo Piano

Date: 2026-09-01

## Symptoms

- `muge.jps` lacked the quintuplet label and secondary beam, and its quintuplet note times were serialized as generic fractions instead of `0.20`.
- Rows containing `mp`, mixed sixteenth-note beams, low-octave dots, and nested slurs differed in spacing, grouping, or decoration geometry.
- The final SVG had matching musical content but retained small floating-point differences in several slur paths.

## Root Cause

- Group rendering supported labels only through four notes and did not track enough slash-depth information for quintuplet beams.
- Muge uses a legacy natural-width spacing and beam profile that was not represented by the existing renderer profiles.
- Slur deferral assumed an open parent would eventually close, which swallowed a completed child slur when its parent was orphaned.
- Low sixteenth notes used the generic clearance and stacked-dot step, and calculated path coordinates needed deterministic serialization.

## Fix

- Added exact `lianyin_shuzi_5` and `lidu_mp` glyph definitions, five-note group labels, slash-depth beams, and quintuplet `0.20` timing metadata.
- Added a narrowly gated mezzo-piano profile for Muge's natural-width transfers, pairwise and measure-aware beams, slur flush behavior, and low-octave dot geometry.
- In the mezzo-piano profile, deferred nested child slurs only when the parent closes later, preserving legacy ordering for other fixtures.
- Normalized the remaining slur coordinates in their owning SVG formatters.

## Verification

- `pnpm run parity:translate muge.jps` reports exact equality at 143101 bytes.
- `pnpm run verify:translate` reports 4 exact, 0 mismatched, and 0 missing caches.
- Oracle-cache SVGs remain validation-only; runtime rendering still uses the local translator.
