# Mumu pu

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Pages

- `/` is the score viewer.
- `/create` is where you can create or import a script.
- `/help` contains the key-signature reference and circle of fifths.

The previous `/edit`, `/view`, `/home`, and `/viewer` URLs redirect to their current routes.

## Import MusicXML

On `/create`, **Import** accepts `.jps`, `.txt`, `.musicxml`, `.xml`, and compressed `.mxl` files. MusicXML files are converted to Jianpu99 JPS and loaded into the script editor. The converter follows the project's Python converter behavior and uses staff 1.

In Script view, **Export MusicXML** downloads a `.musicxml` score. It exports notes, rests, durations, key and time signatures, tempo, dynamics, hairpins, grace notes, fermatas, trills, accompaniment brackets, barlines, ties, slurs, and 3:2 tuplets. Unsupported JPS notation and lyrics are reported instead of silently discarded.

Run the converter checks with:

```bash
pnpm verify:musicxml
```

## Verify public JPS parity

To verify every file in `public/jps-files/` against the external Jianpu renderer oracle and confirm live-edit propagation:

```bash
pnpm verify:translate
```

This command fails when `translate()` does not match the external oracle output or when live edits stop propagating through the local renderer.

## External parity check

To compare the local translator with the external Jianpu renderer for a specific public JPS file without using that renderer at runtime:

```bash
pnpm parity:translate memory-from-cats.jps
```

This command is for parity checking only. The app preview and save flows render locally through `translate()`.

## Transpose workflow

You can transpose Zhipu/JPS note scripts by semitone adjustment either from CLI or from the zhipu page.

### CLI usage

```bash
# Print transposed result to stdout
pnpm transpose -- -a -1 -i public/songs/Londonderry.jps

# Save transposed result to file
pnpm transpose -- -a 1 -i public/songs/Londonderry.jps -o out.jps
```

### API usage

`POST /api/transpose`

Request body:

```json
{
	"script": "...jps content...",
	"adjustment": -1
}
```

Response body:

```json
{
	"script": "...transposed jps content..."
}
```

### zhipu page usage

Open `/zhipu`, input a transpose number such as `-1` or `1`, then click `Transpose` to replace the current script with the transposed result.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

### other tools

- https://github.com/flufy3d/JianpuRender