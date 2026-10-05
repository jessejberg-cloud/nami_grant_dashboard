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

## Open, with an owner

| # | Gap | Owner | When |
|---|---|---|---|
| 9 | **GitHub Pages is not on.** Until it is, the landing page address and every guide link in the emails do not answer. Settings → Pages → Deploy from a branch → `main`, folder `/docs` | Jesse | before sending |
| 10 | **The hosted Grant Dashboard has not been republished** since its second look and the guide rewording, so its live Help, welcome and guides are the earlier words. It needs a publish from the Site's own tooling | Jesse | before sending, or say so in the email |
| 11 | **The Volunteers & Events shared page is private** until each tester is invited as an Editor from its Share menu. Without that, the link opens nothing | Jesse | before sending |
| 12 | **Blanks in the emails:** the Executive Director's name, each recipient's name, Jesse's phone | Jesse | before sending |
| 13 | **No internal NAMI person is named.** Phase two cannot start without one; the emails and map ask for it | NAMI | during phase one |
| 14 | **No test with a real staff member yet.** Everything has been tested in a browser by the builder. The first real session will find things this list cannot | NAMI staff, week one | phase one |
| 15 | **The Grant Radar Claude page** still carries the earlier guide words ("open the Grant Radar link"). The landing page uses the newer file copy, so staff never see it unless sent that page directly | Jesse | when convenient |
| 16 | **Suite name.** "NAMI Dashboard Suite" is a working title on the landing page, the guides, the map and the emails | Jesse | before sending, if it changes |

## Accepted limits of phase one (known, not fixed now)

- **The Grant Dashboard is public and writable with no sign-in.** Anyone with the address can read, change or delete records. The mitigations are Practice grants, weekly backups, and no private details. The fix is phase two's sign-in, or the Microsoft sign-in in `HANDOFF.md`.
- **Two programs live under Jesse's accounts** (the Dashboard under a ChatGPT Site with his practice's name in the address; Volunteers & Events and Radar as Claude pages). Phase two moves them to accounts NAMI owns.
- **Grant Radar on the landing page keeps each person's leads in that browser only.** A different computer or a cleared browser starts empty; the backup in Help is the way across. This is Radar's design, and the email says so.
- **The Volunteers & Events solo copy on the landing page shares nothing.** It is for trying the program, and the page says so.
- **Volunteers & Events needs a Claude account per tester.** That one sign-in is what protects the volunteer list in phase one.
- **No screen-reader session and no real phone in a real hand** for any of the three. Phone width was tested in a browser.
- **No automatic backups anywhere.** Each program makes a backup file in one tap; a person has to tap it.
- **Pages on the landing site share one browser origin** with any other GitHub Pages site under the same account. Nothing else is published there today.

## How to use this list

Items 9 to 12 are the pre-flight checklist for the emails. Item 13 is the one ask of NAMI during the test. Everything under "accepted limits" belongs in the phase-two conversation, and the project map already points at it.
