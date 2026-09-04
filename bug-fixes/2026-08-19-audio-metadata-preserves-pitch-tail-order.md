# Audio Metadata Preserves Pitch-Tail Order

Date: 2026-08-19

## Symptoms

- Local note `audio` metadata normalized octave and accidental markers instead of preserving the note token’s original pitch-tail order.
- Tokens such as `2'$` and `7$,` therefore lost source-faithful pitch metadata.

## Root Cause

- The parser rebuilt `audioValue` from selected subparts instead of preserving the original pitch suffix.

## Fix

- Updated `parseJpsTokenParts` and `parseJpsNoteToken` in `lib/translate.ts` so `audioValue` is built from the original `pitchSuffix`.
- This preserves source-faithful audio metadata for annotated and accidental-bearing notes.

## Verification

- Local event inspection for `memory-from-cats.jps` now shows `audio` values such as `7$,` and `2'$` on the affected notes.
- `pnpm exec tsc --noEmit`
- `pnpm exec next build`
