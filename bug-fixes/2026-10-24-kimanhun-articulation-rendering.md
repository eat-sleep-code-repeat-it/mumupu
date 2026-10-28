# 金婚曲 articulation and trill rendering

Date: 2026-10-24

## Symptoms

- The viewer's rendering of `0004-金婚曲.jps` omitted notes and articulation marks present in its checked-in SVG reference.
- The three `&tr` trill marks were not rendered.

## Root cause

- The tokenizer treated articulation markers immediately before a pitch as part of one combined note token, losing note boundaries and deduplicating repeated marks.
- The event parser did not recognize `&tr` as an ornament.

## Fix

- Split supported articulation markers from subsequent pitches and attach markers after a closed bracket group to the preceding note.
- Parse `&tr` and render its trill glyph.
- Added a verifier regression check that compares the target song's glyph sequence with its reference SVG.

## Verification

- The target produces the same 421-glyph sequence as `0004-金婚曲.jps.svg`; all 120 `&dy` marks and 3 `&tr` ornaments are parsed.
- A pre-fix vs. updated-renderer comparison covered all 141 public JPS files. Only 7 outputs changed: the target, two scores with articulation markers between notes, and four scores with previously unparsed trill markers. The other 134 outputs were unchanged.
- `corepack pnpm exec tsc --noEmit` passes.
- `corepack pnpm exec eslint lib/translate.ts` reports no errors and two pre-existing unused-variable warnings.
- The four `jps-files` fixtures are unchanged compared with the pre-fix renderer. `verify:translate` still reports their pre-existing SVG serialization differences (line endings and self-closing versus explicit closing tags).
- `verify:songs` cannot complete because `public/songs/abc-examples.jps` is absent.
