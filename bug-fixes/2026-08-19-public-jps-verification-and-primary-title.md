# Public JPS Verification and Primary Title Handling

Date: 2026-08-19

## Symptoms

- The repository had no executable check that every file in `public/jps-files/` rendered according to its same-stem expected SVG.
- JPS files with repeated `B:` headers could be interpreted with the wrong title because the parser kept only the last `B:` value in `header`.

## Root Cause

- Verification was limited to a narrow sample rather than the full public fixture set.
- Title selection logic used `header.B`, which reflects the last repeated `B:` header rather than the canonical first title line used by the fixtures.

## Fix

- Expanded `scripts/verify-translate.mjs` to validate every public JPS file.
- The verification now requires:
  - a same-stem SVG fixture in `public/svg-files/`
  - matching JPS and SVG titles
  - exact `translate()` parity with the expected SVG
  - live-edit title propagation for edited content
- Added `pnpm verify:translate` as the repository command for this contract.
- Updated title handling to use the first `B:` entry as the primary score title.

## Verification

- `example-001-paipaizuo.jps` now passes title-based fixture validation.
- `memory-from-cats.jps` still matches its expected SVG.
- The repository-wide verifier currently fails only for `example-002-sandumojin.jps`, because `public/svg-files/example-002-sandumojin.svg` still has the title `排排坐` instead of `三度模进练习`.
