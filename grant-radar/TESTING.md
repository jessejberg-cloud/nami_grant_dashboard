# Grant Radar testing record

Version 2.0.0, 2026-10-05.

```bash
node scripts/build.mjs
node --test --test-concurrency=1 tests/*.test.mjs
```

**Result on 2026-10-05: 24 tests, 24 pass** (Node 22.22, Playwright 1.56,
Chromium 141).

| File | What it proves |
|---|---|
| `tests/core.test.mjs` (10) | Dates in the person's own day; duplicates (null-safe); validation messages; source checks keep notes and flag changes; the send file's shape and limits; opening backups, Dashboard exports and bad files; search links |
| `tests/dashboard-contract.test.mjs` (5) | The send file passes the Dashboard's **own** `validate()` from `../lib/records.ts`; every Radar status maps to a Dashboard status; sending a lead twice is refused, and Radar's default picks avoid it; a Dashboard export opened in Radar comes back as leads. It also checks that `route.ts` still holds the import rules it mirrors |
| `tests/ui.test.mjs` (9) | The **built** `dist/index.html`, opened from disk in real Chromium: first-visit tour, skip, no return; adding (name only, real by default, duplicate caught, draft kept); notes saved by themselves across a reload; undo; source-check change flags; search as you type; send, Sent marks, practice kept apart; backup, start fresh, undo, open a backup; larger text remembered; manual and quick start inside the app; phone width with no sideways scroll; focus trapped in dialogs. Each test fails on any page error |

Not covered: screen readers, real phones, a live import into the hosted
Dashboard, and account sync (it only runs inside the Claude viewer).
