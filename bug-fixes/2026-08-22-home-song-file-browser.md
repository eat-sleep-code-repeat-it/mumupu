# Home Song File Browser

Date: 2026-08-22

## Symptoms

- The home editor loaded only the default fixture and did not expose scripts under `public/songs`.
- Opening another song required manually locating and copying its content.

## Root Cause

- The existing `/api/songs` listing was not consumed by the home page.
- The endpoint also returned non-JPS files from the songs directory.

## Fix

- Limited `/api/songs` results to `.jps` files.
- Added a searchable, scrollable Songs sidebar to the home page.
- Made each filename load its public song script into the editor and return to Script mode.
- Cancelled an older pending file request when another song is selected.
- Reused automatic local rendering so selected scripts are never replaced by cached oracle SVGs.
- Contained wide SVG scrolling inside the preview area on narrow viewports.

## Verification

- `pnpm exec tsc --noEmit`
- `/api/songs` returns 38 JPS filenames and excludes the Markdown note.
- Browser check: click a song and confirm its source appears in the JPS editor and its title appears in Preview.