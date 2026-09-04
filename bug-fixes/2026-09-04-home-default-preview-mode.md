# Home Defaults to Preview Mode

Date: 2026-09-04

## Symptoms

- The Home page initially selected the Script button and displayed the source editor.
- Users had to select Preview before seeing the automatically rendered default score.

## Root Cause

- The Home component initialized both its displayed view and active mode to Script.

## Fix

- Initialize the Home page with Preview displayed and the Preview button selected.
- Keep the Script button as the explicit way to open the source editor.

## Verification

- `pnpm exec eslint app/home/page.tsx`
- `pnpm exec tsc --noEmit`
- `git diff --check`