# Quoted Lyric Annotations

Date: 2026-10-24

## Symptoms

- Quoted annotations embedded in lyric lines, such as `"女:_声部"`, were discarded instead of appearing before the lyric text.
- Underscores inside annotations did not become spaces.
- Slash-separated English words such as `do/lai/mi` were split into individual letters instead of lyric units.

## Root cause

- Lyric parsing removed only a quoted prefix from the entire line and did not retain it as an aligned lyric unit.

## Fix

- Parse quoted annotations wherever they occur in a lyric token and retain each as a lyric unit.
- Convert underscores in quoted annotations to spaces, preserving the existing note-by-note lyric alignment behavior.
- Treat slash-separated English words as one lyric unit while retaining trailing punctuation and mixed Chinese/English alignment.
- Add synthetic regression checks for annotation rendering, underscore conversion, English word alignment, and following lyric positions.

## Verification

- `corepack pnpm run verify:translate`: 4/4 primary fixtures match; live-edit, auxiliary-time-signature, lyric-annotation, and mixed-language checks pass.
- `corepack pnpm run verify:songs`: 38/38 song fixtures match; custom-beat and synthetic regression checks pass.
- `corepack pnpm exec tsc --noEmit` passes.
- `corepack pnpm exec eslint lib/translate.ts scripts/verify-translate.mjs` reports no errors; two existing unused-variable warnings remain in `lib/translate.ts`.
- `git diff --check` passes.
