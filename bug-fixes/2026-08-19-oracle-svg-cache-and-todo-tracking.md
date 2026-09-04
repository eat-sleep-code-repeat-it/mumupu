# Oracle SVG Cache and TODO Tracking

Date: 2026-08-19

## Symptoms

- Oracle parity required repeated remote fetches, and there was no persistent local mapping from a JPS file to its latest oracle SVG snapshot.
- There was also no repository TODO list capturing the remaining renderer gaps and the songs-folder parity failures.

## Root Cause

- The repo had parity scripts, but no script that persisted oracle SVG snapshots by JPS filename.
- Remaining parity work was tracked only in conversation state rather than a workspace TODO file.

## Fix

- Added `scripts/cache-oracle-svg.mjs` to fetch and save oracle SVG snapshots for `public/jps-files` and `public/songs`.
- Added `cache:oracle-svg` in `package.json`.
- Cached files are stored under `oracle-cache/jps-files/` and `oracle-cache/songs/` using the exact JPS filename plus `.svg`.
- Added `TODO.md` with the current unresolved renderer issues and the songs-folder mismatch list.

## Verification

- `pnpm run cache:oracle-svg`
- Verified 40 oracle SVG snapshots were written locally with JPS-derived filenames.
- Extracted the songs-folder parity summary from the existing parity output and recorded 37 mismatches in `TODO.md`.
