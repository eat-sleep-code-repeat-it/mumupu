# Parity Validation Is Cache-Only

Date: 2026-08-22

## Symptoms

- Routine `parity:translate` and `verify:translate` validation commands contacted the external renderer.
- Local verification could therefore perform unexpected network requests instead of using the checked-in oracle snapshots.

## Root Cause

- Both validation scripts embedded remote request logic even though matching SVG fixtures already existed under `oracle-cache/`.

## Fix

- Removed remote request code from both validation scripts.
- Resolved JPS inputs and their corresponding cached SVGs from `public/` and `oracle-cache/`.
- Kept remote snapshot refreshes isolated to the explicit cache-generation script.

## Verification

- `pnpm run parity:translate example-002-sandumojin.jps`
- `pnpm run verify:translate`