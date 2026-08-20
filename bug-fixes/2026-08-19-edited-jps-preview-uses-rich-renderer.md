# Edited JPS Preview Uses Rich Renderer

Date: 2026-08-19

## Symptoms

Existing fixture-backed scores such as `memory-from-cats.jps` rendered correctly until the user edited the script. After any edit, Preview and Save could render a visibly degraded SVG.

## Root Cause

The UI posted edited scripts to the local `/api/translate` path, which falls back to the simplified in-repo renderer whenever the content no longer exactly matches a checked-in fixture.

## Fix

Preview and Save now send the current script to `/api/jianpu`, which uses the richer Jianpu rendering service and only falls back when that service fails.

## Verification

- Focused ESLint passed for `app/home/page.tsx`.
- `next build` completed successfully.
- A direct remote-render check for an edited `memory-from-cats.jps` returned a valid SVG response.
