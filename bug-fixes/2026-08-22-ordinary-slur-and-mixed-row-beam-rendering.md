# Ordinary Slur and Mixed-Row Beam Rendering

Date: 2026-08-22

## Symptoms

- Parenthesized phrases without the `y` tuplet marker lost their slur boundaries and annotation-free `code` metadata.
- Slash notes in mixed-duration rows emitted no duration beams.

## Root Cause

- Parser group metadata represented tuplets only and could not distinguish nested ordinary slurs.
- Beam rendering was limited to tuplets and rows made entirely of eighth notes.

## Fix

- Added a discriminated parenthesis stack and separate ordinary-slur start/end counts while keeping `groupSize` exclusive to `y` tuplets.
- Rendered ordinary short slurs with oracle-compatible double-curve geometry, including chained nested markers.
- Added mixed-row beam accumulation and isolated-note beam flushing.
- Rendered the two wide hold spans with `lianyinxian_zuo` and `lianyinxian_you` endpoint glyphs and connecting lines.

## Verification

- Ordinary slur event codes match oracle examples such as `7($`, `7$/)`, `7($)`, and `6(,`.
- Local `memory-from-cats.jps` output matches the oracle's four long-tie caps and two long-tie connector lines exactly.
- The remaining decoration differences are one ordinary-slur path and five of 121 duration beams; both depend on unresolved row spacing.
- `pnpm run parity:translate example-001-paipaizuo.jps`
- `pnpm run parity:translate example-002-sandumojin.jps`
- `pnpm exec tsc --noEmit`