# Londonderry Hanshan Cross-Measure Slurs

Date: 2026-08-31

## Symptoms

- `Londonderry-hanshan.jps` used compressed natural-width rows around long phrases spanning multiple measures and score rows.
- Primary notes aligned after spacing correction, but cross-row slurs lacked incoming segments and long cap heights differed by register and nesting context.
- Shared note, beam, and octave-marker coordinates retained context-dependent eleventh-decimal differences.

## Root Cause

- Active-slur bar, high-octave, and flat-descent clearance was duplicated inside multi-bar and carried slur spans.
- Row-closing bars inherited internal cross-bar clearance, and high repeated-note openers inherited lower-register nested-slur spacing.
- Ordinary cross-row slurs emitted only their opening-row segment.
- Long slur caps used maximum interior octave instead of opening register, nesting, and closing-register context.
- Beam and octave-marker serialization did not preserve the audible or muted note coordinate context.

## Fix

- Track multi-bar and carried slur spans and suppress duplicate spacing only within those spans.
- Exclude row-closing bars from internal slur clearance and restrict post-double-close spacing to non-high registers.
- Emit positive-width incoming cross-row segments for non-FixedDo slurs.
- Compute multi-bar cap clearance from opening register, nested-parent state, and cross-row octave change while preserving FixedDo behavior.
- Reuse note serialization for directly anchored octave markers and carry audible beam-start context into coordinate formatting.

## Verification

- `Londonderry-hanshan.jps` is byte-exact against its 84052-byte cached oracle.
- `LondonderryAir.jps`, `hejiayi-G-string-original.jps`, `sometime-when-it-rains.jps`, and `sometime-when-it-rains-FixedDoHK.jps` remain byte-exact.
- `pnpm run verify:translate` reports 4 exact focused fixtures, and `pnpm exec tsc --noEmit` passes.
- `pnpm run verify:songs` reports 19 exact, 19 mismatched, and 0 missing caches; it exits nonzero because the 19 known mismatches remain.
- `lib/translate.ts` has no editor diagnostics.