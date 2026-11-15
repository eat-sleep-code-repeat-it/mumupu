# Automatic script rule checking

- **Symptoms:** Script rule checks ran only after clicking the “Check rules” button, so edits did not immediately update the highlighted issues.
- **Root cause:** Rule results were stored as manually triggered state instead of being derived from the current script.
- **Fix:** Derive rule issues from the script text so highlights and the summary update whenever the script changes, and remove the redundant button.
- **Verification:** `pnpm run verify:accidental-rules`, `pnpm exec eslint app/viewer/page.tsx`, and `pnpm run build`.
