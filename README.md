This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Verify the translator directly

To run the compiled translator script directly from the workspace:

```bash
npx tsc --pretty false --target es2020 --module commonjs --moduleResolution node --lib es2020,dom --skipLibCheck --esModuleInterop lib/translate.ts --outDir .tmp-verify
node .tmp-verify/translate.js
```

This uses the sample input from `input/cat.jps` and writes the generated SVG output for comparison with `out/cat.svg`.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.
