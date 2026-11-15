# Cross-bar bracket rule checking

- **Symptoms:** The viewer's rule checker reported paired square brackets as mismatched when they crossed a barline or another bracket pair.
- **Root cause:** Bracket validation required all bracket types to be properly nested in one shared stack.
- **Fix:** Match closing brackets with the most recent opener of the same type, allowing paired brackets to cross barlines, lines, and other bracket types while still reporting missing or mismatched delimiters.
- **Verification:** `pnpm run verify:accidental-rules` covers the supplied cross-bar example, cross-line square brackets, and existing unmatched-bracket cases.
