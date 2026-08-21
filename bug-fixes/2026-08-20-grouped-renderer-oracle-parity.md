# Grouped Renderer Oracle Parity

Date: 2026-08-20

## Symptoms

- `public/songs/sandu-mojin.jps` and `public/jps-files/example-002-sandumojin.jps` still diverged from the cached oracle SVG even after grouped-note metadata and basic spacing fixes.
- Remaining mismatches included grouped note x positions, grouped slur control points, slash-beam lines, octave marker anchors, and some grouped `code` attribute formatting.

## Root Cause

- The local renderer mixed float accumulation, inline SVG emission order, and simplified marker placement rules in the grouped-row path.
- That caused repeated last-ulp coordinate drift and several structure differences from the oracle renderer's emitted SVG.

## Fix

- Moved grouped note stepping onto exact decimal arithmetic and tuned the grouped row step constants to oracle-compatible values.
- Matched the oracle's grouped `code` formatting for scale degree `7`.
- Added `jianshixian` slash-beam line emission for compact dense beats and grouped slash clusters in oracle order.
- Split octave-marker output from grouped slur decoration output so their SVG ordering matches the oracle.
- Matched octave marker x/y anchor rules, including pitch-`4` horizontal offsets and 8px stacked octave spacing.
- Computed grouped slur path x coordinates from exact decimal note positions to remove final control-point drift.

## Verification

- `pnpm run parity:translate sandu-mojin.jps`
- `pnpm run parity:translate example-002-sandumojin.jps`
- `pnpm exec tsc --noEmit`