# Jump House and Swan Lake Parity

Date: 2026-08-31

## Symptoms

- The `|["16" ... 0] |` row in `hejiayi-F-Swan-lake.jps` parsed `[` and `]` as fake notes.
- Marker notes shifted event metadata, overlapped the opening bar, omitted the jump-house bracket, and left subsequent rows 12 pixels too high.
- Accidental and slur-boundary reservations caused earlier natural-width rows to diverge.

## Root Cause

- Jump-house markers were tokenized but had no bar-owned parser or renderer model.
- Ordinary rows inherited flat-note compatibility reservations intended for rich layout.
- Spacing did not distinguish a flat accidental that closed a slur before a bar from a slur that remained open across the bar.

## Fix

- Attach the opening marker and label to its bar as `|['16'` and absorb the final rest, closing marker, and bar as `0]|` without consuming extra event positions.
- Enable natural-width layout for jump-house rows and reserve 12 pixels of vertical clearance.
- Render the left edge, top line, right edge, and label in the final decoration layer.
- Scope flat closing-note compatibility spacing to rich layout and carry ordinary descending accidental clearance only within its active slur.
- Avoid double-counting boundary clearance when a detached annotation already owns it, and suppress retrigger audio when a slur-closing pitch inherits the preceding accidental.
- Preserve split-beam compatibility for flat accidental tails while joining equivalent sharp tails, and transfer sharp cross-bar clearance to the owning slur boundary.
- Normalize the remaining oracle-compatible floating-point boundaries for notes, beams, octave glyphs, and slur paths.
- Keep cached oracle SVGs validation-only; runtime output continues to use the local renderer.

## Verification

- `hejiayi-F-Swan-lake.jps` matches its cached oracle byte-for-byte at 67297 bytes.
- `hejiayi-F-Swan-lake-alternativekeys.jps` matches its cached oracle byte-for-byte at 70973 bytes.
- `Londonderry.jps` and `LondonderryAir.jps` remain byte-exact after constraining pending accidental clearance to active slurs.
- `pnpm run verify:translate` reports 4 exact, 0 mismatched, and 0 missing caches.
- `pnpm run verify:songs` reports 7 exact, 31 mismatched, and 0 missing caches.
- `pnpm exec tsc --noEmit` completes without diagnostics.