# Selected Song Opens Preview

Date: 2026-09-04

## Symptoms

- Selecting a JPS file from the home sidebar loaded its source and stayed in Script mode.
- Users had to click Preview after every file selection.

## Root Cause

- The successful file-selection handler explicitly disabled the preview and set the active mode to `script`.

## Fix

- Switch to Preview mode after a selected file loads successfully.
- Keep the Script button as the explicit control for returning to the source editor.
- Continue using the debounced local `/api/translate` render for the selected file.

## Verification

- `pnpm exec tsc --noEmit`
- Browser check: select a file in the home sidebar, confirm Preview opens, then click Script and confirm the loaded source appears.
