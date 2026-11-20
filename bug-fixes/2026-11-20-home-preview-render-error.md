# Home preview render errors

- **Symptom:** Returning to Preview could show “Translation failed” even though no translation was requested.
- **Root cause:** Preview rendering failures used translation-specific wording, and the Preview action re-requested an unchanged score from the renderer.
- **Fix:** Reuse the rendered score when the script is unchanged and show renderer errors as preview failures, including the API's error detail.
- **Verification:** Browser check confirmed switching back to a cached preview makes no renderer request; a simulated renderer 502 displayed its actual error. ESLint and the production build passed.
