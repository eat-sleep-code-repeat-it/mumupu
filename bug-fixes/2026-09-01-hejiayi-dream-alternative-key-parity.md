# Hejiayi Dream Alternative Key Parity

Date: 2026-09-01

## Symptoms

- `hejiayi-dream-AlternativeKey.jps` had matching score-event counts but differed from its cached SVG in note codes, natural-width ownership, repeated-note audio, dynamic placement, hairpin clearance, and final decimal serialization.
- A standalone hairpin after a slur close attached the pending slur opening to the following note.
- Dynamic-before-duration syntax such as `(2,&pp/)` serialized in normalized rather than source order.

## Root Cause

- Standalone hairpins did not transfer a pending slur opening to the preceding closing note.
- Token metadata did not preserve whether an attached dynamic preceded the duration suffix.
- The sustained-ornament transposed profile lacked contextual bar, accidental, slur, and final-hold width rules.
- Unmatched closing parentheses did not silence same-pitch repeated notes, and expression geometry did not account for closing slur depth or sustained-ornament hairpin clearance.
- Shared floating-point coordinates required profile-scoped serialization to avoid changing existing FixedDo fixtures.

## Fix

- Transferred pending slur ownership across standalone hairpins and preserved dynamic-before-duration code order.
- Added sustained transposed-profile natural-width ownership for bars, accidental transitions, slur closures, octave descents, and the final hold.
- Treated unmatched closing parentheses on repeated notes as silent continuations.
- Positioned closing-note dynamics by active slur depth and raised sustained transposed hairpins to the oracle clearance.
- Added contextual coordinate normalization without changing cached/reference SVG runtime policy.

## Verification

- `pnpm run parity:translate hejiayi-dream-AlternativeKey.jps` reports exact equality at 88590 bytes.
- `pnpm run verify:translate` reports 4 exact, 0 mismatched, and 0 missing caches.
- `pnpm run verify:songs` reports 38 checked, 28 exact, 10 mismatched, and 0 missing caches.
- `huangwensheng-G-string.jps`, `hongyan.jps`, `ganlanshu.jps`, both Haydn fixtures, `ren-jian-gong-ming-bB.jps`, `sometime-when-it-rains-FixedDo.jps`, and `sometime-when-it-rains-FixedDoHK.jps` remain byte-exact.
- `pnpm exec tsc --noEmit` and VS Code diagnostics pass.
