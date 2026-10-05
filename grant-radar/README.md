# Grant Radar

A calm list of grant leads for NAMI Southeast Wisconsin. It shows what is coming
up and what to look at next, and passes good leads to the
[Grant Dashboard](https://nami-grant-workspace.brainspottingonline.chatgpt.site)
in three steps. It does not apply for grants or decide who qualifies.

**Version 2.1.0, 2026-10-05.** See [AUDIT.md](AUDIT.md) for what changed from
1.0.1 and why, and the second look that made 2.1.0.

## Using it

Nothing to install. Open it one of three ways:

1. **As a link.** The shared Claude link, https://claude.ai/artifact/VpP4y4sWahwyAYuD6zPxoN
   (share it from the page's Share menu). Signed in to Claude, your leads
   follow you between computers. The hosted Site (`.openai/hosting.json`
   serves `dist/`) is the other way.
2. **As a file.** Double-click `dist/index.html`. The whole app is in that one
   file. It works offline (it uses system fonts when offline).
3. **Inside the app, Help** has the tour, the quick start, the full manual, and
   your data (backup, open a file, larger text, still screen).

Guides: [QUICKSTART.md](QUICKSTART.md) · [USER_MANUAL.md](USER_MANUAL.md) ·
`dist/quickstart.html`, `dist/manual.html`, and PDF and Word copies in `dist/`.

Use public information only. Do not enter client, donor, staff or financial
details.

## For whoever maintains it

```
src/core.mjs        logic: dates, duplicates, validation, the Dashboard file, backups
src/guides.mjs      every word of the tour, tips, quick start, manual and glossary
src/app.js          the interface
src/style.css       the look (light and dark)
scripts/build.mjs       -> dist/index.html (one file), dist/manual.html, dist/quickstart.html,
                           artifact/grant-radar.html, USER_MANUAL.md, QUICKSTART.md
scripts/build-docs.mjs  -> the PDF and Word copies in dist/ (needs Playwright and docx)
tests/              core, Dashboard contract, and real-browser tests
```

Edit `src/`, never `dist/` (it is rebuilt). Change a guide in `src/guides.mjs`
and every copy (in-app, HTML, PDF, Word, Markdown) follows.

```bash
node scripts/build.mjs          # no dependencies
node scripts/build-docs.mjs     # optional: PDF and Word
node --test --test-concurrency=1 tests/*.test.mjs
```

`tests/dashboard-contract.test.mjs` runs the send file through the Dashboard's
own validator in `../lib/records.ts` (Node 22.13 or newer). `tests/ui.test.mjs`
drives the built file in a real Chromium through Playwright; set
`PLAYWRIGHT_PATH` and `CHROMIUM_PATH` if they are not found. See
[TESTING.md](TESTING.md).

## Saving and storage

Leads save as you go: in the browser (`localStorage`), and, when the app runs as a Claude link with the
person signed in, also in that person's private store, so they follow them.
Neither is a shared agency database. Help → Your data → **Save a backup** and
**Open a file** let each person keep and move their own leads.

Weekly automatic searching is **not running**; see
[ADMIN_HANDOFF.md](ADMIN_HANDOFF.md). The Dashboard hand-off is described in
[INTEGRATION.md](INTEGRATION.md).
