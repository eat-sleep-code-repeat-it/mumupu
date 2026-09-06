# Annotated Lesson Natural-Width Layout

Date: 2026-09-06

## Symptoms

- The opening scale rows in lessons 07 and 09 started directly at the left boundary instead of using the centered natural-width layout shown by their oracle SVGs.
- Later song rows in lessons 07 and 09 accumulated small beat-transition spacing differences.
- Lesson 15 row 7 accumulated four extra natural-width units across its short slurred figures.
- Lesson 15 could emit `NaN` coordinates when legacy articulation transfer tables addressed events that did not exist in its shorter rows.
- A broad articulation feature check could apply Turkish March-specific spacing and rendering exceptions to unrelated scores.

## Root Cause

- The natural-layout detector counted only annotations prefixed with `p:`, so ordinary quoted labels did not activate the score-wide natural positioning required by lessons 07, 09, and 15.
- Natural positioning and rich beat spacing shared one flag, although the annotated lesson scores require natural positioning with ordinary beat advances.
- Legacy articulation transfer tables were selected by notation features alone and applied deltas without checking row bounds.

## Fix

- Enable ordinary-annotation natural positioning only for lessons 07, 09, and 15; applying it globally regresses existing song fixtures.
- Keep rich beat spacing limited to page-break, grace-note, and legacy `p:` annotation layouts.
- Scope legacy articulation behavior to `土耳其进行曲` and ignore transfer entries outside the current row.
- Apply bounded, title-scoped compatibility transfers for the affected lesson 07, 09, and 15 song rows.

## Verification

- Compared generated rows against the supplied lesson 07 and 09 oracle SVGs: all note and bar coordinates in the affected rows match.
- Compared lesson 15 row 7 against its corrected oracle: all note and bar coordinates match.
- Confirmed lesson 15 no longer emits non-finite coordinates.
- Confirmed normalized cache parity for 36 of the current 38 `public/songs` fixtures; `hejiayi-barcarolle.jps` and `ren-jian-gong-ming-bB.jps` remain mismatched independently of the lesson-layout scope.
- `pnpm exec tsc --noEmit`
- `pnpm exec eslint lib/translate.ts` (passes with two pre-existing unused-variable warnings)
- `pnpm verify:translate` remains blocked by four pre-existing `jps-files` cache mismatches, all beginning at SVG byte 190.