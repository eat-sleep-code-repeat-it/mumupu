# Viewer Multi-Page Fenye Rendering

Date: 2026-10-27

## Symptoms

- The viewer showed only the score before the first `[fenye]` marker, hiding the remaining pages.
- The local translator's first-page output did not match the provided Zhipu-rendered reference SVG.
- Editing a selected script in the viewer did not save changes back to the original `.jps` file.

## Root Cause

- The viewer used the local translator, while the provided reference pages come from the existing Zhipu rendering endpoint.
- The Zhipu route split rendered output into pages but returned only the first page.

## Fix

- The Zhipu route now returns the original rendered page SVGs alongside the existing first-page `svg` response.
- The viewer displays each page separately and exports the pages in one vertically stacked SVG, keeping page 1's original SVG content intact and namespacing later page IDs.
- SVG ampersands are XML-escaped instead of being replaced with plus signs, preserving notation metadata.
- Added an explicit Save Script action that writes only an existing `.jps` file under `public`, after same-origin, size, path, symlink, and regular-file checks.

## Verification

- `pnpm run verify:svg-pages` checks page splitting, unchanged first-page content, page-local ID references, and stacked export dimensions.
- `pnpm run verify:save-script` checks save behavior, cross-origin rejection, and path traversal rejection.
- `pnpm exec eslint app/viewer/page.tsx app/api/songs/save/route.ts scripts/verify-save-script.mjs` passes.
- `pnpm run build` passes.
- Focused assertions compare the combined SVG's three page contents with `1793148813.svg`, `1793148889.svg`, and `1793148945.svg`.
- `pnpm exec tsc --noEmit` passes.
