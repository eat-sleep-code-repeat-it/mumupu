# Custom Beat Controls

Date: 2026-09-02

## Symptoms

- Notes marked with `~` still ended at automatic beat boundaries.
- Notes marked with `^` remained connected to the following beam group.
- `abc-examples.jps` rendered its first measure as three automatic two-note beams and did not isolate the marked opening sixteenth in its second measure.

## Root Cause

- The parser preserved `~` and `^` only as incidental characters in note codes.
- Beam construction had no event-level override for extending a group or forcing its end.
- Mixed-duration custom rows fell into full-width natural layout instead of the oracle's compact grid.
- Blank `D:` headers and legacy XML serialization were not reproduced for this score profile.

## Fix

- Parse `~` and `^` into explicit `beatJoinAfter` and `beatSplitAfter` note-event controls while preserving source codes.
- Extend a compact beam through the first unmarked slash note after `~`, and flush primary and secondary beams after `^`.
- Use the oracle's 25-unit note grid, compact bar spacing, pair-based default groups, and secondary-beam stubs for marker rows.
- Render the key-signature prefix when a blank `D:` header is present and use legacy expanded-element/CRLF SVG serialization for custom-beat scores.
- Register `abc-examples.jps` for both exact cached parity and focused marker behavior checks.

## Verification

- `abc-examples.jps` produces the oracle's two three-note primary beams.
- Its `1//^` note produces isolated primary and secondary beam stubs before the following notes.
- `pnpm run parity:translate abc-examples.jps` reports exact equality at 12,646 bytes.
- `pnpm run verify:songs` reports 39 exact cached songs plus passing `abc-examples` custom-beat behavior.
- `pnpm run verify:translate` reports 4 exact, 0 mismatched, and 0 missing caches.
- `pnpm exec tsc --noEmit` and `git diff --check` pass.