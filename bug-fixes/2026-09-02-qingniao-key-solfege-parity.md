# Qingniao Key-Solfege Parity

Date: 2026-09-02

## Symptoms

- `067-青鸟-火影忍者.jps` did not match its cached SVG.
- Most natural-width rows were slightly too narrow, the all-eighth row used compact spacing, and the mixed tuplet row was substantially compressed.
- The focused parity helper could not find fixtures under `songs-ai-jin-100`.

## Root Cause

- Headers such as `Z: C调唱名` had no dedicated layout profile.
- Generic slur and high-octave clearance reservations added width that this oracle does not use.
- Dense eighth rows entered the compact renderer, and sparse tuplets used the wrong mixed-row advances.
- The score requires legacy expanded-element and CRLF SVG serialization plus several canonical decimal forms.

## Fix

- Added a key-solfege spacing profile for letter-key `调唱名` declarations.
- Reused the existing clearance-suppression path, kept dense rows in natural layout, and applied oracle-compatible mixed-tuplet advances.
- Used legacy SVG serialization for this profile and added the required coordinate canonicalizations.
- Added `songs-ai-jin-100` to the focused parity helper's fixture and oracle search paths.

## Verification

- `pnpm run parity:translate "067-青鸟-火影忍者.jps"` reports exact equality at 124,933 bytes.
- `pnpm run verify:songs` reports 39 exact, 0 mismatched, and 0 missing caches.
- `pnpm run verify:translate` reports 4 exact, 0 mismatched, and 0 missing caches.
- `pnpm exec tsc --noEmit`, diagnostics, and `git diff --check` pass.