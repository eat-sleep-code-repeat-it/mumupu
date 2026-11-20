# Circle of fifths help sizing

- Symptoms: The circle-of-fifths graphic was oversized in the compact Help view, and staff graphics for A, E, and B major were clipped or crowded against the green wedges.
- Root cause: The SVG wrapper used too much of the available width, and the major ring extended into the staff graphics' inner edges.
- Fix: Reduced the wrapper maximum width to 448px, added 16px of padding, and inset the major ring while repositioning its labels and badges. Kept the staff graphics inside the outer ring.
- Verification: `pnpm exec eslint app/home/circle-of-fifths.tsx`, `git diff --check`, and browser inspection confirmed the A, E, and B graphics fit inside the circle with a visible gap from the wedges.
