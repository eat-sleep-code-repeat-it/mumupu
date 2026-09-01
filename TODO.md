# TODO

## Non-Negotiable Runtime Rules

- [x] Home Preview, Save, and `/api/translate` always render with the repository's own `translate()` implementation.
- [x] Cached and remote SVGs are validation-only and never become home-page output.
- [x] Prefer checked-in oracle caches; use a direct remote SVG only when a required cache is unavailable and only for validation.
- [x] Keep the separate jianpu page and `/api/jianpu` out of home-renderer work.

## Current Baseline

- [x] `example-001-paipaizuo.jps` matches its cached oracle byte-for-byte.
- [x] `example-002-sandumojin.jps` matches its cached oracle byte-for-byte.
- [x] `sandu-mojin.jps` matches its canonical cached oracle byte-for-byte.
- [x] `memory-from-cats.jps` matches its cached oracle byte-for-byte.
- [ ] Every JPS file under `public/songs` matches its corresponding cached SVG.
- [x] Focused and broad validation scripts read local oracle caches without rendering those caches in the app.

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
- [ ] Cluster song mismatches by notation feature instead of fixing files one at a time.
- [x] Keep exact fixtures as regression checks after every renderer change.
- [ ] If a cache is missing, obtain a remote SVG only for validation and never return it from application code.

## Phase 3: Description Header Rules (`spec/02-描述头.md`)

- [x] Parse comments and `V:`, repeated `B:`, repeated `Z:`, `D:`, `P:`, `J:`, and `X:` fields.
- [x] Render primary/secondary titles, credits, key signature, time signatures, and tempo text.
- [ ] Validate sharp/flat key spellings against song fixtures.
- [ ] Support the spec's multiple and parenthesized auxiliary time signatures.
- [ ] Determine and implement the visible behavior of `X:` where required by cached output.

## Phase 4: Core Melody Rules (`spec/03-曲部分.md`)

- [x] Notes `1-7`, rests `0`, hidden rests `8`, holds `-`, octave marks, accidentals, dots, and slash durations.
- [ ] Rhythm note `9`.
- [ ] Custom beat joins `~` and forced splits `^`.
- [x] Parse and visibly render song dynamics `&p`, `&pp`, `&mp`, `&mf`, `&f`, and `&rit` with oracle-compatible note metadata and placement.
- [ ] Replace dynamics text with exact locally owned path glyphs and oracle-compatible definition ordering.
- [x] Crescendo/diminuendo spans `<`, `>`, and `!`.
- [ ] Hairpin `+` vertical adjustments.
- [ ] Front grace notes `[...]` and rear grace notes `[h...]` with pitch, octave, accidental, and duration marks.
- [ ] Accompaniment brackets `&zkh` and `&ykh`.
- [ ] All documented bar and repeat forms.
- [ ] Bar annotations other than temporary meter `p:x/x`.
- [x] Hidden bars `|/` and `|*`.
- [x] Temporary meter parsing and glyph rendering.

## Phase 5: Slurs, Tuplets, Form, and Pagination

- [x] Ordinary parenthesized slurs.
- [x] `y` tuplets with three- and four-note labels.
- [ ] Arbitrary tuplet sizes using oracle-compatible labels and spacing.
- [ ] Nested slurs without lost or extra paths.
- [ ] Cross-measure and cross-row slur continuation.
- [ ] Split slurs attached to bar lines.
- [ ] Repeat endings/jump houses using `[` and `]`, including `/` and `+` modifiers.
- [ ] Manual `[fenye]` page breaks and multi-page output handling.

## Phase 6: Accompaniment and Multi-Voice

- [ ] Temporary accompaniment `{bz ...}` aligned above the main melody.
- [ ] Temporary multi-voice `{dsb ...}`.
- [ ] Numbered melody and lyric lines such as `Q1:`, `Q2:`, `C1:`, and `C2:`.
- [ ] Voice names declared after numbered line markers.
- [ ] Mixed single-voice and multi-voice rows.
- [ ] Voice-bracket placement marker `&sbf`.
- [ ] Alignment fillers using `8` and `|*`.

## Phase 7: Lyrics (`spec/04-歌词部分.md`)

- [x] Basic Chinese lyric-to-note alignment and punctuation handling.
- [x] Skip marker `@`, joined characters `~`, underscore spaces, and English `/` separators.
- [x] Render multiple `C:` lines attached to one `Q:` line.
- [ ] Render lyric annotations before lyric text with underscore-to-space conversion.
- [ ] Validate mixed Chinese/English alignment across song fixtures.
- [ ] Validate that holds do not consume lyric units.

## Phase 8: Layout and SVG Serialization

- [ ] Replace approximate regular-row spacing with the oracle's natural-width and justification model.
- [ ] Reserve exact width for accidentals, octave marks, dots, annotations, slur boundaries, bars, and temporary meters.
- [x] Finish `memory-from-cats.jps`, including natural-width coordinates, beam/slur structure, metadata, layering, and SVG serialization.
- [x] Derive mixed-row beam grouping from beat boundaries and notation boundaries present in current fixtures.
- [ ] Add `~`/`^` beam grouping overrides.
- [ ] Match glyph definition selection and ordering.
- [ ] Match notation element layering and SVG number formatting.
- [x] Preserve byte-perfect grouped and simple fixtures throughout the layout rewrite.

## Phase 9: Song Parity Closure

- [ ] Run the complete cache-only song parity report after every feature cluster.
- [ ] Fix the highest-frequency mismatch cluster first.
- [ ] Add a concise bug-fix record for each resolved root cause.
- [ ] Reach byte-for-byte equality for every song with a corresponding cached SVG.
- [ ] Document any spec ambiguity that cannot be inferred from the text or cached fixtures.

Current verified baseline: 38 songs checked, 13 exact, 25 mismatched, and 0 missing caches. The exact song fixtures are `sandu-mojin.jps` through its canonical content-identical cache, `baihualin.jps`, `Londonderry.jps`, `LondonderryAir.jps`, `always-zhoushen.jps`, `047-keketuodemuyangren.jps`, `ganlanshu-qiyu.jps`, `hejiayi-F-Swan-lake.jps`, `hejiayi-F-Swan-lake-alternativekeys.jps`, `hejiayi-swan-shengsan.jps`, `hejiayi-G-string-original.jps`, `hejiayi-G-string-alternativeKeys.jps`, and `hejiayi-G-string-alternativeKeys2.jps`.

## Active Order

1. Implement debounced automatic home rendering using local `/api/translate`.
2. Add a song-wide cached parity report.
3. Re-run and cluster song failures by syntax feature.
4. Implement the highest-frequency parser/rendering gap with one focused fixture check.
5. Continue cluster by cluster until all cached song fixtures match.
