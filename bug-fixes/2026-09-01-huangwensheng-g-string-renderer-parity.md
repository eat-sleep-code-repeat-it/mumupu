# Huangwensheng G-String Renderer Parity

Date: 2026-09-01

## Symptoms

- `huangwensheng-G-string.jps` differed from its cached SVG in sustained ornaments, grace notes, nested slurs, duration beams, dynamics, hairpins, octave dots, and several natural-layout coordinates.
- Standalone hairpin tokens could become timed events, and nested lexical slur markers could lose paths or render in the wrong order.

## Root Cause

- The parser and local renderer lacked the score's sustained-ornament glyphs and duration-aware grace composites.
- Natural spacing, beam-level flushing, slur-stack emission, and decoration clearance did not reproduce the legacy renderer's behavior for this notation mix.
- Fractional durations and accumulated coordinates used different serialization from the cached reference.

## Fix

- Added local sustained-ornament and grace glyph rendering, standalone hairpin absorption, and consecutive lexical slur preservation.
- Added sustained-profile spacing, octave, dynamic, hairpin, beam, and nested-slur rules while keeping cached SVGs validation-only.
- Preserved exact fractional duration and coordinate serialization needed for byte parity.

## Verification

- `pnpm run parity:translate huangwensheng-G-string.jps`
- `pnpm run verify:translate`
- `pnpm run verify:songs`
- `pnpm exec tsc --noEmit`