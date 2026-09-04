# Cumulative Duration Markers

Date: 2026-08-19

## Symptoms

- The local duration logic flattened all slash and dot cases to only a few hard-coded values.
- That behavior did not match the spec, which allows multiple slash cuts and double-dotted notes.

## Root Cause

- `durationTime` only checked whether a token contained any `/` or any `.` instead of counting them cumulatively.
- Dot rendering also only emitted a single augmentation dot regardless of how many were present.

## Fix

- Updated `durationTime` in `lib/translate.ts` to compute duration from the full slash count and dot count.
- Updated SVG rendering to emit one dot glyph per dot marker with a horizontal offset.

## Verification

- Local event inspection still shows existing dotted notes in `memory-from-cats.jps` rendering with the expected `1.5` timing.
- `pnpm exec tsc --noEmit`
- `pnpm exec next build`
