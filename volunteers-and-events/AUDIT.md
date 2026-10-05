# Volunteers & Events audit

## 2.1: a second look, 2026-10-05

Reviewed 2.0 (every file in this folder, the shared link's page, and the
contract of the database the shared link saves to) against the design
principles (`../docs/design-principles.md`) and against the other two apps,
the Grant Dashboard and Grant Radar, the way their own second looks were done.
The shape holds: one name is ever required, five tabs, no red, no counts
looking back, saves as you type, Undo everywhere. Four things were wrong, and
five were not to the law or not in step with the other two apps yet.

| # | What 2.0 did | The rule | Now |
|---|---|---|---|
| 1 | On the shared link, a change to a record someone else had just removed for good flipped the whole page to **View only** and told the person to ask for Editor access | Plain words. A wrong message is worse than none | A message says someone removed that item, and the page stays editable |
| 2 | A half-typed name under a job, a new to-do, or a pasted list could be wiped by a redraw: on the shared link, any change arriving from someone else, or the echo of your own save 0.7 s later | Nothing is ever lost | Words in a box that is not saved as you type survive a redraw (tested) |
| 3 | A job or event with the same start and end time credited 24 hours to everyone marked as came | A bug | No hours, with the box left for you to type |
| 4 | Recently deleted dated a deletion by the UTC day, so after 7 pm in Milwaukee it said tomorrow | The same bug Grant Radar 2.0 fixed (its #8) | The person's own calendar day |
| 5 | A tip had only Got it | A hint has Got it, and Later brings it back tomorrow (Radar 2.1, the Dashboard) | Later, beside Got it. Show the tips again brings both kinds back |
| 6 | No tour. "Show the welcome again" did nothing once any record existed, and said so in a message | It explains itself: one short welcome you can skip, and a tour that points at the real parts (Radar). Progress is a row of marks, never "3 of 7" | A five-stop tour of the tabs with a row of dots, from the welcome ("Show me around"), Settings and Help. The welcome shows again above Home when asked |
| 7 | No printable guides, no link to any, and the quick start file was named `QUICK-START.md` while the other two apps use `QUICKSTART.md` | Fits the suite: each app has `QUICKSTART.md`, `USER_MANUAL.md` and `dist/` with web, Word and PDF copies built from the same words | `USER_MANUAL.md`, `QUICKSTART.md`, `scripts/build_docs.py` (same shape as Radar's) and `scripts/print_pdfs.mjs` make `dist/`. Help links the two PDFs. `EMAIL.md` is the note to send with the link |
| 8 | "Event — Job" in the sign-up chooser used an em dash | The Dashboard's second look: an em dash in words a person reads becomes a comma, colon or full stop | "Event: Job" |
| 9 | On the shared link the first visit said nothing about who sees what | It explains itself | One tip on Home: everyone with the link sees the same records |

**Checked and sound, so nothing changed:** the shared link's database merges a
nested update recursively (its contract says so, and the probe in the 2.0 audit
showed it), so editing one job never wipes the others, and a `null` clears one
sub-record. The shared link's page matched `src/app.html` byte for byte before
this round. Deletes, Undo and Recently deleted; backup and restore; the
spreadsheet files; phone width; dark colors; reduced motion.

**The twelve principles, one line each:** (1) only a name is required, anywhere;
(2) no overdue, no red, "spots open" points forward, and the one reminder on Home
is a single event, not a count; (3) muted greens and sand, one fade, honors
reduced motion; (4) five tabs, seven things under More, headings first;
(5) Home is the next event; (6) saves as you type, a failed save says so, backup
is two taps; (7) every delete has Undo and Recently deleted; (8) three text
sizes, light, dark or match the device, per person; (9) welcome, tour, tips with
Got it and Later, Help in plain words; (10) event, job, volunteer, came, hours,
supporter, gift; (11) Skip on the welcome, examples opt-in and labeled, out in
one tap; (12) notes say "No health details", and the manual says what to keep out.

**Kept on purpose:** "Didn't come" and "Not marked yet" on a volunteer's past
events (facts for a record, in plain words, not a count); the "Training done"
and "Background check done" tick boxes with a date (a yes and a date, not the
report, which principle 12 keeps out); the word "records" (the Dashboard uses
it too); the totals on Volunteer hours and Gifts, which count forward ("hours
given", "money received").

**For Jesse to decide:** none of the names changed. "Supporters" for donors,
sponsors and partners, and "Came" / "Didn't come", are the words on screen; if
NAMI uses others, say which.

**Verified:** `node tests/flow.test.mjs`, 28 steps in a real Chromium, including
five new ones (same start and end time, a half-typed name across a redraw, the
tour, Later, the welcome shown again with records). Screenshots at desktop and
phone width, light and dark. The guides, Word and PDF copies in `dist/` were
built from `QUICKSTART.md` and `USER_MANUAL.md`.

**Still to do, and it is one step:** the shared link still serves 2.0. Publish
`src/app.html` to it as-is (the host adds the html, head and body), the way 2.0
was published. Until then the team link has none of the nine changes above.

**Not verified:** two people editing at once on the shared link (the contract was
read, not exercised), a screen reader, and a real phone in someone's hand. The
shared link is private until Jesse shares it; `EMAIL.md` assumes he has.

## 2.0: the audit of the ChatGPT build, and what replaced it

*(The headings below were the top of this file in 2.0.)*

### Audit of the ChatGPT Events & Volunteers app, and what replaced it

*2026-10-05. The app reviewed is `events-volunteers/` (version 1.0.0), and it is left untouched. Its replacement is this folder.*

### Summary

The ChatGPT build carefully guarded against data errors, but it was built for an evaluator rather than for a coordinator. Three problems could not be fixed with small edits:

1. **Nobody could get in without help.** It needs a ChatGPT sign-in and a ChatGPT Site that its own handoff says was "registered … but never published." Each person who signs in gets a **separate, private** workspace. That means Ed and Jesse could never see the same records.
2. **Recording one volunteer's hours took four records and two checkboxes.** The steps were: Assignment, then Attendance with exact arrival and departure times, then Hours typed in *minutes*, then a separate approval with an "I reviewed actual service time" checkbox. Confirming a volunteer also needed its own acknowledgment checkbox.
3. **The screens worked against the ADHD design principles** (`docs/design-principles.md`) almost everywhere: 16 menu items, "Overdue" counters, upper-case UNKNOWN, raw JSON and "Stable ID" on screen, and every form showing a "Repeated daylight-saving hour" picker.

So the app was rebuilt as one file, keeping the parts that matter: events, volunteer jobs, who came, hours, supporters and gifts, backup, and spreadsheet export.

### Bugs found in the ChatGPT build (from reading `lib/domain.ts`, `lib/service.ts`, `app/workspace.tsx`)

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

### ADHD-principle audit, and what the new app does instead

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

### What was deliberately left out

These were dropped because they cost the coordinator effort on every record and protect against things a 30-person team can settle face to face:

- separate shift / assignment / attendance / hours-approval records
- the verifier-and-basis rule for "Verified"
- the daylight-saving fold picker
- per-record history JSON
- sample-versus-agency scopes

Their data shape is not carried over. The ChatGPT build only ever held fictional samples, so there is nothing to migrate.

### How the new app is checked

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
