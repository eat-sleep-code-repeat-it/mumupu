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

## Verify public JPS fixtures

To verify every file in `public/jps-files/` against its same-named SVG fixture in `public/svg-files/` and confirm live-edit propagation:

```bash
pnpm verify:translate
```

This command fails when a public JPS file is missing a same-stem SVG fixture, when the expected SVG title does not match the JPS title, or when `translate()` does not reproduce the expected SVG exactly.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.
