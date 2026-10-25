# Song verifier fixture path and SVG normalization

Date: 2026-10-24

## Symptoms

- `verify:songs` stopped before its custom-beat checks because `abc-examples.jps` had moved from `public/songs` to `public/abc-spec`.
- Primary and song parity checks reported mismatches at byte 190, although the differences were only line endings and equivalent empty SVG element serialization.

## Root cause

- The custom-beat regression check hard-coded the old song fixture directory.
- Parity compared generated and cached SVG strings byte-for-byte without normalizing CRLF/LF or self-closing empty elements.

## Fix

- Resolve the custom-beat fixture from `public/songs` or its current `public/abc-spec` location.
- Normalize line endings and equivalent empty-element serialization before comparing output to cached SVGs.
- Update the TODO baseline to distinguish restored verifier coverage from the two remaining song-rendering mismatches.

## Verification

- `corepack pnpm run verify:translate`: 4/4 parity matches; live-edit check passes.
- `corepack pnpm run verify:songs`: custom-beat checks execute; 36/38 parity matches, with the known `hejiayi-barcarolle.jps` and `ren-jian-gong-ming-bB.jps` mismatches.
- `corepack pnpm exec tsc --noEmit` passes.
- `corepack pnpm exec eslint scripts/verify-translate.mjs` passes.
