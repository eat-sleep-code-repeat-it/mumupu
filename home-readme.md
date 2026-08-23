# Home Page

The home page is the main JPS script editor and local SVG preview at `/`.

## What It Does

- Loads `public/jps-files/memory-from-cats.jps` into an editable text area on startup.
- Lists every `.jps` script under `public/songs` in a searchable sidebar.
- Clicking a song loads its content into the editor, returns to Script mode, and triggers automatic rendering.
- Renders the loaded script automatically and re-renders 400 ms after each editor change.
- **Script** returns from the preview to the JPS editor.
- **Preview** immediately renders the current editor text and displays the returned SVG.
- **Save** posts the current editor text to the same endpoint and downloads the returned SVG.
- Uses the first `B:` header value as the downloaded filename, with invalid filename characters replaced.

Automatic rendering prepares the latest preview without switching away from Script mode. Pending requests are aborted when the text changes, so an older response cannot replace a newer render. Translation failures appear in Preview mode without replacing the editor text.

The toolbar intentionally contains only **Save**, **Script**, and **Preview**. The former placeholder Open and Export controls were removed because they had no actions.

The song sidebar gets filenames from `/api/songs`. Song content is served from the matching public `/songs/<filename>` path; selecting a different file cancels any older pending file request.

## Rendering Path

Home automatic rendering, Preview, and Save always follow this path:

1. `app/home/page.tsx` sends the current JPS text to `/api/translate`.
2. `app/api/translate/route.ts` passes that text directly to `translate()`.
3. `lib/translate.ts` parses the submitted JPS and generates the SVG locally.
4. The generated SVG is returned to the browser for preview or download.

The home runtime must never return a cached or remotely generated SVG. This rule applies even when the submitted text exactly matches a known fixture.

## Validation Policy

Cached oracle SVGs are validation data only. They may be compared with local renderer output, but they must never become Home Preview, Save, or `/api/translate` output.

Validation uses:

- `pnpm run parity:translate <file.jps>` for a focused cached-oracle comparison.
- `pnpm run verify:translate` for public fixture checks.
- `pnpm run verify:songs` for a cache-only report across every `public/songs` JPS file.
- `pnpm exec tsc --noEmit` for TypeScript validation.
- Edited-input checks to confirm titles and notation changes propagate through the local renderer.

Checked-in oracle caches are preferred. A remote SVG may be obtained only when the required cache is unavailable, and only for validation. Remote output must never render on the home page.

## Current Renderer Status

- `example-001-paipaizuo.jps` matches its oracle byte-for-byte.
- `example-002-sandumojin.jps` matches its oracle byte-for-byte.
- `sandu-mojin.jps` matches its canonical cached oracle byte-for-byte.
- `memory-from-cats.jps` is rendered locally and supports live edits, but does not yet match its oracle byte-for-byte.
- Crescendo and diminuendo spans using `<`, `>`, and `!` render as local SVG lines; `+` vertical adjustment remains pending.

The remaining `memory-from-cats.jps` differences are primarily natural-width row spacing, one ordinary slur path, and five duration beams. These gaps are renderer TODOs; they are not bypassed with cached page output.

## Related Files

- `app/page.tsx`: root route wrapper.
- `app/home/page.tsx`: editor, preview, and save UI.
- `app/api/translate/route.ts`: local translation endpoint.
- `app/api/songs/route.ts`: JPS song filename listing.
- `lib/translate.ts`: JPS parser and SVG renderer.
- `scripts/check-jianpu-parity.mjs`: focused validation against cached oracle data.
- `scripts/verify-translate.mjs`: broader cached-oracle validation.
- `TODO.md`: unresolved renderer parity work.