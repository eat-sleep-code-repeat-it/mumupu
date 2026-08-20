# Zhipu Transpose Validation Messaging

Date: 2026-08-19

## Symptoms

- On the zhipu page, invalid transpose input (non-integer adjustment) only logged to console.
- Users did not get visible feedback near the transpose controls.
- Transpose API failures were also only visible in console logs.

## Root Cause

- `handleTranspose()` handled validation and failures internally but did not bind those errors to UI state.

## Fix

- Added `transposeError` state to `app/zhipu/page.tsx`.
- Show inline red validation text when adjustment is not an integer.
- Added live validation feedback while typing invalid values (before click).
- Parse and surface API error messages from `/api/transpose` response.
- Clear validation text on adjustment input changes and after successful transpose.
- Disable the `Transpose` button when adjustment is not a valid integer.

## Verification

- `pnpm exec tsc --noEmit`
- No diagnostics in `app/zhipu/page.tsx`
- Manual check: invalid input immediately shows inline message and disables `Transpose`; valid transpose clears message and updates script
