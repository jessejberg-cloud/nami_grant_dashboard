# Volunteers & Events

An easy organizer for NAMI events, volunteers and supporters. You plan an event, list the volunteer jobs, add people by name, mark who came, and the hours add up on their own. Gifts from donors, sponsors and partners are tracked as promised or received.

**Shared link (team version):** https://claude.ai/artifact/EDapVYL3SAdAPKV7duNK1H. Share it from the page's Share menu, giving each person **Editor** access.
**File version (no account):** download `Volunteers-and-Events.html` and double-click it.

- `QUICK-START.md`: the one-page guide for the people using it
- `AUDIT.md`: what was wrong with the ChatGPT build in `../events-volunteers/` and why this replaced it

## For whoever maintains it

- `src/app.html` is the page itself. It is published to the shared link as-is; the host adds `<html>`, `<head>` and `<body>`.
- `node build.mjs` writes `Volunteers-and-Events.html`, the same page as a complete file. Run it after every change to `src/app.html`.
- `node tests/flow.test.mjs` runs the 22-step browser test. It needs the `playwright` package and a Chromium browser.
- No libraries and no build tools are needed. Fonts come from Google Fonts, and the page falls back to system fonts offline.
- **Storage.** On the shared link, records live in the page's own database: collections `events`, `people` and `supporters`, plus the document `meta/settings`. Opened as a file, they live in the browser's `localStorage`. Text size, colors and dismissed tips are always per person, in `localStorage`.
