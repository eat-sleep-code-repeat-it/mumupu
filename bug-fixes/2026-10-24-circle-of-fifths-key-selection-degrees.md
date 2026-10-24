# Circle of fifths key selection degrees

- Symptoms: Selecting a key did not mark its diatonic chords on the wheel or provide the related/parallel-key summary shown in the reference.
- Root cause: Selection only updated a single key label; no chord-degree-to-wheel mapping was rendered.
- Fix: Map the selected key's diatonic triads to major/minor sectors, render Roman-numeral badges, and show related/parallel keys plus the chord-degree/function matrix.
- Verification: ESLint on `app/home/circle-of-fifths.tsx` and project TypeScript check.
