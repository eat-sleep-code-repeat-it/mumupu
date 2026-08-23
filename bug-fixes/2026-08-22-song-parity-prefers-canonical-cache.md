# Song Parity Prefers Canonical Cache

Date: 2026-08-22

## Symptoms

- The all-song parity report marked `sandu-mojin.jps` as mismatched even though its content-identical public fixture already had exact parity.

## Root Cause

- Song validation prioritized `oracle-cache/songs` over the canonical cache under `oracle-cache/jps-files`.
- Content-identical alias discovery only inspected the currently selected public directory.

## Fix

- Restored canonical `jps-files` cache priority for every validation scope.
- Extended content-identical fixture discovery across both public fixture directories.

## Verification

- `pnpm run parity:translate sandu-mojin.jps` reports `equal: true`.
- `pnpm run verify:songs` counts `sandu-mojin.jps` as an exact match.