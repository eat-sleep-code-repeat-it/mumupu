# External Oracle Verification and Runtime Decoupling

Date: 2026-08-19

## Symptoms

- The repository verifier trusted checked-in SVG fixtures as the expected output.
- The local translator still read `public/svg-files` at runtime for exact fixture replay and template glyph definitions.
- Deleting local expected SVG files would have broken runtime rendering.

## Root Cause

- Verification and runtime behavior were both coupled to local fixture SVG files instead of treating the external renderer as an oracle used only for parity checking.

## Fix

- `scripts/verify-translate.mjs` now fetches the external Jianpu renderer output for each public JPS file and compares `translate()` against that result.
- `lib/translate.ts` no longer reads `public/svg-files` or replays expected SVG files at runtime.
- Rich glyph defs were embedded into code in `lib/defaultRichGlyphDefs.ts` so local rendering remains self-contained.

## Verification

- Edited `memory-from-cats.jps` still renders locally with rich glyph references.
- `pnpm verify:translate` now verifies against the external renderer and currently reports real parity gaps instead of trusting local fixture files.
