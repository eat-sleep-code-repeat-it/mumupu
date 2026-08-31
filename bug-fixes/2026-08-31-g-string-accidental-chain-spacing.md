# G String Accidental-Chain Spacing

Date: 2026-08-31

## Symptoms

- The first five rows of `hejiayi-G-string-original.jps` used incorrect natural-width totals and accidental-clearance ownership.
- Broad flat-run rules regressed `memory-from-cats.jps` and `hejiayi-F-Swan-lake.jps` during correction.

## Root Cause

- Descending flats, restored naturals, and final-bar flat tails require different spacing based on notation order, octave movement, pitch distance, and slur closure.
- Generic accidental lookahead could reserve the same 0.4-unit clearance both locally and at a later slur or bar boundary.

## Fix

- Preserve octave-descending flat carry while keeping high-octave flat clearance local.
- Transfer clearance only for isolated adjacent flat descents.
- Share space for isolated non-adjacent descending flat pairs and restored `=, $, $` tails.
- Avoid duplicate final-bar clearance at the end of restored flat tails.
- Add natural-width allowance for sixteenth notes and non-accidental slur closures following sixteenth runs.
- Keep sixteenth-to-flat clearance local and share adjacent flat pairs only while a slur is active.

## Verification

- G String primary geometry matches the cached oracle through row five.
- `pnpm run verify:translate` reports 4 exact focused fixtures.
- `pnpm run verify:songs` reports 8 exact, 30 mismatched, and 0 missing caches.
- `hejiayi-F-Swan-lake.jps` remains byte-exact at 67297 bytes.