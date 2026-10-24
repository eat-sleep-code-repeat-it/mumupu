# Circle of fifths hidden-signature layout

- Symptoms: Hiding key signatures left the gray staff band visible and the wheel remained in its signature-enabled proportions.
- Root cause: The toggle only controlled staff glyph rendering; ring geometry and labels were static.
- Fix: Hide the segmented staff band and expand/reposition the major and minor rings and labels when signatures are off.
- Verification: `eslint app/home/circle-of-fifths.tsx` and `tsc --noEmit`.
