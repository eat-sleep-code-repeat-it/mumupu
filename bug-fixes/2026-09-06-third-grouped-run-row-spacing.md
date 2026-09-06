# Third Grouped-Run Renders Wrong in a Row

Date: 2026-09-06

## Symptoms

- `08-第八课手振音.jps` rendered incorrectly in rows 3 and 4, both of which contain three separate `(y...)` tuplet-grouped runs mixed with plain notes.
- Removing the `y` marker (or the parentheses) from the third grouped run in either row made the row render correctly, but at the cost of losing that run's legitimate tuplet bracket.
- The user found `08-第八课手振音-debug.jps` (with the third group's `y` marker removed) rendered without the glitch, and used it to help narrow down the cause.

## Root Cause

- A row containing tuplet-grouped notes mixed with plain/slur notes only uses the precise natural-width layout algorithm (`usesSparseMixedGroupWidths`) when the row has at most 2 tuplet groups (`groupCount <= 2`).
- Rows with exactly 3 tuplet groups fell through to the coarser fixed-step approximation (`groupedNoteStep`), which advances a single running coordinate uniformly for every tuplet-grouped note in the row, ignoring the actual width consumed by intervening plain notes and decorations (e.g. a flat sign).
- With 3 tuplet groups spread across a row, this fixed-step approximation accumulates a positioning error bar over bar, causing notes to drift and even overlap (duplicate x-coordinates were observed) by the third group.

## Fix

- Extend `usesSparseMixedGroupWidths` in `lib/translate.ts` to also cover rows with exactly 3 tuplet groups (`groupCount <= 3`), so these rows use the same accurate natural-width layout algorithm already used for 1-2 group rows.

## Verification

- Isolated diagnostics comparing rendered `<use>` element coordinates against `oracle-cache/何家义从零起步学口琴/08-第八课手振音.jps.svg` confirmed rows 3 and 4 now match the oracle exactly (the only remaining byte difference is a separate, pre-existing gap: a missing `xunhuan_zuoyou` glyph for the unrelated `:|:` combined repeat barline in row 8).
- A CRLF-normalized full-repository comparison against all `oracle-cache` fixtures shows identical results before and after the fix (39 exact, 2 pre-existing unrelated mismatches, 8 missing caches), confirming no regressions.
- `pnpm exec tsc --noEmit` passes; `pnpm exec eslint lib/translate.ts` shows only two pre-existing, unrelated unused-variable warnings.
