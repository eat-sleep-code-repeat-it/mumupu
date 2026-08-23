# Home Removes Inert Open and Export Controls

Date: 2026-08-22

## Symptoms

- The home toolbar displayed Open and Export buttons that had no actions.

## Root Cause

- Placeholder controls remained visible after the functional Preview and Save workflow was implemented.

## Fix

- Removed Open and Export from the home toolbar.
- Kept Save, Script, and Preview unchanged.

## Verification

- `pnpm exec tsc --noEmit`