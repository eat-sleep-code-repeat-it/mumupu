# Swan Shengsan Parity

Date: 2026-08-31

## Symptoms

- A present but blank `J:` header omitted the oracle's empty tempo text and shifted every score row upward.
- Accidental runs, nested slurs, and all-whole-note slur rows reserved natural width at the wrong events.
- Dense dotted-accidental rows used continuous beam pairing instead of measure-beat grouping.
- Nested outer slurs overlapped inner curves and long cap-based slurs.

## Root Cause

- Tempo layout depended on a non-empty value instead of header presence.
- Ordinary natural-width rules lacked deferred nested-slur state and lookahead for ascending accidental clusters.
- Natural layout and beam selection did not cover whole-note slur rows or dense rows with dotted accidental openers.
- Ordinary slur rendering did not retain nesting depth.

## Fix

- Treat a blank but present tempo header as layout-bearing and emit its empty text node without a tempo glyph.
- Allocate accidental-run clearance at the owning beat boundary and defer accidental nested-slur clearance to the outer closing note.
- Enable natural widths for all-whole-note slur rows and suppress cross-bar hold clearance there.
- Use measure-beat beams for dense dotted-accidental rows.
- Raise nested curved slurs by 8 pixels per level and long cap-based slurs by 4 pixels per level.
- Keep cached oracle SVGs validation-only; runtime output remains locally rendered.

## Verification

- `hejiayi-swan-shengsan.jps` matches its cached oracle byte-for-byte at 103556 bytes.
- Both `hejiayi-F-Swan-lake.jps` variants remain byte-exact.
- `pnpm run verify:translate` reports 4 exact, 0 mismatched, and 0 missing caches.
- `pnpm run verify:songs` reports 8 exact, 30 mismatched, and 0 missing caches.
- `pnpm exec tsc --noEmit` completes without diagnostics.