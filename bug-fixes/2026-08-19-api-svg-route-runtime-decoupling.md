# API SVG Route Runtime Decoupling

Date: 2026-08-19

## Symptoms

- `/api/svg` still returned SVG content by reading `public/svg-files/memory-from-cats.svg` from disk.
- That left one runtime path dependent on local expected SVG fixtures even after the main preview/save flow had been moved to the local translator.

## Root Cause

- The legacy `app/api/svg/route.ts` route still used `lib/svg.ts` to read pre-rendered fixture SVG files directly.

## Fix

- Updated `app/api/svg/route.ts` to read `public/jps-files/memory-from-cats.jps` and render it locally through `lib/translate.ts`.
- Removed the unused fixture-reader module `lib/svg.ts`.

## Verification

- `pnpm exec tsc --noEmit`
- `pnpm exec next build`
- No diagnostics in `app/api/svg/route.ts`
