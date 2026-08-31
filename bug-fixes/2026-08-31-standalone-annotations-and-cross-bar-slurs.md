# Standalone Annotations and Cross-Bar Slurs

Date: 2026-08-31

## Symptoms

- A standalone quoted annotation such as `6 "mf" -` became a pitchless score event instead of annotating note `6`.
- The phantom event shifted subsequent `notepos` metadata and changed natural-row justification.
- Slurs crossing internal bar lines rendered as continuous curves, while cached output used left/right cap glyphs joined by a line.
- The cap glyph uses were emitted without locally owned definitions.

## Root Cause

- Only annotations embedded in note tokens were attached during parsing.
- Active ordinary slurs tracked holds and octave height but not internal bar crossings.
- The extra glyph registry lacked the two split-slur cap definitions.

## Fix

- Absorb standalone quoted annotations into the preceding note without creating an event.
- Use the natural-row annotation layer and oracle-compatible placement for attached annotations.
- Track internal bar crossings on active slurs and route long crossing spans through the existing cap-and-connector renderer.
- Add exact locally owned `lianyinxian_zuo` and `lianyinxian_you` definitions.
- Keep cached oracle SVGs validation-only; runtime output continues to use the local renderer.

## Verification

- The focused exact-fixture suite remains 4 exact, 0 mismatched, and 0 missing caches.
- The song inventory remains 5 exact, 33 mismatched, and 0 missing caches.
- `hejiayi-F-Swan-lake-alternativekeys.jps` now advances past its former definition-block mismatch; its remaining first difference is an accidental-clearance allocation within row one.
- `hejiayi-F-Swan-lake.jps` now matches through rows one and two; its remaining first difference is row-three natural-width geometry.
- `pnpm exec tsc --noEmit` completes without diagnostics.