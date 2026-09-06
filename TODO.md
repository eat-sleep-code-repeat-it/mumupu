# TODO

## Non-Negotiable Runtime Rules

- [x] Home Preview, Save, and `/api/translate` always render with the repository's own `translate()` implementation.
- [x] Cached and remote SVGs are validation-only and never become home-page output.
- [x] Prefer checked-in oracle caches; use a direct remote SVG only when a required cache is unavailable and only for validation.
- [x] Keep the separate jianpu page and `/api/jianpu` out of home-renderer work.

## Current Baseline

- [x] Confirm all four `public/jps-files` fixtures match their caches after CRLF/LF normalization.
- [ ] Normalize line endings in `verify:translate` or its caches so the command reports those four matches instead of differences beginning at byte 190.
- [ ] Restore `pnpm verify:songs`; it currently stops because `abc-examples.jps` moved to `public/abc-spec` while the verifier still expects it under `public/songs`.
- [x] Recalculate the current normalized song baseline: 38 checked, 36 exact, and 2 mismatched (`hejiayi-barcarolle.jps` and `ren-jian-gong-ming-bB.jps`).
- [x] Focused and broad validation scripts read local oracle caches without rendering those caches in the app.
- [x] Lessons 07 and 09 match their supplied oracle note/bar coordinates; lesson 15 reported rows 1-4 and 7 match and contain no non-finite coordinates.

## Phase 1: Home Automatic Rendering

- [x] Render the initial script automatically after it loads.
- [x] Re-render automatically after editor changes with a short debounce.
- [x] Cancel or ignore stale in-flight render responses.
- [x] Keep Script and Preview controls usable; automatic rendering must not force the user out of Script mode.
- [x] Save must render the current editor text before downloading.
- [x] Show a useful rendering error without replacing the current script.
- [x] Verify that unchanged and edited scripts both use local `/api/translate` output.

## Phase 2: Validation and Song Inventory

- [x] Add a cache-only song parity command that checks every `public/songs/*.jps` fixture.
- [x] Resolve canonical and legacy cache names without using stale aliases when an identical canonical fixture exists.
- [x] Report exact matches, mismatches, missing caches, local/cache lengths, and first differing byte.
- [x] Cluster song mismatches by notation feature instead of fixing files one at a time.
- [x] Keep exact fixtures as regression checks after every renderer change.

## Phase 3: Description Header Rules (`spec/02-描述头.md`)

- [x] Parse comments and `V:`, repeated `B:`, repeated `Z:`, `D:`, `P:`, `J:`, and `X:` fields.
- [x] Render primary/secondary titles, credits, key signature, time signatures, and tempo text.
- [x] Render sharp/flat key spellings and fixture-verified accidental-key header positioning.
- [x] Render multiple comma-separated time signatures, including the three-signature `memory-from-cats.jps` header.
- [ ] Parse and render the spec's space-separated, parenthesized auxiliary time signatures.
- [ ] Determine and implement the visible behavior of `X:` where required by cached output.

## Phase 4: Core Melody Rules (`spec/03-曲部分.md`)

- [x] Notes `1-7`, rests `0`, hidden rests `8`, holds `-`, octave marks, accidentals, dots, and slash durations.
- [x] Rhythm note `9` rendered as `X` with rhythmic duration and no pitch audio.
- [x] Custom beat joins `~` and forced splits `^`.
- [x] Parse and visibly render song dynamics `&p`, `&pp`, `&mp`, `&mf`, `&f`, and `&rit` with oracle-compatible note metadata and placement.
- [x] Replace dynamics text with exact locally owned path glyphs and oracle-compatible definition ordering.
- [x] Crescendo/diminuendo spans `<`, `>`, and `!`.
- [x] Hairpin `+` vertical adjustments.
- [x] Front grace notes `[...]` and rear grace notes `[h...]` with pitch, octave, accidental, and duration marks.
- [x] Accompaniment brackets `&zkh` and `&ykh`.
- [ ] All documented bar and repeat forms.
- [x] Standalone note annotations and bar-attached temporary meter annotations.
- [ ] Other documented bar annotations not represented by current fixtures.
- [x] Hidden bars `|/` and `|*`.
- [x] Temporary meter parsing and glyph rendering.

## Phase 5: Slurs, Tuplets, Form, and Pagination

- [x] Ordinary parenthesized slurs.
- [x] `y` tuplets with three- and four-note labels.
- [x] Five-note tuplets with oracle-compatible labels, timing, beams, and spacing.
- [x] Parse `y` tuplet group sizes from their enclosed note count and render the shared grouped curve/spacing path.
- [ ] Add labels, timing, and verified beam behavior for tuplet sizes beyond five notes.
- [x] Nested slurs without lost or extra paths in covered fixtures.
- [x] Cross-measure and cross-row slur continuation.
- [x] Split slurs attached to bar lines.
- [x] Repeat endings/jump houses using `[` and `]`, including wrapped endings and represented modifiers.
- [x] Manual `[fenye]` page breaks with first-page-only SVG rendering.
- [ ] True multi-page SVG output or an explicit multi-page export contract.

## Phase 6: Accompaniment and Multi-Voice

- [ ] Temporary accompaniment `{bz ...}` aligned above the main melody.
- [ ] Temporary multi-voice `{dsb ...}`.
- [ ] Numbered melody and lyric lines such as `Q1:`, `Q2:`, `C1:`, and `C2:`.
- [ ] Voice names declared after numbered line markers.
- [ ] Mixed single-voice and multi-voice rows.
- [ ] Voice-bracket placement marker `&sbf`.
- [x] Hidden alignment primitives `8` and `|*` consume layout space without drawing note/bar glyphs.
- [ ] Integrate `8` and `|*` fillers into numbered multi-voice row alignment.

## Phase 7: Lyrics (`spec/04-歌词部分.md`)

- [x] Basic Chinese lyric-to-note alignment and punctuation handling.
- [x] Skip marker `@`, joined characters `~`, underscore spaces, and English `/` separators.
- [x] Render multiple `C:` lines attached to one `Q:` line.
- [ ] Render lyric annotations before lyric text with underscore-to-space conversion.
- [ ] Validate mixed Chinese/English alignment across song fixtures.
- [x] Ensure holds do not consume lyric units; lyric indices advance only in the note-rendering branch.

## Phase 8: Layout and SVG Serialization

- [x] Use the oracle-compatible natural-width and justification model for covered regular, grouped, annotated, and paginated fixtures.
- [x] Reserve fixture-verified width for accidentals, octave marks, dots, annotations, slur boundaries, bars, grace notes, accompaniment brackets, and temporary meters.
- [ ] Replace remaining title/row compatibility transfers with general notation rules where the oracle behavior can be inferred.
- [x] Finish `memory-from-cats.jps`, including natural-width coordinates, beam/slur structure, metadata, layering, and SVG serialization.
- [x] Derive mixed-row beam grouping from beat boundaries and notation boundaries present in current fixtures.
- [x] Add `~`/`^` beam grouping overrides.
- [x] Match glyph definition selection and ordering for covered fixtures.
- [x] Match notation element layering and SVG number formatting for covered fixtures.
- [x] Preserve byte-perfect grouped and simple fixtures throughout the layout rewrite.

## Phase 9: Song Parity Closure

- [x] Run the complete cache-only song parity report after every feature cluster.
- [x] Fix the highest-frequency mismatch cluster first.
- [x] Add a concise bug-fix record for each resolved root cause.
- [x] Reach the historical 39/39 byte-for-byte cached-song milestone.
- [ ] Restore 38/38 normalized parity for the current song inventory, then repair `verify:songs` so it enforces that baseline.
- [ ] Document any spec ambiguity that cannot be inferred from the text or cached fixtures.

Historical baseline: the renderer previously reached 39/39 cached song parity. The current normalized baseline is 36/38; `verify:songs` is additionally blocked by the moved `abc-examples.jps` fixture.

## Active Order

1. Repair the fixture paths and re-establish a current cache-only parity baseline for `public/jps-files` and `public/songs`.
2. Preserve the re-established baseline while replacing score-specific spacing transfers with general notation rules.
3. Implement the remaining header, bar, multi-voice, lyric, and multi-page features with focused fixtures.
4. Resolve or document specification ambiguities that are not represented by current caches.
