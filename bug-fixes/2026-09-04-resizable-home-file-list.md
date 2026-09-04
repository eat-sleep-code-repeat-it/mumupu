# Resizable Home File List

Date: 2026-09-04

## Symptoms

- The Home file list used a fixed responsive width.
- Long song and folder names could not be given more space, while smaller lists could not be collapsed to leave more room for the score.

## Root Cause

- The sidebar width was controlled only by fixed Tailwind width classes and had no resize interaction.

## Fix

- Add a vertical resize separator between the file list and editor.
- Support pointer dragging and Arrow Left, Arrow Right, Home, and End keyboard controls.
- Clamp the sidebar to 160-480 pixels while reserving at least 320 pixels for the editor when the viewport allows it.
- Restore document cursor and text-selection styles when resizing ends or the page unmounts.

## Verification

- `pnpm exec eslint app/home/page.tsx`
- `pnpm exec tsc --noEmit`
- `git diff --check`
- `GET http://localhost:3000/home` returned HTTP 200 with no application errors in the Next.js development log.