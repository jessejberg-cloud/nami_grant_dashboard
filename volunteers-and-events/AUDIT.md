# Audit of the ChatGPT Events & Volunteers app, and what replaced it

*2026-10-05. The app reviewed is `events-volunteers/` (version 1.0.0), and it is left untouched. Its replacement is this folder.*

## Summary

The ChatGPT build carefully guarded against data errors, but it was built for an evaluator rather than for a coordinator. Three problems could not be fixed with small edits:

1. **Nobody could get in without help.** It needs a ChatGPT sign-in and a ChatGPT Site that its own handoff says was "registered … but never published." Each person who signs in gets a **separate, private** workspace. That means Ed and Jesse could never see the same records.
2. **Recording one volunteer's hours took four records and two checkboxes.** The steps were: Assignment, then Attendance with exact arrival and departure times, then Hours typed in *minutes*, then a separate approval with an "I reviewed actual service time" checkbox. Confirming a volunteer also needed its own acknowledgment checkbox.
3. **The screens worked against the ADHD design principles** (`docs/design-principles.md`) almost everywhere: 16 menu items, "Overdue" counters, upper-case UNKNOWN, raw JSON and "Stable ID" on screen, and every form showing a "Repeated daylight-saving hour" picker.

So the app was rebuilt as one file, keeping the parts that matter: events, volunteer jobs, who came, hours, supporters and gifts, backup, and spreadsheet export.

## Bugs found in the ChatGPT build (from reading `lib/domain.ts`, `lib/service.ts`, `app/workspace.tsx`)

| # | What happens | Where |
|---|---|---|
| 1 | Nothing can be deleted. A mistyped volunteer stays forever, and re-entering them correctly is refused with "Matching record already exists" (duplicate key on name/contact). | `domain.ts` `key()` / `validate()` |
| 2 | Real attendance above capacity can't be recorded: "Total attendance must be … within capacity." If 520 people come to a 500-person event, the save fails. | `domain.ts` validate, `totalAttendance` |
| 3 | Any change in another tab or by another device fails the next save with "Workspace changed … Reload". The whole workspace is one row with one revision number. | `service.ts` `handle()` |
| 4 | The "Saved to your durable evaluator workspace." notice never clears, so it still claims a save after a later failure. | `workspace.tsx` `mutate()` |
| 5 | Search looks inside the raw JSON of every record, so typing part of an ID or a field name matches unrelated records. | `workspace.tsx` `filtered` |
| 6 | Hours are typed in minutes (1 to 1,440) and must not exceed the recorded attendance window. A volunteer who stayed late can't be credited without first editing the attendance record. | `domain.ts` hours rule |
| 7 | The home order is a free-text setting ("events,shifts,tasks,verification,hours"). One typo blocks saving all preferences. | `prefCheck()` |
| 8 | Background checks and training older than 90 days turn "Stale" by a rule the app itself calls "not agency policy". | `verificationState()` |
| 9 | Error messages are written for developers: "Missing or cross-scope shift link.", "Invalid record identity, scope or timestamp." | `validate()` |
| 10 | Tests need a separate hand-built tool directory (`TEST_TOOLS`), and the build needs pnpm 11 and the Cloudflare toolchain. None of this can be run by a non-technical owner. | `README.md`, `TESTING.md` |

## ADHD-principle audit, and what the new app does instead

| Principle | ChatGPT build | New app |
|---|---|---|
| 1 Lower the demand | Status, owner, verifier, basis and time zone on most records; four records per hour logged | Only a name is ever needed. Hours fill in from the event times. |
| 2 No shame, no pressure | "Overdue preparation" count, UNKNOWN, Stale, No-show, red Cancel button | No overdue, no red. Open spots point forward ("2 spots open"). One gentle "Mark who came" card, shown one at a time. |
| 3 Calm | Dark sidebar, amber warning stripes on every page | Muted greens and sand, one fade between pages, honors reduced motion |
| 4 Less on the screen | 16 menu items; 5 count tiles plus 5 lists on home | 5 tabs. Home shows the next event, one reminder, and what's coming up. |
| 5 One thing at a time | Modal forms with 10–15 fields | Edit in place. Each job and each person is its own short row. |
| 6 Nothing is lost | A failed save kept input only until the dialog closed | Saves as you type. Pending edits are flushed when the page is hidden or closed. Backup file. |
| 7 Everything can be undone | No delete or undo | Every delete has Undo, plus Recently deleted with Bring back |
| 8 Adapts to you | Theme names and comma-text settings | Text size (3 steps) and Light / Dark / Match device |
| 9 Explains itself | 6-screen onboarding plus a 6-step demo about evaluation storage | One welcome card with three steps, one-line tips with "Got it", and How to use under More |
| 10 Plain words | "durable evaluator workspace", "aggregate", "scope", "stable ID" | Event, job, volunteer, came, hours, supporter, gift |
| 11 Setup is skippable | Samples needed a scope picker | Skip on the welcome. Example records are opt-in, labeled, and removed in one tap. |
| 12 Finished page stays finished | n/a | Past events stay readable. Nothing fake is added unless you ask. |

## What was deliberately left out

These were dropped because they cost the coordinator effort on every record and protect against things a 30-person team can settle face to face:

- separate shift / assignment / attendance / hours-approval records
- the verifier-and-basis rule for "Verified"
- the daylight-saving fold picker
- per-record history JSON
- sample-versus-agency scopes

Their data shape is not carried over. The ChatGPT build only ever held fictional samples, so there is nothing to migrate.

## How the new app is checked

`node tests/flow.test.mjs` drives the real page in a headless Chromium browser through 22 steps:

- the welcome
- adding an event, jobs and volunteers by name, including a duplicate name that is refused
- Everyone came, an edited hours value, and to-dos
- the hours total and the spreadsheet file
- reload persistence
- Add many, with existing names skipped
- delete with Undo, and Bring back
- a received gift total
- saving a backup and restoring it into a fresh browser
- refusing a file that isn't a backup
- adding and removing example records
- the home reminder
- a sweep for shaming words (overdue, late, missed, no-show, deadline, unknown)
- no sideways scrolling at phone width
- no browser errors

The shared link's storage was checked by writing, merging, listing and deleting one probe record.

**Not checked:** two people editing at once on the shared link, a screen reader, or a real phone in someone's hand.
