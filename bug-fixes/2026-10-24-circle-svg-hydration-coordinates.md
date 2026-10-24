# Circle SVG hydration coordinate stability

- Symptoms: React reported server/client SVG attribute mismatches during hydration.
- Root cause: Trigonometric coordinates were emitted at full floating-point precision, which can vary slightly between server and browser runtimes.
- Fix: Round generated SVG coordinates to three decimal places before rendering.
- Verification: ESLint and `tsc --noEmit` passed; confirm in the browser that the hydration warning is gone.
