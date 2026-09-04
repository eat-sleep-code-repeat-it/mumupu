# Hejiayi Dream Wrapped Layout Parity

Date: 2026-09-01

## Symptoms

- `hejiayi-dream.jps` had the same parsed score structure as its cache but differed in natural widths, two four-note slur representations, and one attached dynamic.
- Four oracle slur-cap elements were absent because local spacing kept two same-row slurs below the renderer's long-slur threshold.
- Compact alternative-key spacing rules leaked into the wrapped 11-row layout.

## Root Cause

- Sustained transposed scores used one spacing profile even though compact and wrapped row layouts assign slur and accidental clearance differently.
- Wrapped rows needed bar-clearance suppression, degree-2 adjacent-slur transfer, and natural-restoration-to-sharp ownership without the compact profile's broader post-slur clearance.
- Dynamics attached to slur-closing notes needed the active closing depth in both layouts.

## Fix

- Added an explicit compact sustained-transposed layout flag derived from score row count.
- Kept compact-only accidental, slur, hairpin, and coordinate behavior scoped to the six-row alternative-key score.
- Added shared sustained-transposed bar ownership and wrapped-layout degree-2 adjacent-slur and restoration-to-sharp rules.
- Reused closing-slur depth for attached dynamic placement across compact and wrapped layouts.
- Restored natural widths so the existing long-slur threshold emits the two missing cap pairs without special-casing note sequences.

## Verification

- `pnpm run parity:translate hejiayi-dream.jps` reports exact equality at 108304 bytes.
- `pnpm run parity:translate hejiayi-dream-AlternativeKey.jps` remains exact at 88590 bytes.
- `pnpm run verify:translate` reports 4 exact, 0 mismatched, and 0 missing caches.
- `pnpm run verify:songs` reports 38 checked, 29 exact, 9 mismatched, and 0 missing caches.
- `ren-jian-gong-ming-bB.jps`, `sometime-when-it-rains-FixedDo.jps`, and `sometime-when-it-rains-FixedDoHK.jps` remain byte-exact.
- `pnpm exec tsc --noEmit` and VS Code diagnostics pass.
