# Volunteers & Events

An easy organizer for NAMI events, volunteers and supporters. You plan an event, list the volunteer jobs, add people by name, mark who came, and the hours add up on their own. Gifts from donors, sponsors and partners are tracked as promised or received.

**Shared link (team version):** https://claude.ai/artifact/EDapVYL3SAdAPKV7duNK1H. Share it from the page's Share menu, giving each person **Editor** access.
**File version (no account):** download `Volunteers-and-Events.html` and double-click it.

**Version 2.1, 2026-10-05.** See [AUDIT.md](AUDIT.md) for the second look that made 2.1, and for what was wrong with the ChatGPT build in `../archive/events-volunteers/` and why this replaced it.

- [QUICKSTART.md](QUICKSTART.md): the short guide for the people using it
- [USER_MANUAL.md](USER_MANUAL.md): the full manual, the same words as the app's Help
- [EMAIL.md](EMAIL.md): the email for Ed, with every link and resource
- `dist/`: the guides as web pages, Word files and PDFs, built from the two files above. Help in the app links to the PDFs.

## For whoever maintains it

- `src/app.html` is the page itself. It is published to the shared link as-is; the host adds `<html>`, `<head>` and `<body>`.
- `node build.mjs` writes `Volunteers-and-Events.html`, the same page as a complete file. Run it after every change to `src/app.html`.
- `node tests/flow.test.mjs` runs the 31-step browser test. It needs the `playwright` package and a Chromium browser.
- `python3 scripts/build_docs.py` rebuilds `dist/` (web pages and Word files; needs `python-docx`), then `node scripts/print_pdfs.mjs` prints the PDFs from the web pages. Run both after changing `QUICKSTART.md` or `USER_MANUAL.md`.
- No libraries and no build tools are needed. Fonts come from Google Fonts, and the page falls back to system fonts offline.
- **Storage.** On the shared link, records live in the page's own database: collections `events`, `people` and `supporters`, plus the document `meta/settings`. Opened as a file, they live in the browser's `localStorage`. Text size, colors and dismissed tips are always per person, in `localStorage`.
