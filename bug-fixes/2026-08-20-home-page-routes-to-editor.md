# Home Page Routes To Editor

Date: 2026-08-20

## Symptoms

- The root route `/` still rendered the default Next.js starter page.
- The actual score editor lived at `/home`, so opening the app landed on the wrong UI.

## Root Cause

- The custom editor was implemented in `app/home/page.tsx`, but `app/page.tsx` was never updated from the scaffolded placeholder.

## Fix

- Replaced the scaffolded root page with a thin wrapper that renders the existing editor from `app/home/page.tsx`.

## Verification

- `pnpm exec tsc --noEmit`
- Confirmed `app/page.tsx` now resolves to the existing home editor component.