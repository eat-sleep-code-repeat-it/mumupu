# JPS MusicXML export dynamics and suffixes

- **Symptom:** Exporting `0001-印度客商之歌.jps` failed on `&p`, and exporting `0010-半山听雨.jps` failed on grace-note brackets, duration extensions, and accompaniment markers.
- **Root cause:** The exporter did not model JPS dynamics, hairpins, ornaments, grace notes, accompaniment brackets, or octave/duration suffixes that follow a closed group.
- **Fix:** Map supported expression marks and accompaniment brackets to MusicXML directions/notations, parse grace notes, and apply post-group duration and octave markers to the preceding note.
- **Verification:** Both reported JPS files converted to parseable MusicXML with focused assertions for their expression marks, grace notes, and brackets; converter checks, lint, and the production build passed.
