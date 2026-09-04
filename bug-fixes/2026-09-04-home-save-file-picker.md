# Home Save File Picker

Date: 2026-09-04

## Symptoms

- Clicking Save immediately downloaded the rendered score.
- The user could not choose a destination before saving.

## Root Cause

- The save handler only created a temporary download link and did not use the browser's file picker API.

## Fix

- Open the native save-file picker with the score title as the suggested SVG filename.
- Write the rendered SVG to the selected file.
- Keep the download flow as a fallback for browsers without file picker support.
- Treat closing the picker without selecting a file as a normal cancellation.

## Verification

- `node_modules/.bin/tsc.cmd --noEmit`