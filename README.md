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