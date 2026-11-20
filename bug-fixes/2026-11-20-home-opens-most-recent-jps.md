# Home opens the most recently updated JPS file

- **Symptom:** The home page always opened `jps-files/memory-from-cats.jps`, regardless of which JPS file had been updated most recently.
- **Root cause:** The initial file load used a hardcoded path.
- **Fix:** Include each JPS file's modification time in the song listing, select the newest file on home load, and expand its parent folders.
- **Verification:** The production build and ESLint passed. Browser verification confirmed the latest file was selected and its folder expanded.
