# Render Bar-Attached Temporary Meter Annotations

Date: 2026-08-19

## Symptoms

- Even after temporary meter tokens such as `|"p:5/4"` were attached to bar events, the local SVG renderer did not draw them.
- Scores like `memory-from-cats.jps` therefore missed visible temporary meter changes at the bar positions.

## Root Cause

- The renderer only knew how to draw temporary meter glyphs for standalone dynamic events.
- Bar events carrying `p:x/x` annotations were rendered as bars only, with the annotation ignored.

## Fix

- Added a shared temporary-meter rendering helper in `lib/translate.ts`.
- Reused that helper for both standalone dynamic events and bar events with `p:x/x` annotations.
- Bar-attached temporary meters now render at the bar position using the local glyph set.

## Verification

- Local SVG inspection for `public/jps-files/memory-from-cats.jps` shows `linshi_paihao_*` glyphs in the output.
- `pnpm exec tsc --noEmit`
- `pnpm exec next build`
