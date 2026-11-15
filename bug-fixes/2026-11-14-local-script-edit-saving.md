# Local-only script editing saves

- **Symptoms:** Edited scripts in the viewer could not be saved back to their selected `.jps` file.
- **Root cause:** The save API existed, but the Script panel had no save action; the API also lacked a local-development restriction.
- **Fix:** Added a local-development-only **Save edits** action with overwrite confirmation, success/error feedback, and server-side checks that reject production and non-loopback hosts.
- **Verification:** `pnpm run verify:save-script` checks a successful local save and rejects production, non-local hosts, cross-origin requests, and path traversal.
