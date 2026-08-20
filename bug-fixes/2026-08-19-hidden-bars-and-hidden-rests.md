# Hidden Bars and Hidden Rests

Date: 2026-08-19

## Symptoms

- Valid JPS spacing tokens `|/`, `|*`, and `8` were not handled according to the local spec.
- Hidden bars were tokenized incorrectly and hidden rests would have rendered as visible glyphs.

## Root Cause

- The tokenizer treated `|/` and `|*` as ordinary `|` plus trailing characters.
- The renderer treated `8` like a visible rest glyph instead of a spacing-only filler.

## Fix

- Updated `tokenizeJpsLine` and `parseJpsEvents` in `lib/translate.ts` to preserve `|/` and `|*` as bar tokens.
- Updated renderer spacing so `|/` consumes no width and `|*` consumes width without drawing a visible bar.
- Treated `8` as a hidden-rest event that preserves timing and spacing without rendering a visible glyph.

## Verification

- Synthetic local JPS checks show `|/` and `|*` become proper bar events and do not render visible bar glyphs.
- Synthetic local JPS checks show `8` preserves spacing while no visible `shuzi_b_8` glyph is emitted.
- `pnpm exec tsc --noEmit`
- `pnpm exec next build`
