# Live Preview and SVG Save

Date: 2026-08-19

## Symptoms

- Preview could show a stored SVG from a different script instead of rendering the current editor contents.
- Save could export stale preview output after the script was edited.
- The `example-002-sandumojin.svg` fixture contained the `排排坐` output from example 001.

## Root Causes

- `translate()` searched public fixture files and returned a matching checked-in SVG before rendering the request body.
- Save reused the existing `svg` state when available.
- `public/svg-files/example-002-sandumojin.svg` was a byte-for-byte duplicate of `example-001-paipaizuo.svg`.

## Fixes

- `translate()` now always renders the submitted script content.
- Save always requests a fresh translation from the current textarea content before downloading.
- Save derives a sanitized `.svg` filename from the `B:` title.
- The translation verification script now checks live rendering and edited-content propagation instead of fixture replay.

## Verification

- Focused ESLint passed for `app/home/page.tsx`.
- `next build` completed successfully.
- Live translation verification passed.
- The fixture mismatch was confirmed: example 002's expected SVG was identical to example 001's expected SVG.
