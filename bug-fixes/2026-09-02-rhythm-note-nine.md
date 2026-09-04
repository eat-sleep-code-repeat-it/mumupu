# Rhythm Note Nine

Date: 2026-09-02

## Symptoms

- JPS token `9` was accepted by tokenization but rendered through an undefined `shuzi_b_9` reference.
- The event exposed `9` as pitched audio instead of a rhythm-only note.

## Root Cause

- The parser treated every visible numeric note identically, although the specification reserves `9` for the `X` rhythm note.
- The local glyph library had no rhythm-note definition.

## Fix

- Added a local X-shaped `shuzi_b_9` glyph.
- Preserve normal note duration and beam participation while emitting empty audio metadata for token `9`.

## Verification

- A focused parser and SVG assertion checks whole and eighth rhythm notes, empty audio, and two `shuzi_b_9` uses.
- `pnpm run verify:translate` reports 4 exact, 0 mismatched, and 0 missing caches.
- `pnpm run verify:songs` reports 38 exact, 0 mismatched, and 0 missing caches.
- `pnpm exec tsc --noEmit` and `git diff --check` pass.