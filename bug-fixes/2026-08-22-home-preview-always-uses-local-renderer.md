# Home Preview Always Uses Local Renderer

Date: 2026-08-22

## Symptoms

- The translation API returned a cached SVG when the submitted script matched `memory-from-cats.jps`.
- Previewing an unchanged script therefore bypassed the repository's own parser and renderer.

## Root Cause

- `/api/translate` contained a fixture-specific filesystem lookup before its call to `translate()`.

## Fix

- Removed all fixture and cached SVG lookup logic from `/api/translate`.
- Every request now passes its submitted script directly to the local `translate()` implementation.
- Home Preview and Save both use this endpoint and therefore follow the same live-rendering path.

## Verification

- Posting unchanged `memory-from-cats.jps` returns the 171,427-byte local render rather than the 173,024-byte cached oracle.
- Posting an edited title returns a distinct local render containing the edit.
- Application code contains no `oracle-cache` or cached SVG references.
- `pnpm exec tsc --noEmit`