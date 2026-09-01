# Sometimes When It Rains FixedDoH Parity

Date: 2026-08-31

## Symptoms

- `sometime-when-it-rains-FixedDoH.jps` differed in natural-width spacing, tie audio, decoration coordinates, and ordinary slur control points.
- Adjacent and cross-row sharp slurs assigned clearance to the wrong event, changing every later coordinate in affected rows.

## Root Cause

- Signed cross-row slur depth was also used as row-local state, so carried closures could hide later local slurs.
- Sharp-to-unmarked tie decisions lacked group-origin octave and accidental context.
- FixedDo primary notes and deferred decorations did not share the oracle's coordinate serialization behavior.
- FixedDo-specific sharp-clearance transfers leaked into movable-do fixtures until they were scoped by rendering mode and closure shape.

## Fix

- Track nonnegative row-local slur depth separately and apply FixedDo clearance suppression only while a slur remains active or an ascending closure owns the transition.
- Retain group-origin pitch, octave, accidental, and source row when resolving tie audio.
- Scope FixedDo sharp-slur spacing transfers without changing established movable-do layouts.
- Serialize FixedDo note anchors and deferred pitch decorations consistently, and normalize the remaining SVG rounding edges.

## Verification

- `sometime-when-it-rains-FixedDoH.jps` is byte-exact against its 139341-byte cached oracle.
- `pnpm run verify:translate` reports 4 exact focused fixtures.
- `pnpm run verify:songs` reports 15 exact, 23 mismatched, and 0 missing caches.
- `pnpm exec tsc --noEmit` passes, and `lib/translate.ts` has no editor diagnostics.