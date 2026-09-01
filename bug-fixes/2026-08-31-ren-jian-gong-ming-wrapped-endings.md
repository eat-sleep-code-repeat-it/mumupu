# Ren Jian Gong Ming Wrapped Endings and Beams

Date: 2026-08-31

## Symptoms

- `ren-jian-gong-ming.jps` used incorrect natural widths for accompaniment-bracket rows, repeated sixteenth passages, dotted-rest transitions, and triple-slash notation.
- The first jump-house ending disappeared when it crossed a score-row boundary, and the second ending started at the wrong coordinate.
- Triple-slash and dotted-rest passages merged duration beams that the oracle split into beat-local groups.
- Matching geometry retained several floating-point serialization differences.

## Root Cause

- Accompaniment spacing was inferred from each rendered row instead of from score-level parsed features.
- Jump-house state was recreated for every score row, so an open ending could not survive into the next row.
- Natural-width and beam progress treated `///` differently from the oracle and did not share dotted-rest ownership rules.
- Generic number formatting did not preserve the oracle's contextual rounding at several note, lyric, beam, and ending coordinates.

## Fix

- Propagate ornament-aware accompaniment spacing through natural-width calculation and scope slur, beat, dotted-pair, and repeated-eighth clearance rules to it.
- Persist jump-house state across rows and render wrapped endings as a closing cap on the source row plus a continuation cap on the destination row.
- Clamp ungrouped accompaniment `///` spacing and beam progress to a sixteenth while preserving its `0.125` event time, add the tertiary beam, and split dotted-rest repeated-eighth beams at their oracle owners.
- Normalize the remaining coordinates with contextual formatter mappings, including the collision with `047-keketuodemuyangren.jps`.

## Verification

- `ren-jian-gong-ming.jps` is byte-exact against its 178578-byte cached oracle.
- `047-keketuodemuyangren.jps`, `ganlanshu.jps`, `xiyangyang.jps`, and `sometime-when-it-rains.jps` remain byte-exact.
- `pnpm run verify:translate` reports 4 exact focused fixtures.
- `pnpm exec tsc --noEmit` passes.
- `pnpm run verify:songs` reports 38 checked, 22 exact, 16 mismatched, and 0 missing caches; it exits nonzero because the 16 known mismatches remain.