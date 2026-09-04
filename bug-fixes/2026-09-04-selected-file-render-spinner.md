# Selected File Render Spinner

Date: 2026-09-04

## Symptoms

- Clicking a file switched to Preview while the previous SVG remained visible during loading and rendering.
- There was no visual indication that the selected score was still being rendered.

## Root Cause

- File loading and automatic SVG translation had no shared pending state.
- The preview continued displaying the last completed SVG until the new translation finished.

## Fix

- Show an accessible spinner immediately after a file is selected.
- Keep the spinner visible while the file loads and the local `/api/translate` request renders its SVG.
- Force a render when the selected file has the same content as the current editor text.
- Use render generations so stale requests cannot dismiss the current file's spinner.

## Verification

- `pnpm exec eslint app/home/page.tsx`
- `pnpm exec tsc --noEmit`
- `git diff --check`