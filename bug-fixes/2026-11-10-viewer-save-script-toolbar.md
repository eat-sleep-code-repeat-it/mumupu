# Viewer Save Script Toolbar Alignment

Date: 2026-11-10

## Symptoms

- The disabled Save Script button appeared in Script mode even though saving scripts was unavailable.

## Root Cause

- The viewer rendered a Save Script action that could not be used.

## Fix

- Remove the unavailable Save Script action and show Save SVG in the shared toolbar only in Preview mode.

## Verification

- `pnpm exec eslint app/viewer/page.tsx`
- `pnpm run build`
