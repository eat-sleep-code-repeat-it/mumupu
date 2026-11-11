# Transpose Preserves Quoted Text

Date: 2026-11-10

## Symptoms

- Transposing a score changed numbers inside quoted annotations such as `"p:4/4"`.

## Root Cause

- The transposer processed every character on `Q:` lines as potential notation, including quoted annotation text.

## Fix

- Preserve quoted spans verbatim while transposing notes outside them.
- Add a regression check using `069-秋樱.jps`.

## Verification

- `pnpm run verify:transpose`
- `pnpm exec eslint lib/transpose-core.mjs scripts/verify-transpose-quoted-text.mjs`
- `pnpm build`
