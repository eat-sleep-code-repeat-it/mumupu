# Editor caret alignment

- **Symptoms:** Near the bottom of a long script, the visible text overlay stopped scrolling with the textarea, so the caret appeared beside a different note than the one being edited.
- **Root cause:** The overlay had less scrollable height than the textarea, and its scroll position was clamped before it could follow the textarea.
- **Fix:** Add hidden bottom padding to the overlay so its scroll range covers the textarea's full scroll range.
- **Verification:** Confirm the overlay and textarea reach the same scroll position at the bottom of the selected 32-line script; run `pnpm exec eslint app/viewer/page.tsx`.
