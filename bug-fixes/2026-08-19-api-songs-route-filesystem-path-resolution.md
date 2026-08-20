# API Songs Route Filesystem Path Resolution

Date: 2026-08-19

## Symptoms

- Build failed with: `Module not found: Can't resolve '../../../public/songs'`.
- The new `/api/songs` endpoint could not be bundled.

## Root Cause

- The route used `new URL("../../../public/songs", import.meta.url)` to resolve a directory path, which triggered bundler module resolution behavior incompatible with that folder reference.

## Fix

- Updated `app/api/songs/route.ts` to resolve the songs directory via `path.join(process.cwd(), "public", "songs")`.
- Added `node:path` import and kept `readdir`-based directory listing logic unchanged.

## Verification

- `pnpm exec tsc --noEmit`
- `pnpm exec next build`
- No diagnostics in `app/api/songs/route.ts`
