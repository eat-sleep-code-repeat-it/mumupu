# Annotated Note Tail Parsing

Date: 2026-08-19

## Symptoms

- Annotated note tokens with duration marks after the annotation, such as `2'$"D♭-47".`, were parsed incorrectly.
- The local parser lost the annotation and octave information on those tokens, which would corrupt both event metadata and rendered output.

## Root Cause

- The note-token parser assumed annotations always came last and assumed accidentals appeared before octave markers.
- Tokens that interleaved octave markers, accidentals, annotations, and trailing duration marks therefore fell outside the parser’s accepted shape.

## Fix

- Added shared helpers in `lib/translate.ts` to extract inline annotations and parse pitch tails independently of exact character order.
- Updated both `parseJpsTokenParts` and `parseJpsNoteToken` to use the tolerant parsing path.

## Verification

- Local event inspection for `public/jps-files/memory-from-cats.jps` now shows correct parsing for tokens such as `2'$"D♭-47".` and `2'$/"52"`.
- `pnpm exec tsc --noEmit`
- `pnpm exec next build`
