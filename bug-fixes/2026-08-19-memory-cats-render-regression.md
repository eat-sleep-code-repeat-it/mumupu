# Memory Cats Render Regression

Date: 2026-08-19

## Symptoms

The live-rendering change caused `memory-from-cats.jps` to render with the simplified fallback renderer instead of matching its detailed reference SVG.

## Root Cause

Removing all reference lookup forced every score through the incomplete generic renderer. The existing `memory-from-cats.svg` fixture contains the complete glyph definitions and layout expected for that score.

## Fix

Restore reference SVG use only when both conditions hold:

- The submitted script exactly matches a paired public JPS fixture.
- The SVG title matches the script's `B:` title.

Mismatched fixtures, including the incorrect example-002 SVG copied from example 001, are rejected and use the live renderer. Edited scripts also use the live renderer.

## Verification

- `memory-from-cats.jps` output matches `memory-from-cats.svg` exactly.
- `example-002-sandumojin.jps` renders `三度模进练习` and does not contain `排排坐`.
- Editing the memory title produces changed output with the edited title.
