# Sometimes When It Rains FixedDoHK Parity

Date: 2026-08-31

## Symptoms

- `sometime-when-it-rains-FixedDoHK.jps` differed from its cached oracle in rows containing explicit `7#` and `3#` substitutions.
- The affected rows had the correct total musical width in some cases, but accidental clearance was attached to the wrong event.

## Root Cause

- FixedDo sharp-slur clearance handled low-register descending figures but not equivalent octave-zero or cross-octave figures.
- Post-closure clearance remained on a later slur opener when the oracle assigned it to the preceding cross-octave sharp slur.
- High-register repeated-pitch sharp closures before a bar lacked their final clearance allowance.
- Two slur endpoint coordinates inherited an eleventh-decimal rounding difference from the corrected note position.

## Fix

- Transfer clearance to FixedDo cross-octave sharp slurs and suppress the later transfer when another accidental immediately follows.
- Extend expression-row descending sharp-slur clearance through octave zero.
- Add high-register repeated-pitch sharp endpoint clearance before a bar.
- Normalize the remaining note and slur endpoint coordinates consistently.

## Verification

- `sometime-when-it-rains-FixedDoHK.jps` is byte-exact against its 140060-byte cached oracle.
- `sometime-when-it-rains-FixedDo.jps` and `sometime-when-it-rains-FixedDoH.jps` remain byte-exact.
- `pnpm run verify:translate` reports 4 exact focused fixtures.
- `pnpm run verify:songs` reports 17 exact, 21 mismatched, and 0 missing caches; it exits nonzero because the 21 known mismatches remain.
- `pnpm exec tsc --noEmit` passes, and `lib/translate.ts` has no editor diagnostics.
