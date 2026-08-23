# Home Automatically Renders Edits

Date: 2026-08-22

## Symptoms

- The loaded JPS script did not render until Preview was clicked.
- Script edits left the prepared preview stale until another manual Preview action.

## Root Cause

- The home editor invoked `/api/translate` only from the Preview and Save handlers.

## Fix

- Added a 400 ms debounced render after the initial script load and every text change.
- Aborted pending automatic requests when newer text arrived.
- Kept automatic rendering in the background so it does not switch the user out of Script mode.
- Kept Preview and Save as immediate local renders of the current editor text.
- Displayed translation errors separately instead of placing HTML error content in SVG state.

## Verification

- `pnpm exec tsc --noEmit`
- Home browser check: load the initial script, edit its title, wait for the debounced request, and confirm Preview contains the edited title.