# Remote SVG Is Validation-Only

Date: 2026-08-22

## Symptoms

- A package command could proactively fetch remote SVGs even when local validation caches existed.
- Home renderer validation needed a clear boundary between oracle acquisition and page output.

## Root Cause

- Oracle acquisition could run proactively instead of only when validation lacked a cached reference.

## Fix

- Removed the proactive remote cache-fetch script and package command.
- Kept cached oracle SVG access confined to validation scripts.
- For home renderer work, remote SVG retrieval is permitted only as a validation fallback when the required local cache is unavailable; it must never supply Home Preview, Save, or `/api/translate` output.
- The separate jianpu page and API remain unchanged and out of scope.

## Verification

- Unchanged and edited home inputs both use `/api/translate` local-renderer output rather than cached SVG content.
- Home application code contains no oracle-cache reads.
- The proactive `cache:oracle-svg` package command no longer exists.
- `pnpm exec tsc --noEmit`