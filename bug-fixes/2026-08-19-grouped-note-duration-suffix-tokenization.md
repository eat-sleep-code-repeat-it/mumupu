# Grouped Note Duration Suffix Tokenization

Date: 2026-08-19

## Symptoms

- Grouped-note patterns such as `(7$/ (7$) 7$)/` in `memory-from-cats.jps` produced stray standalone `/` tokens.
- The local renderer therefore lost the duration suffix on the last note of the group and created bogus parser output.

## Root Cause

- `tokenizeJpsLine` split closing delimiters like `)` before looking at immediately following duration suffix characters.
- As a result, suffixes such as `)/` were detached from the preceding note instead of being kept with the musical token they modify.

## Fix

- Updated `tokenizeJpsLine` in `lib/translate.ts` so duration suffixes immediately following `)`, `]`, or `}` are folded back onto the preceding non-structural token.
- This removes the stray standalone `/` tokens for grouped-note duration suffixes.

## Verification

- Local token inspection for `public/jps-files/memory-from-cats.jps` shows `(7$/ (7$) 7$)/` tokenized without a stray standalone `/` token.
- `pnpm exec tsc --noEmit`
- `pnpm exec next build`
