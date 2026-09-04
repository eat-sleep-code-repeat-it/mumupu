# Attached Dynamics Rendering

Date: 2026-08-22

## Symptoms

- Dynamics such as `&p`, `&mp`, and `&mf` were treated as part of a note's pitch suffix.
- They leaked into audio metadata and produced no visible mark.

## Root Cause

- Note token parsing had no explicit dynamics field.
- The renderer had no late expression layer for attached dynamics.

## Fix

- Added explicit parsing for the six dynamics used by cached song fixtures: `p`, `pp`, `mp`, `mf`, `f`, and `rit`.
- Removed dynamics from pitch/audio parsing and serialized them with the oracle-style `+` note code suffix.
- Rendered dynamics in a dedicated late SVG layer using local italic music text.
- Positioned marks from the note coordinate with 8 px clearance for each positive octave and ordinary slur level, plus the measured nested-slur horizontal adjustment.

Exact oracle path shapes remain a separate parity task. Validation caches are not read by application runtime code.

## Verification

- `pnpm exec tsc --noEmit`
- `swan.jps` produces eight dynamics in source order with clean audio metadata.
- Representative codes include `5(+p` and `2('+mf`; the latter reserves space for both its octave and slur.
- `example-001-paipaizuo.jps`, `example-002-sandumojin.jps`, and `sandu-mojin.jps` retain byte-for-byte parity.
- Full song report remains at 38 checked, 1 exact, 37 mismatched, and 0 missing caches.