# Viewer Semitone Transpose

Date: 2026-11-10

## Symptoms

- The viewer had no way to shift a script by semitones.

## Root Cause

- The viewer did not expose the existing transpose API used by the Zhipu page.

## Fix

- Add semitone shift input and Transpose action to the viewer toolbar in Script mode.
- Apply the transposed script to the editor and show errors or completion status.
- Reset the shift value to zero when a file is successfully reloaded.
- Ignore a transpose result if the selected file changed while the request was in flight.

## Verification

- `pnpm exec eslint app/viewer/page.tsx`
- `pnpm run build`
