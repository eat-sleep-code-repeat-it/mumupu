# G String Accidental-Chain Spacing

Date: 2026-08-31

## Symptoms

- All score rows of `hejiayi-G-string-original.jps` used incorrect natural-width totals, accidental-clearance ownership, beam levels, or slur rendering.
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
- Reallocate flat-sixteenth descent clearance onto the flat note when the follower is an eighth, and onto the follower when it is a sixteenth.
- Suppress duplicate leading clearance when a nested-slur opener is followed by a repeated same flat.
- Consume nested-slur clearance only on adjacent double-closes, and reset the pending flag at each bar.
- Exclude whole-note openers from cross-bar slur clearance.
- Add clearance for a slur-opening eighth that begins a stepwise descent into a flat.
- Keep leading clearance on a flat that descends to a slur-closing natural restore.
- Share adjacent descending flat pairs only when the lower note does not close the slur.
- Distinguish ascending slur openers after flat closes, repeated high-flat closures, dotted nested openers, and later-starting nested children.
- Emit second-level beams for contiguous sixteenth-note runs, including isolated sixteenth stubs, and preserve dotted measure-beat grouping.
- Render long ordinary slurs with cap glyphs, octave clearance, parent-before-child ordering, and later-child depth when the opening token does not already encode nesting.

## Verification

- `hejiayi-G-string-original.jps` is byte-exact against the cached oracle at 87714 bytes.
- `pnpm run verify:translate` reports 4 exact focused fixtures.
- `pnpm run verify:songs` reports 9 exact, 29 mismatched, and 0 missing caches.
- `hejiayi-F-Swan-lake.jps` remains byte-exact at 67297 bytes.