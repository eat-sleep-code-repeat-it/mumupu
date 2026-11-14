# PNG-to-JPS implementation plan

## Goal

Implement a `/png-to-jps` page where a user selects and previews a PNG score
image, clicks **Parse PNG**, and sees the generated JPS on the same page. A
server-side function recognizes Jianpu (numbered-notation) content and writes a
corresponding `.jps` file to
`public/png-to-script/png-scripts/<input-base-name>.jps`. The output must use
the JPS syntax already consumed by the project's local `translate()` renderer.

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

Tesseract.js is general-purpose text OCR, not a Jianpu-trained model. On the
provided score image it returned 30% confidence; the output is a rough draft
and may contain incorrect or missing notes, accidentals, octave marks, and
rhythm. The page warns users to review the transcription. Do not treat this
version as reliable sheet-music transcription.

## Follow-up plan

1. Evaluate Jianpu-specific image recognition or computer-vision methods that
   can identify note glyphs and their spatial/rhythmic marks.
2. Preprocess and segment score rows/measures, then recognize notes, accidentals,
   octave marks, rests, duration marks, and grouping without dropping layout.
3. Add manually verified image/JPS fixtures and measure note-order and symbol
   accuracy before presenting recognition as more than a draft.
4. Keep ambiguous input explicit and avoid inventing tempo, key, lyrics, or
   other musical metadata.

## Verification

- `pnpm verify:png-to-jps`
- `pnpm exec tsc --noEmit`
- `pnpm exec eslint app/png-to-jps/page.tsx app/api/png-to-jps/route.ts lib/png-to-jps.ts scripts/verify-png-to-jps.mjs`
- `pnpm build`
- Production smoke test: `/png-to-jps` returned HTTP 200 and multipart PNG parsing
  returned HTTP 200 with a saved JPS file.

The full lint command also completed with no errors and two existing unused
variable warnings in `lib/translate.ts`.
