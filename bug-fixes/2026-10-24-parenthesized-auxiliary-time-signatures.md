# Parenthesized Auxiliary Time Signatures

Date: 2026-10-24

## Symptoms

- The documented `P:4/4 (2/4 1/4)` form did not render the auxiliary time signatures because the header renderer only split on commas.

## Root cause

- Time-signature extraction treated commas as the only separator and passed parentheses through as part of a signature.

## Fix

- Extract ordered numerator/denominator pairs from the complete `P:` value, supporting comma-separated values and the documented space-separated parenthesized form.
- Add a synthetic regression check for the primary and both auxiliary signatures.

## Verification

- `corepack pnpm run verify:translate`: 4/4 primary fixtures match; live-edit and auxiliary-signature checks pass.
- `corepack pnpm run verify:songs`: 38/38 song fixtures match; custom-beat and auxiliary-signature checks pass.
- `corepack pnpm exec tsc --noEmit` passes.
- `corepack pnpm exec eslint lib/translate.ts scripts/verify-translate.mjs` reports no errors; two existing unused-variable warnings remain in `lib/translate.ts`.
- `git diff --check` passes.
