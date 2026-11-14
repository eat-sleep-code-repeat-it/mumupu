# Accidental Rule Checker

Date: 2026-11-14

## Symptoms

- The viewer did not identify notes that may need a natural sign after a sharp or flat in the same measure.
- Semitone transposition treated each note as independent instead of honoring measure-local accidental carry.

## Root Cause

- The transposer did not track accidentals through a measure, and the viewer had no accidental-rule check or note-level highlighting.
- Transposed repeated altered notes could omit their accidental and then be mistaken by the checker for missing natural signs.

## Fix

- Track sharp, flat, and natural state per note and octave through each measure during transposition.
- Write repeated transposed sharps/flats explicitly, and restore naturals when the output accidental state changes.
- Add a viewer check that highlights unmarked repetitions affected by an earlier sharp or flat and explains that `=` is needed when natural is intended.

## Verification

- `pnpm run verify:transpose`
- `pnpm run verify:accidental-rules`
- `pnpm exec eslint app/viewer/page.tsx lib/accidental-rules.ts scripts/verify-accidental-rules.mjs scripts/verify-transpose-quoted-text.mjs`
- `pnpm run build`
