# Accidental-Key Time Signature Position

Date: 2026-08-31

## Symptoms

- A single time signature following an accidental key signature rendered five pixels too far left.
- Applying the same offset to multiple time signatures regressed `memory-from-cats.jps`.

## Root Cause

- Time-signature placement did not distinguish natural keys, accidental keys with one signature, and accidental keys with multiple signatures.

## Fix

- Shift a single time signature five pixels right when the key signature contains an accidental.
- Preserve existing anchors when multiple time signatures are rendered.

## Verification

- `memory-from-cats.jps` remains byte-exact at 173024 bytes.
- `hejiayi-G-string-original.jps` matches its header through the time signature and remains the active parity target.
- `pnpm run verify:translate` reports 4 exact, 0 mismatched, and 0 missing caches.
- `pnpm exec tsc --noEmit` completes successfully.