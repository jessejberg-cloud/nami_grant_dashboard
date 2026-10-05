# Grant Radar audit

## 2.1.0: a second look, 2026-10-05

Reviewed 2.0.0 against the ADHD design principles (`apps/docs/adhd-design-principles.md`)
and the Grant Dashboard it hands off to. Nothing was broken; six things were not
to the law yet.

| # | What 2.0.0 did | The rule | Now |
|---|---|---|---|
| 1 | Home opened on three big numbers: "Due in 30 days 1", "Needs checking 4", "Shortlisted 0" | Never count a pile; a number on what is waiting reads as a backlog. Headings at a glance, details on a tap | Home is three short lists with the leads' names: Coming up, Needs checking, Shortlisted. "See all" beside each opens the full list |
| 2 | Every filter chip on Leads carried a count ("Needs checking 4") | The same rule | The chips are their names |
| 3 | The tour said "Tip 1 of 6" | Progress is a row of marks that fills, never "3 of 7" | A row of dots |
| 4 | A page tip had only Got it | A hint has Got it, and Later brings it back tomorrow (the Dashboard already did this) | Later, beside Got it. Show page tips again brings both kinds back |
| 5 | The status row offered seven choices at once | Five is the ceiling, three the target | Five: New, Needs checking, Looking into it, Shortlisted, Not for us. Archive already has its own button; Archived and Closed appear only on a lead that is one |
| 6 | "in 4 days" | Cut a word that carries nothing ("in 3 weeks" is "3 weeks") | "4 days" |

Also cut: a hard-coded line on Find grants ("The last search was done by hand on
Sep 12, 2026: four funder pages checked"), which would have read as stale, and
as a count, from the day after it was written.

**Still the word "Deadline".** The principles keep "deadline" off screen (it is
"Fixed date" in Wide Margin). Radar says Deadline on the lead's fact card and in
the Add form, and the Dashboard says "Due". A name is Jesse's to pick, so this is
flagged, not changed. "Apply by" is one candidate.

Verified: 25 tests pass (10 core, 5 Dashboard contract, 10 in a real Chromium,
including a new one for the three lists, Later, and the five statuses); the
guides, PDF and Word copies are rebuilt from the same words.

## 2.0.0 audit

Date: 2026-10-05. Reviewed: version 1.0.1 (2026-09-12), every file in
`grant-radar/`, plus the Grant Dashboard importer it hands off to
(`../lib/records.ts`, `../app/api/records/route.ts`).

## Bugs found and fixed

| # | Problem in 1.0.1 | What happened | Fix |
|---|---|---|---|
| 1 | New leads were marked **Fictional sample** by default | A real lead added by staff was labelled fake, exported as `demo: true`, and could land in the Dashboard's Sample workspace | New leads are real; "practice lead" is an opt-in tick box |
| 2 | Sending the same lead twice broke the whole import | The Dashboard refuses the **entire file** when any record matches an existing title + link. Radar did not remember what was sent, and "Export active public leads" re-sent everything each time | Radar records `sentAt`, leaves sent leads unticked, and warns when one is ticked by hand |
| 3 | Search only filtered after leaving the box | Typing showed nothing until Enter or a click elsewhere | Filters as you type, and the cursor stays in the box |
| 4 | Duplicate check crashed on a lead with no link | `x.officialUrl.trim()` on `undefined` | Null-safe; tested |
| 5 | Absolute paths (`/style.css`, `/app.js`, `/manual.html`) | The app broke anywhere except a site root, and could not be opened as a file | One self-contained file with relative links |
| 6 | Escape key listeners piled up with each dialog | Memory and double-close bugs over a long session | One keyboard handler; focus returns to where it was |
| 7 | A second message cut the first one short | The 3-second timer of the earlier message hid the later one | Each message resets the timer |
| 8 | Deadlines counted in UTC | After 7 pm in Milwaukee, "today" was already tomorrow | The person's own calendar day |
| 9 | A future "checked" date could reach the Dashboard | The Dashboard refuses future verification dates, failing the import | Dropped from the file; the date picker stops at today |
| 10 | Two picked leads with the same name and link | The Dashboard would refuse the file | Caught before the file is saved, with a plain message |
| 11 | No way to keep or move data | Clearing the browser lost everything | Save a backup, Open a file (merges, never overwrites), and an account copy when run as a Claude link |
| 12 | No undo | Archive and status changes were final | Undo on status, archive, start fresh, and opening a file |

## Made simpler (the ADHD design principles)

- **Lower the demand.** Adding a lead needs only a name. The 25-field form is
  now six fields, with the rest under More details. The source-check note is
  optional.
- **One thing at a time.** A six-tip tour that rings each real control replaces
  the seven-screen wall of text. Each page has one tip, shown once.
- **Nothing is lost.** Next step, owner and notes save by themselves. Closing
  the Add form keeps what was typed.
- **Everything can be undone.** See #12.
- **No shame, no pressure.** No red anywhere. Counts look forward ("Due in 30
  days"), never back. A soft amber marks deadlines within 30 days.
- **Plain words.** "Needs checking", not "Verification needed"; "Time for a
  fresh look", not "STALE"; "Lead ID", not "Stable external ID"; no schema
  versions on screen.
- **Less on the screen.** Six pages became five; Search profile and Search
  health became "Find grants". "Real public lead" is no longer stamped on
  every row; only the exception, Practice, is tagged.
- **Adapts to you.** Larger text and Still screen settings, plus dark mode and
  reduced motion from the device.

## Integration made simpler

Send is three numbered steps: pick (ticked for you), save the file, and import
it, with the Dashboard's own menu path drawn out. Opening a Dashboard export in
Radar now works too: its opportunities come back as leads, already marked Sent.

## What was kept on purpose

- Stored status values (`Verification needed` and the rest) and the
  schema-version-2 file the Dashboard already accepts. Only the words on
  screen changed.
- The four real public leads and the one made-up practice lead.

## Not verified

- A screen reader session, and real phones (tested in Chromium at phone width).
- A live import into the hosted Dashboard. The file is checked by the
  Dashboard's own validator and a copy of its import rules, not by the running
  Site.
- Account sync runs only inside the Claude viewer, so it is exercised there
  rather than in these tests.
