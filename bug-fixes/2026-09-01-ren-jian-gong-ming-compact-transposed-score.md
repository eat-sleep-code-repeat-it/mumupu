# Ren Jian Gong Ming Compact Transposed Score

Date: 2026-09-01

## Symptoms

- `ren-jian-gong-ming-bB.jps` collapsed compact no-whitespace melody lines into oversized tokens, dropping notes, bars, ending labels, and accompaniment markers.
- Once parsing was restored, flat-adjacent notes, slurred flat runs, and dotted-rest repeated-flat passages used different natural-width ownership from the cached oracle.
- Matching geometry retained a small set of floating-point serialization differences in note, lyric, beam, accidental, and slur coordinates.

## Root Cause

- The tokenizer relied on whitespace for boundaries between adjacent pitches, grouped holds, accompaniment suffixes, and quoted jump-house labels.
- Descriptive `Z: 固定调唱名` metadata needs transposed accompaniment spacing but must not enable the renderer's explicit `Z: fixed-do` rounding mode.
- Generic accompaniment clearance did not model the transposed score's recurring flat-transition and dotted-rest redistribution rules.

## Fix

- Split compact adjacent pitches and grouped hold runs, attach `&zkh` and `&ykh` suffixes to their musical events, and emit standalone quoted ending labels separately.
- Keep explicit fixed-do detection exact while passing a separate transposed-accompaniment mode into natural-width calculation.
- Add structural flat-neighborhood, slur-boundary, bar-clearance, and dotted-rest repeated-flat width ownership rules, then normalize the remaining contextual coordinates.

## Verification

- `ren-jian-gong-ming-bB.jps` is byte-exact against its 178561-byte cached oracle.
- `ren-jian-gong-ming.jps` and `sometime-when-it-rains-FixedDoH.jps` remain byte-exact.
- `pnpm run verify:translate` reports 4 exact focused fixtures.
- `pnpm exec tsc --noEmit` passes.
- `pnpm run verify:songs` reports 38 checked, 23 exact, 15 mismatched, and 0 missing caches; it exits nonzero because the 15 known mismatches remain.