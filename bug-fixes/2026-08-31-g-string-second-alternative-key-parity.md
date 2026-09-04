# G String Second Alternative-Key Parity

Date: 2026-08-31

## Symptoms

- `hejiayi-G-string-alternativeKeys2.jps` omitted its descriptive `J: 巴赫` header text.
- One score row used the wrong sharp-clearance ownership, one crescendo used the wrong vertical baseline, and several coordinates differed in the final serialized digit.

## Root Cause

- The header renderer handled numeric and empty `J:` values but not nonnumeric descriptive values.
- Descending sharp clearance was transferred across slur boundaries that require local ownership, while short same-pitch sharp resolutions still require sharing.
- An attached hairpin ending followed by duration holds did not use the same baseline as its prefix-ending equivalent.

## Fix

- Render nonnumeric `J:` values as left-aligned descriptive header text.
- Keep sharp clearance local for longer opening slurs and closing-sharp transitions while preserving shared clearance for immediate same-pitch natural resolutions.
- Use the default hairpin baseline when an attached ending is followed by a hold.
- Normalize oracle-consistent coordinate rounding edge values.

## Verification

- `hejiayi-G-string-alternativeKeys2.jps` is byte-exact at 94157 bytes.
- `hejiayi-F-Swan-lake-alternativekeys.jps` remains byte-exact at 70973 bytes.
- `pnpm run verify:translate` reports 4 exact focused fixtures.
- `pnpm run verify:songs` reports 11 exact, 27 mismatched, and 0 missing caches.
- `pnpm exec tsc --noEmit` passes.