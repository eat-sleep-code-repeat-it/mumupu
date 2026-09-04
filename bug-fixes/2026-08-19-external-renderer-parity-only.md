# External Renderer Used For Parity Only

Date: 2026-08-19

## Symptoms

The repository still exposed an app-facing `/api/jianpu` route that posted JPS to the external Jianpu renderer, which conflicted with the requirement that runtime rendering must be fully local.

## Root Cause

An earlier workaround moved Preview and Save onto the external render route to avoid the simplified local fallback output for edited scores.

## Fix

- Removed the app-facing external render route.
- Kept Preview and Save on the local `/api/translate` path.
- Added `pnpm parity:translate` as an explicit parity-only script for comparing local output with the external Jianpu renderer offline.

## Verification

- No UI code calls the external Jianpu renderer at runtime.
- The parity script exists only under `scripts/` and is not part of the app request flow.
