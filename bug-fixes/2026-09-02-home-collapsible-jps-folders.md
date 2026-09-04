# Home Collapsible JPS Folders

Date: 2026-09-02

## Symptoms

- The Home sidebar listed only JPS files directly inside `public/songs`.
- Files in `public/jps-files`, `public/songs-ai-jin-100`, and nested public folders were unavailable from the browser.
- Bare filenames could not uniquely identify files with the same name in different folders.

## Root Cause

- `/api/songs` read one hard-coded directory and returned only filenames.
- Home hard-coded `/songs/` when loading a selected file.
- The sidebar had no folder model or expansion state.

## Fix

- Recursively discover public folders containing JPS files and return a source-aware folder tree from `/api/songs`.
- Preserve the existing `files` response for the zhipu page while Home consumes the new tree.
- Render nested folders with independent expand/collapse controls and expand the tree when filtering starts.
- Load selections from encoded public-relative paths and use those paths as stable selection keys.

## Verification

- Direct route invocation discovers `jps-files`, `songs`, and `songs-ai-jin-100` while preserving 39 legacy song names.
- The live API includes files added to public JPS folders without code changes.
- ASCII and Unicode file URLs under `songs-ai-jin-100` return HTTP 200.
- `pnpm run build`, `pnpm exec tsc --noEmit`, focused ESLint, and `git diff --check` pass.
- Interactive Playwright verification was unavailable because Playwright is not installed in this workspace.