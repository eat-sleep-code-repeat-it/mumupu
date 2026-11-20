# JPS MusicXML export download

- **Symptom:** Export returned MusicXML from the API, but the browser did not start a file download.
- **Root cause:** The generated download link was clicked while detached from the document.
- **Fix:** Attach the link before clicking, remove it afterward, and delay revoking its blob URL.
- **Verification:** Browser export returned HTTP 200 and invoked a connected blob link with the expected `.musicxml` filename. Unsupported lyrics returned HTTP 400 and displayed an error. Converter tests and production build passed.
