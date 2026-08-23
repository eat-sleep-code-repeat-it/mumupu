# Renderer Parity Regressions and Group Classification

Date: 2026-08-22

## Symptoms

- `example-001-paipaizuo.jps` differed from the oracle by the vertical position of an ordinary lower-octave dot.
- `memory-from-cats.jps` treated every parenthesized phrase as a tuplet, which selected grouped-row layout for ordinary slurs.
- Multi-meter headers and tempo-adjacent credits did not match oracle placement and serialization.

## Root Cause

- The lower-octave offset introduced for dense grouped rows was applied to all rows.
- Tuplet detection did not require the JPS `y` group marker.
- Header rendering used single-meter spacing and non-tempo credit coordinates for all inputs.

## Fix

- Scoped the dense lower-octave offset to grouped and compact rows.
- Limited tuplet classification to `y`-prefixed parenthesized groups.
- Matched three-meter spacing, tempo text serialization, tempo credit placement, and attached-meter bar metadata to the oracle.

## Verification

- `pnpm run parity:translate example-001-paipaizuo.jps`
- `pnpm run parity:translate example-002-sandumojin.jps`
- `pnpm exec tsc --noEmit`