# Edited JPS Preview Uses Rich Renderer

Date: 2026-08-19

## Symptoms

Existing fixture-backed scores such as `memory-from-cats.jps` rendered correctly until the user edited the script. After any edit, Preview and Save could render a visibly degraded SVG.

## Root Cause

The UI posted edited scripts to the local `/api/translate` path, which falls back to the simplified in-repo renderer whenever the content no longer exactly matches a checked-in fixture.

## Fix

Preview and Save now send the current script to the local `/api/translate` path. The local translator was upgraded to emit the richer fixture-style SVG dialect in-process, and the external Jianpu renderer is no longer used by the app at runtime.

## Verification

- Focused ESLint passed for `app/home/page.tsx`.
- `next build` completed successfully.
- The runtime rendering path is fully local again.
