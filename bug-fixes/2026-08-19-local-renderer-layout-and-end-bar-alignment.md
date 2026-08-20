# Local Renderer Layout and End-Bar Alignment

Date: 2026-08-19

## Symptoms

- The local SVG renderer placed lyric-bearing rows too close together.
- Final double-bar rendering did not align with the expected score ending.
- Leading or trailing visible bars on a row consumed note spacing and compressed the melody layout.
- Row spacing and bar spacing caused note positions to drift from the intended layout.
- Octave-qualified note audio and lyric punctuation placement were inconsistent in the generated SVG.

## Root Cause

- The renderer used a generic row width and fixed bar advance that did not match the score layout rules used by the local rich renderer dialect.
- Terminal bar handling, leading row bars, and trailing row bars were treated like ordinary spacing events instead of row boundaries.
- Octave/audio metadata and lyric punctuation anchoring were not emitted consistently from the note event path.

## Fix

- Adjusted row bounds and inter-measure bar advance in `lib/translate.ts`.
- Rendered terminal `|j` bars with the end-bar glyph path and aligned them to the row boundary.
- Treated leading row bars and trailing ordinary row bars as boundary markers so they render without consuming horizontal layout width.
- Increased lyric-row vertical advance and kept lyric punctuation anchored to the active note.
- Preserved octave-qualified audio values for note tokens and kept the renderer self-contained with local glyph definitions.

## Verification

- `pnpm exec tsc --noEmit`
- `pnpm exec next build`
- Local coordinate inspection for `public/jps-files/example-001-paipaizuo.jps` showed the updated row positions and end-bar placement in the generated SVG.
- Local coordinate inspection for `public/jps-files/example-002-sandumojin.jps` showed the leading bar rendered at the boundary while the first note remained on the melody grid.
