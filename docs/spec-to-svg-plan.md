# Spec to SVG Preview Plan

## Goal

Build a real preview function that reads a `.jps` script and renders it into SVG, matching the intended behavior described in the spec while staying practical for this project.

This should be done as a focused refactor of the existing preview pipeline rather than a full app rewrite. The current UI flow in the app is already valid; the weak point is the rendering logic inside the translator.

## Progress status

- [x] Step 1: parse the JPS header and body into a structured model
- [x] Step 2: build a note model and prepare layout data
- [x] Step 3: render the first SVG staff preview
- [x] Step 4a: attach basic Chinese and English lyrics to melody notes
- [x] Step 4b-1: render measure separators and duration-aware note spacing
- [x] Step 4b-2a: preserve source structure in a semantic event stream
- [x] Step 4b-2b: replace text-note prototype with a first glyph-based score renderer
- [x] Step 4b-2c: replace font-dependent digit glyphs with vector paths
- [x] Step 4b-2d: add attached accidental, octave, dot, and temporary time-signature glyphs
- [x] Step 4b-2e: align generated glyph ids with the reference SVG vocabulary
- [x] Step 4b-3a: reserve structural widths and normalize rhythmic row timing
- [x] Step 4b-3b: add reference-positioned key, time-signature, tempo, and credit metadata
- [x] Step 4b-3c-1: calibrate temporary-signature width against the reference first row
- [ ] Step 4b-3c-2: calibrate every row and dynamic placement against reference coordinates
- [x] Step 4b-4a: render parenthesized groups as SVG tie/slur paths
- [x] Step 4b-4b: restore lyric alignment in the row-based glyph renderer
- [ ] Step 4b-4c: match exact hold, dotted-note, and reference glyph geometry
- [x] Step 4b-5a: verify TypeScript, focused lint, and production integration
- [ ] Step 4b-5b: verify visual parity against the reference SVG

## Reference SVG findings

The reference file is not a text rendering of the JPS source. It is a generated score document with a reusable glyph library and a layout pass that places each musical event at an exact coordinate.

Compared with the current renderer, the reference has these important properties:

- canvas size is `1000 x 1415`, not a short single staff
- reusable musical symbols live in `<defs>` and are placed with `<use>` elements
- note glyphs are selected by semantic ids such as `shuzi_b_0` through `shuzi_b_7`
- accidentals and key-signature symbols have their own glyphs
- holds use a dedicated `yanyinfu` glyph rather than displaying `-` as text
- measure bars use a dedicated `xiaojiexian` glyph
- temporary beat changes use separate numerator, divider, and denominator glyphs
- each placed event carries semantic attributes including `code`, `time`, `audio`, and `notepos`
- score rows have fixed y positions and are laid out independently across the page
- x positions are derived from rhythmic duration and measure width, then normalized to the available row width
- dynamics and annotations are placed as separate elements near the relevant measure or note
- title, key signature, time signatures, tempo, and credits each have distinct positions
- octave marks, accidentals, rests, dotted notes, and ties affect glyph selection and spacing

The current renderer is far from this because it uses one `<text>` element per note, a single staff, fixed y coordinates, approximate x increments, and no semantic distinction between notation symbols. Reaching the reference requires a renderer architecture change, not more CSS or small spacing tweaks.

## Visual parity implementation plan

### Phase A: establish a reference-driven score model

Status: semantic event stream and first vector glyph renderer are implemented in [lib/translate.ts](../lib/translate.ts); exact reference glyph geometry and full timing fidelity remain pending.

1. Parse every `Q:` line into ordered events while retaining all structural tokens instead of discarding `(`, `)`, `-`, `|`, and inline annotations.
2. Represent each event with `code`, `pitch`, `audio`, `time`, `durationMark`, `octave`, `accidental`, `annotation`, `measureIndex`, and `notepos`.
3. Treat standalone `-` tokens as hold events attached to the preceding note instead of independent notes.
4. Keep dynamics such as `p:6/4` as measure-level events and preserve their position in the source stream.
5. Parse repeated header fields such as both `Z:` credits instead of overwriting earlier values.

### Phase B: build a small glyph renderer

1. Add a controlled glyph table for the symbols required by the sample: digits, rests, hold marks, measure bars, accidentals, octave marks, dots, and temporary time signatures.
2. Use `<defs>` plus `<use>` in the generated SVG, matching the reference structure and avoiding a text fallback for core notation.
3. Keep glyph definitions isolated from layout so replacing a path with a better reference-compatible path does not change timing calculations.
4. Use text only for title, credits, tempo, dynamics, and lyrics.

### Phase C: reproduce the reference layout algorithm

1. Create one layout row per `Q:` line, with the same vertical rhythm as the reference.
2. Calculate event time from duration marks: full notes, half notes, holds, dotted notes, and rests must consume different widths.
3. Reserve fixed left and right row margins and normalize each row's event positions to the reference score width.
4. Place measure bars at measure boundaries, not at approximate token positions.
5. Place temporary time signatures immediately after their bar and dynamics at their source event position.
6. Increase the SVG height from the number of rows and add lyric rows without overlapping notation.

### Phase D: notation and lyrics

1. Render accidentals and octave marks as attached glyphs with the correct offsets.
2. Render `-` holds with `yanyinfu`-style symbols and preserve their timing.
3. Convert `(` and `)` groups into simple tie/slur paths between event coordinates.
4. Render dotted notes and special rhythmic markers as separate glyphs.
5. Align `C:` lyrics to the event timeline, including rests, `@`, `~`, English `/` boundaries, and multiple lyric rows.

### Phase E: verification

1. Add a deterministic script that renders `memory-from-cats.jps` to a generated SVG.
2. Compare structural metrics against the external Jianpu renderer output: dimensions, row count, event count, bar count, glyph categories, and key y positions.
3. Add visual review screenshots at the home-page preview size and full-page SVG size.
4. Keep the external renderer as a parity oracle only; do not return or proxy its SVG at runtime.

## Recommended next implementation slice

The next code change should implement Phase A, items 1 through 4: preserve structural tokens and produce a semantic event stream. Until that exists, glyph selection and reference-compatible timing cannot be implemented reliably.

## What the spec gives us

The spec files under `spec/` describe enough to support a working MVP renderer:

- header metadata (`V`, `B`, `Z`, `D`, `P`, `J`, `X`)
- music body with `Q:` and `C:` sections
- note values `1-7`, rests `0`, hidden rests `8`, rhythm note `9`
- octave indicators using `'` and `,`
- duration modifiers like `-` and `/`
- dotted notes using `.`
- accidentals `#`, `$`, `=`
- ties and slurs with `()`
- jumps and section markers with `[]`
- lyric alignment rules for Chinese and English text
- accompaniment and multi-part sections

This is sufficient to create a first-pass SVG preview for common melody-and-lyrics music notation.

## What the spec does not fully guarantee

The documentation is not a complete, formal grammar or layout specification. It includes a lot of visual examples and notes like “temporary workaround” and “manual adjustment recommended,” which means the renderer should be designed as a best-effort implementation rather than a 100% exact translator of every edge case.

Important practical limits:

- layout rules are partly illustrative, not fully algorithmic
- some special notation positions are described in images only
- several features are intentionally left for future implementation
- exact appearance depends on interpretation and renderer decisions

## Proposed architecture

### 0. Reuse the existing preview flow

Keep the current app structure intact:

- the Preview button in [app/home/page.tsx](../app/home/page.tsx)
- the POST API in [app/api/translate/route.ts](../app/api/translate/route.ts)
- the response contract returning SVG JSON

The project does not need a total rewrite. It only needs a better implementation of the JPS-to-SVG renderer in [lib/translate.ts](../lib/translate.ts).

### 1. Parse `.jps` input into structured data

Create a parser with these stages:

- normalize newlines and ignore blank/comment lines
- split into header and body
- parse header fields into a metadata object
- parse score lines into `Q` and `C` blocks
- tokenize note content while keeping punctuation and grouping marks

Suggested data model:

```ts
interface Header {
  V?: string;
  B?: string[];
  Z?: string[];
  D?: string;
  P?: string;
  J?: string;
  X?: string;
}

interface NoteToken {
  type: 'note' | 'rest' | 'symbol' | 'lyric';
  value: string;
  raw: string;
}

interface MelodyLine {
  kind: 'Q';
  part?: number;
  label?: string;
  tokens: NoteToken[];
}

interface LyricLine {
  kind: 'C';
  part?: number;
  text: string;
}
```

### 2. Convert tokens into musical objects

Map the raw script into semantic pieces such as:

- note pitch
- note duration
- octave
- accidental
- tie / slur group
- lyric attachment
- dynamic mark
- rest
- measure separator

This layer should isolate parsing from drawing.

### 3. Layout the score on an SVG canvas

The renderer should compute coordinates for:

- title and metadata text
- melody staff lines
- noteheads
- stems
- lyrics under notes
- measure separators
- dynamic marks and repeats
- multi-part overlays

Use a simple, deterministic layout model:

- fixed canvas width, e.g. `1000`
- left/right margins
- top offset for title and header
- per-line vertical rhythm
- x-position based on note order and measure grouping

### 4. Generate SVG markup

Render each musical element as SVG primitives:

- `<text>` for title and metadata
- `<line>` for staff lines
- `<circle>` or `<ellipse>` for noteheads
- `<line>` for stems
- `<path>` for slurs and ties
- `<text>` for lyrics
- `<g>` groups for measure-level elements

### 5. Expose a preview function

The app can use a single function such as:

```ts
export function renderJpsToSvg(input: string): string
```

This should return raw SVG markup to display in the browser.

## MVP scope

The first version should focus on the parts most likely to be useful and easy to verify:

1. Header metadata rendering
2. Basic melody parsing
3. `Q:` lines with notes and rests
4. `C:` lyric lines attached to notes
5. Common symbols: `1-7`, `0`, `8`, `9`, `-`, `/`, `.`, `#`, `$`, `=`
6. Simple tie representation
7. Measure separators
8. Title and tempo display

This is enough for a working preview that resembles a simple rendered score.

This should be implemented by replacing or refactoring the current logic inside [lib/translate.ts](../lib/translate.ts), not by rebuilding the app around it.

## Recommended implementation order

### Phase 1: parser and model

- parse header lines
- parse melody and lyric lines
- convert tokens into a structured score model

### Phase 2: text + metadata rendering

- render title and info block
- render metadata like tempo and key

### Phase 3: note rendering

- basic noteheads and stems
- rests and rhythmic markers
- octave and accidental handling

### Phase 4: lyrics and alignment

- map lyrics to melody positions
- render lyric text under or above notes
- handle simple Chinese and English cases

### Phase 5: advanced symbols

- slurs/ties
- repeats
- dynamics
- multi-part overlays
- manual adjustment markers such as `+`

## Risk areas

These parts need careful interpretation because the spec is not fully machine-formalized:

- custom beat splitting with `~` and `^`
- exact placement of dynamics and overlap adjustments
- jump markers and multi-line slurs
- multi-voice stacking and bracket placement
- hidden measure lines and voice alignment

These should be implemented conservatively in the first version and improved incrementally.

## Suggested rule for this project

Treat the spec as the source of syntax and musical intent, but implement a renderer that is pragmatic and visually consistent rather than a mathematically perfect transcription engine.

The goal is:

- parse what the spec clearly defines
- implement the common cases in a stable way
- leave advanced visual fidelity as future work

## Minimal acceptance criteria

The preview function should be considered successful when it can:

- accept raw `.jps` text
- parse a valid score structure
- convert the melody into SVG
- render title and metadata
- show notes and lyrics in a readable layout
- display in the browser without crashing on normal input

## Example implementation target

A likely project-level flow is:

```ts
const svg = renderJpsToSvg(text);
setSvg(svg);
setPreview(true);
```

This matches the current browser preview pattern already used in the app and keeps the renderer focused and testable.

## Final recommendation

The spec is strong enough to support a real preview renderer, especially for the common use case of single-voice or simple multi-part melody sheets. It is also enough to justify a targeted refactor of the current preview pipeline.

The easiest and lowest-risk path is:

- keep the current preview UI and API contract
- replace the simplistic SVG translator logic in [lib/translate.ts](../lib/translate.ts)
- add a proper parsing and layout layer on top of the existing flow
- expand the renderer incrementally as additional JPS features are needed

This is not a full app rewrite, and it is much easier than starting from zero. The current app already provides the right integration points; it just needs a better score renderer behind them.
