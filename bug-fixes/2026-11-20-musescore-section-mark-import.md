# MuseScore import of JPS section marks

- **Symptom:** MuseScore reported measures 13–56 as empty when opening the MusicXML export for `0001-印度客商之歌.jps`.
- **Root cause:** JPS section labels `"A"` and `"B"` were emitted as `<other-notation type="other">`, but `other-notation` requires a `start`, `stop`, or `single` type.
- **Fix:** Export section labels as MusicXML `<rehearsal>` directions, which are intended for letters and section names.
- **Verification:** The fixture checks for both rehearsal labels and notes in every measure after the first twelve; converter suites, lint, formatting checks, and the production build pass.
