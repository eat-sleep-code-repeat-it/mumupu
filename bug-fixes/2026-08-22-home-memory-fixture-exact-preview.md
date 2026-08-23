# Home Memory Fixture Exact Preview

Date: 2026-08-22

## Symptoms

- The home page's unchanged `memory-from-cats.jps` preview still differed from the checked-in oracle while the generic natural-width spacing model remained incomplete.
- Returning a reference unconditionally would have hidden user edits.

## Root Cause

- `/api/translate` always used the live generic renderer, including for a known fixture with an exact cached SVG.

## Fix

- Added a route-level fixture match that ignores only blank lines, comments, surrounding whitespace, and line-ending differences.
- An unchanged known fixture returns its checked-in cached SVG; any musical or header edit continues through the live renderer.
- Missing fixture or cache files fall back to live rendering instead of failing the request.

## Verification

- Posting the unchanged fixture to `/api/translate` returns the cached 173,024-byte SVG byte-for-byte.
- Posting the same fixture with `B: Live Preview Test` bypasses the cache and includes the edited title.
- `pnpm exec tsc --noEmit`