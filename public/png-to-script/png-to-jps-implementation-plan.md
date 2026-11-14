# PNG-to-JPS implementation plan

## Goal

Implement a `/png-to-jps` page where a user selects and previews a PNG score
image, clicks **Parse PNG**, and sees the generated JPS on the same page. A
server-side function recognizes Jianpu (numbered-notation) content and writes a
corresponding `.jps` file to
`public/png-to-script/png-scripts/<input-base-name>.jps`. The output must use
the JPS syntax already consumed by the project's local `translate()` renderer.

## Target input scope

- Clean digital Jianpu PNGs from different sources and renderers.
- Printed Jianpu scores that have been scanned or photographed, including
  moderate skew, scale changes, and uneven lighting.
- Handwritten notation is out of scope for the initial implementation.

The recognizer must not assume that an input image was produced by this
project's renderer. The renderer is useful for understanding JPS semantics and
generating supplemental labeled examples, but source diversity is required to
validate general recognition.

## Implemented

- Added the `/png-to-jps` page with an **Open PNG** picker, image preview, and
  **Parse PNG** button.
- Added a server Route Handler and conversion function using Tesseract.js. The
  image is processed by the app's local OCR worker, not uploaded to an OCR
  service. Tesseract.js may download its English language model on a cold cache.
- Validated PNG signatures and a 10 MB size limit. Parsed scripts are named
  after the input and saved under
  `public/png-to-script/png-scripts/<input-base-name>.jps`.
- Displayed the JPS draft, output path, and OCR warnings on the same page.
- Validated generated JPS with the project's `parseJpsEvents()` and
  `translate()` functions.

## Current recognition limits

Tesseract.js is general-purpose text OCR, not a Jianpu-trained model. The PNG
is upscaled 2x, converted to grayscale, and normalized before OCR; automatic
page segmentation and a Jianpu-oriented character whitelist are used. On the
provided score image, this configuration returned 37% Tesseract confidence,
but the generated JPS is not usable. The expected file contains song metadata
and 11 score rows; the generated file has only a filename header and 9
imperfect rows. It loses or corrupts bar boundaries, accidentals, octave marks,
rhythm marks, and grouping. The whitelist also prevents recognition of the
Chinese title and metadata. The current filter strips `8` and `9` characters
globally instead of removing measure-number annotations as complete tokens.

An earlier comparison reported 83.9% digit-only alignment. That is not a
reliable measure of note accuracy: it ignores JPS symbols and layout, and
matching digit strings does not establish that the recognized digits are
correctly aligned to musical notes. Do not use that figure to characterize
transcription quality. The 37% Tesseract confidence is likewise not a measure
of musical accuracy.

## Follow-up plan

1. Build a verified fixture set spanning multiple digital Jianpu sources and
   printed scans/photos, each paired with a manually checked JPS transcription.
   The one supplied pair is a starting point, not enough to claim generality.
2. Detect and deskew score regions, rows, measures, and notation components;
   recognize note glyphs together with nearby accidentals, octave marks,
   rhythm, grouping, and bar boundaries.
3. Use the existing JPS parser/renderer to validate and supplement recognition,
   without assuming their SVG style matches every input source.
4. Recognize metadata and measure annotations separately from score notation;
   preserve spatial grouping and never strip individual characters globally.
5. Measure full-token, row, and metadata accuracy on held-out sources before
   presenting generated output as usable. Keep uncertain results explicit and
   avoid inventing tempo, key, lyrics, or other musical metadata.

## Verification

- `pnpm verify:png-to-jps`
- `pnpm exec tsc --noEmit`
- `pnpm exec eslint app/png-to-jps/page.tsx app/api/png-to-jps/route.ts lib/png-to-jps.ts scripts/verify-png-to-jps.mjs`
- `pnpm build`
- Production smoke test: `/png-to-jps` returned HTTP 200 and multipart PNG parsing
  returned HTTP 200 with a saved JPS file.

The full lint command also completed with no errors and two existing unused
variable warnings in `lib/translate.ts`.
