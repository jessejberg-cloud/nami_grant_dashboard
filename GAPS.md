# Gaps analysis, before the emails go out

*2026-10-05. Everything in this repo was read end to end against one question: can a NAMI staff member click a link, start, and not lose work or privacy? Three lists: closed in this round, open with an owner, and accepted limits of phase one.*

## Closed in this round

| # | Gap | What was done |
|---|---|---|
| 1 | Grant Radar's Help links to its manual and quick start by relative path, so on the landing site both pages were missing | `scripts/build-site.mjs` copies them beside it; the Help links work |
| 2 | The landing page's "Updated" date read the server's clock, which on GitHub Pages can mean "today" every day | The date is stamped at build time |
| 3 | Guide files were named three ways (`Nami_Grant_`, `Nami_Grant_Radar_`, `Volunteers_and_Events_`) | On the site every guide is named by its program, the same way; each program's own build is untouched |
| 4 | Nothing told testers how to keep work safe on a site with no sign-in | The Dashboard email asks for Practice grants during testing and a weekly backup; the Volunteers & Events email asks one person to save a weekly backup to the shared drive |
| 5 | The landing page address will change when the repo moves to NAMI in phase two, and nothing said so | The project map has the step; the Executive Director's email says a fresh set of links will come |
| 6 | No check-in dates for the test | The Executive Director's email names two: end of week two and week four |
| 7 | The superseded ChatGPT build of Volunteers & Events sat at the top level beside the real one, confusing for a new maintainer | Moved to `archive/events-volunteers/`, every reference updated |
| 8 | The root README opened as the Grant Dashboard's README, so the suite had no map | The README opens as the suite's map: the three programs, where each lives, the plan, the guides, the emails |

## Closed in the round before rollout (decided with Jesse, built)

| # | Gap | What was done |
|---|---|---|
| 17 | Grant Radar's Send page sent people to Dashboard screens that no longer exist (Settings → Agency workspace → Import records) | Radar's Send page, guides, error message and INTEGRATION.md now give the Dashboard's real path: Showing → Our grants, then More tools → Settings & backup → Add records from a file |
| 18 | "Deadline" in Grant Radar, against the suite's own wording rule | "Apply by" everywhere on screen and in the guides |
| 19 | Money gifts would be typed twice, in Volunteers & Events and NAMI's donor system | Money only when tied to an event, with a reminder to record it in the donor system; new gifts start as food or goods |
| 20 | No way back to the landing page from inside a program | All three programs' Help links it |
| 21 | No sign-in sheet for the door, no board summary, no in-kind value | Built in Volunteers & Events 2.2 |
| 22 | The landing page did not say who looks after each program or what it replaces | Each card says both |
| 23 | No single document for leadership and the binder | The handbook: cover, contents, tab pages, the plan, the implementation chapter, the guides and the emails |
| 16 | The suite's name | Kept: NAMI Dashboard Suite |
| 15 | The Grant Radar Claude page was a version behind | Republished with the current version, kept private as a spare |

## Closed after the Dashboard's pre-publish audit

| # | Gap | What was done |
|---|---|---|
| 9 | GitHub Pages was not on | On; the landing page answers |
| 25 | The repository's TypeScript check failed on the archived ChatGPT build of Volunteers & Events (55 errors), so only a Dashboard-only check passed | `tsconfig.json` excludes `archive/`, `grant-radar/`, `volunteers-and-events/`, `guides/` and `docs/`; the standard check passes with 0 errors |
| 27 | README.md and HANDOFF.md described the earlier onboarding and tour | HANDOFF.md opens with the current state and says which sections are history; README.md opens with the suite's map |
| 10 | The live Grant Dashboard was a month behind (September 13) | Republished from ChatGPT on 2026-10-05: Site version 5, running the Dashboard files of `9b5ab68`; records kept, checks passed, the other folders not deployed |
| 26 | Home's "You're all caught up" ignored stuck items and open problems | The next-step card now names a stuck item or an open problem (escalated first) before it says you are caught up |

## Open, with an owner

| # | Gap | Owner | When |
|---|---|---|---|
| 11 | **Volunteers & Events moved to phase two** (NAMI's choice, 2026-10-05: grants first). Its shared Claude page stays private, with nobody invited; in phase two it moves to NAMI's home behind the one sign-in | Jesse | phase two |
| 12 | **Blanks in the emails:** the Executive Director's name, each recipient's name, Jesse's phone | Jesse | before sending |
| 13 | **No internal NAMI person is named.** Phase two cannot start without one; the emails and map ask for it | NAMI | during phase one |
| 14 | **No test with a real staff member yet.** Everything has been tested in a browser by the builder. The first real session will find things this list cannot | NAMI staff, week one | phase one |
| 24 | **The feedback address** does not exist yet; the landing page's button stays off until it does | Jesse | before sending, or soon after |

## Accepted limits of phase one (known, not fixed now)

- **The Grant Dashboard is public and writable with no sign-in.** Anyone with the address can read, change or delete records. The mitigations are Practice grants, weekly backups, and no private details. The fix is phase two's sign-in, or the Microsoft sign-in in `HANDOFF.md`.
- **The programs live under Jesse's accounts** (the Dashboard under a ChatGPT Site with his practice's name in the address; Volunteers & Events and Radar as Claude pages). Phase two moves them to accounts NAMI owns.
- **Grant Radar on the landing page keeps each person's leads in that browser only.** A different computer or a cleared browser starts empty; the backup in Help is the way across. This is Radar's design, and the email says so.
- **The Volunteers & Events solo copy on the landing page shares nothing.** It is for trying the program, and the page says so.
- **Volunteers & Events waits for phase two.** Its volunteer list goes live only behind NAMI's own sign-in; until then its Claude page is private and nobody is invited.
- **No screen-reader session and no real phone in a real hand** for any of the three. Phone width was tested in a browser.
- **No automatic backups anywhere.** Each program makes a backup file in one tap; a person has to tap it.
- **Pages on the landing site share one browser origin** with any other GitHub Pages site under the same account. Nothing else is published there today.

## How to use this list

Items 9 to 12 and 24 are the pre-flight checklist for the emails, written out step by step in `guides/PREFLIGHT.md`. Item 13 is the one ask of NAMI during the test. Everything under "accepted limits" belongs in the phase-two conversation, and the project map already points at it.
