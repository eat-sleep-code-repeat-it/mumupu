# Tianyi Punctuated Meter and Pagination

Date: 2026-09-01

## Symptoms

- `tianyi.jps` referenced a nonexistent `shuzi_b_bian_4·` glyph for `P: 3/4·`, omitting the denominator definition and producing the wrong glyph reference.
- Before the shared pagination fix, score rows after `[fenye]` were appended to the single-page SVG.
- The final pre-break row used a slightly compressed horizontal scale, and three coordinates differed by floating-point serialization.

## Root Cause

- Time-signature glyph IDs were built directly from the decorated header value instead of its numeric components.
- Paginated scores were parsed and rendered as one continuous page.
- Tianyi's dotted-meter pagination profile excludes 0.4 units from the final row's natural-width normalization denominator.

## Fix

- Normalize time-signature numerator and denominator glyph keys to digits while preserving the original header value.
- Reused full-document feature discovery with first-page-only score-row rendering and paginated natural-width layout.
- Added the dotted-meter row normalization correction and deterministic primary/general coordinate aliases.

## Verification

- `pnpm run parity:translate tianyi.jps` reports exact equality at 101986 bytes.
- `WaltzNo2.jps` and `muge.jps` remain byte-exact.
- `pnpm run verify:translate` reports 4 exact, 0 mismatched, and 0 missing caches.
- `pnpm run verify:songs` reports 38 checked, 34 exact, 4 mismatched, and 0 missing caches.
- `pnpm exec tsc --noEmit` passes.
- Oracle-cache SVGs remain validation-only; runtime output continues to use the local translator.
