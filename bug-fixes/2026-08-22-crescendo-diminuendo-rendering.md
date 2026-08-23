# Crescendo and Diminuendo Rendering

Date: 2026-08-22

## Symptoms

- Crescendo `<`, diminuendo `>`, and closing `!` markers in song scripts produced no expression marks.
- A closing marker after a slash, such as `4#/!`, prevented the parser from recognizing the note as an eighth note.

## Root Cause

- Note parsing treated expression markers as pitch and duration suffix content.
- Renderer events did not retain hairpin start/end state or pair the endpoints.

## Fix

- Extracted hairpin markers before pitch and duration parsing while preserving the original closing marker in note `code` metadata.
- Paired each start marker with the next closing marker on the same score row.
- Rendered crescendo and diminuendo as two oracle-shaped SVG lines with 7 px endpoint margins and a 5 px opening centered 30 px above the row.
- Kept `+` vertical adjustment as a separate pending rule.

## Verification

- `pnpm exec tsc --noEmit`
- `swan.jps` parses 10 complete hairpin spans and renders 20 expression lines.
- The first `4#/!` endpoint renders with `time="0.5"` and `code="4#/!"`.
- `example-001-paipaizuo.jps`, `example-002-sandumojin.jps`, and `sandu-mojin.jps` retain byte-for-byte parity.