# Home file panel hidden by default

- **Symptom:** The home page opened with the file panel taking up space, and desktop controls were labeled “Show files” or “Hide files.”
- **Root cause:** The viewer initialized its sidebar as visible.
- **Fix:** Initialize the sidebar as hidden and use a consistent **Files** toggle button on desktop.
- **Verification:** Confirmed the production build and checked that the desktop Files button opens and closes the panel.
