# Bar-Attached Temporary Meter Annotations

Date: 2026-08-19

## Symptoms

- Temporary meter changes such as `|"p:5/4"` in `memory-from-cats.jps` were tokenized into a plain bar followed by an orphaned quoted token.
- The local renderer therefore could not associate temporary meter annotations with the bar where they belong.

## Root Cause

- `parseJpsEvents` treated quoted `p:x/x` tokens after `|` as independent tokens instead of bar annotations, even though the spec defines temporary meter changes on the bar line.

## Fix

- Updated `parseJpsEvents` in `lib/translate.ts` to detect a quoted `p:` token immediately following a bar token and attach it to the bar event as `annotation`.
- Consumed the quoted annotation token in the same pass so it no longer floats as an unrelated token.

## Verification

- Local event inspection on `public/jps-files/memory-from-cats.jps` shows bar events carrying annotations like `p:5/4`, `p:6/4`, and `p:3/4`.
- `pnpm exec tsc --noEmit`
- `pnpm exec next build`
