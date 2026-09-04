# Grouped Note Tuplet Metadata

Date: 2026-08-19

## Symptoms

- Parenthesized `y` groups in `example-002-sandumojin.jps` were parsed as standalone `group-start` and `group-end` events.
- That inflated `notepos`, kept grouped notes at ordinary slash durations, and prevented grouped note `code` attributes from matching the oracle.

## Root Cause

- The parser treated grouping punctuation as first-class rendered events instead of note-level tuplet metadata.
- Grouped notes therefore kept generic timing and raw token strings.

## Fix

- Updated `parseJpsEvents` in `lib/translate.ts` so parenthesized `y` groups stay on note events instead of consuming their own `notepos` slots.
- Grouped notes now carry note-level group metadata, use tuplet timing (`1/3`, `1/4`, etc.), and transform the first and last grouped note `code` values to the oracle-style `(ys` and `)` forms.
- Updated the renderer to consume grouped note metadata instead of standalone group marker events.

## Verification

- `pnpm run parity:translate example-002-sandumojin.jps` shows grouped note `time`, `notepos`, and `code` values moving into oracle shape even though dense-row spacing and grouped slur decoration still remain.
- `pnpm exec tsc --noEmit`
- `pnpm exec next build`
