# MusicXML measure attributes structure

- **Symptom:** MusicXML export appeared to contain no usable notes in score applications, even though the generated XML included pitch elements.
- **Root cause:** Measure divisions, key signatures, and time signatures were written directly under `<measure>` rather than inside the required `<attributes>` element.
- **Fix:** Wrap measure-level divisions, key, and time data in `<attributes>`.
- **Verification:** The `0010-半山听雨.jps` fixture now checks for pitched notes and verifies that divisions, key, and time are children of the first measure's `<attributes>` element; converter suites, lint, formatting checks, and production build pass.
