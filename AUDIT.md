# Nami Grant Workspace — prototype audit

Date: 2026-09-11

## Implemented

- Durable D1 record storage; manual create/edit/archive for grants, requirements, and opportunity leads.
- Separate sample and agency workspaces, including server validation of linked grant boundaries.
- Overview with independent award totals, approaching/missing deadlines, missing evidence, and manual expense totals.
- Requirement ownership, due dates, blocked/in-progress/completed states, supporting source/evidence links, notes.
- Evidence URL required for completion. HTTP(S) validation rejects executable URL schemes.
- Manual award and expense totals with calculated remaining balances; overspending stays visible.
- Opportunity intake, a downloadable JSON feed template, and validated import with linked-ID remapping and duplicate checks.
- JSON backup export. Import is additive and rejects collisions; it is not an overwrite/restore operation.
- Recent activity log, atomic record-plus-log writes, stale-edit detection, and server-side conditional updates.
- Responsive layout, labeled form controls, keyboard focus containment and Escape dismissal in the edit form.

## Verification

API handler integration tests run against in-memory SQLite using the production-generated migration and a small D1 adapter. Covered sample isolation, create/read/update, completion evidence, unsafe URLs, stale versions, invalid calendar dates, negative amounts, cross-workspace references, related-record import, duplicate rejection, origin checks, and activity entries. Passed.

TypeScript check and production build both passed before publication. Browser smoke testing in the supervised preview verified loading samples, task navigation, completion persistence after reload, and guided-tour navigation. Desktop layout was visually inspected. Mobile breakpoints were code-reviewed; no device-emulated mobile or full accessibility audit was completed. The SQLite adapter verifies route logic and SQL, not the hosted Cloudflare runtime. Successful deployment confirms publication, not a browser interaction audit.

## Prototype boundaries

- No agency credentials, actual funder records, or verified award rules were available. Sample records are fictional and labeled.
- Calendar/email reminders, weekly Grant Radar searches, accounting sync, and shared-drive integrations are not connected or scheduled.
- Evidence is linked by URL, not uploaded or substantively verified. A link is not proof of compliance.
- Owner names are assignment labels, not authenticated roles. The Site is currently public; assignments and workspace selection are not access controls.
- Activity records track action summaries; they are not an immutable regulatory audit trail with actor identity or field-level history.
- Budget figures are manual totals, not transaction accounting, reconciliation, or determinations of allowable expenses.
- Date-only deadlines use the UTC calendar day and a 14-day attention window; funder time zones and submission times must be recorded in notes.
- No autonomous actions, grant applications, outbound messages, payments, or agency integrations occur.

## Continuation

Reuse `.openai/hosting.json` project ID and this repository. Do not create a replacement Site. Follow Sites skills to reopen, modify, validate, and publish. Read `INTEGRATION.md` before connecting Grant Radar. Finance and dashboard hub are separate future projects.

## Audit-and-completion update

Presentation gaps completed: five synthetic grant scenarios; tasks distinct from requirements; prerequisite validation, cycle checks and deadline-order checks; issues with severity/escalation owner; financial and source freshness; ranked attention reasons; safe sample reset; nine-step guided demo; opportunity promotion; versioned imports; changed-field action summaries; presenter, quick-start and administrator guides. Failed loading shows UNKNOWN instead of reassuring zero counts. All flagged records remain accessible in the home queue.

Verification: both API/SQLite integration suites pass; TypeScript and production build pass. Validation includes dependency completion and reopening, impossible ordering, stale financial snapshots, escalation ownership, repeat promotion rejection, schema versions, and reset isolation, in addition to the original lifecycle checks.

Remaining limitations: no automatic deadline propagation, multiple prerequisites, verified evidence content, accounting reconciliation, connector execution, authenticated role enforcement or immutable audit history. Import is additive, not full recovery; activity is excluded from record export. Concurrent writes affecting different dependent records require production hardening. The Site is public and the Agency workspace is not a security boundary; synthetic evaluation data only.

## Onboarding and user manual release

2026-09-11 · onboarding-v1. Inspected README, AUDIT, PRESENTER, QUICKSTART, HANDOFF, INTEGRATION, UI and records API. The existing nine-step guided demo was present; first-time onboarding was absent. Added a seven-step, keyboard-operable orientation with skip, back, finish, browser-local completion, Help reopening, and read-only sample navigation. No record writes or reset occur in onboarding. No theme/layout preference controls were invented. Help remains available during record-load failure.

Corrected stale version-1-only/three-record-kind claims: current template/export is schemaVersion 2; importer accepts 1, 2 or omitted legacy version and all five record kinds. Corrected claims that Site access protects agency data: current Site audience is public, route handlers have no authentication or role enforcement, both workspaces are returned by GET, and assignments are labels. Sharing was not changed.

USER_MANUAL.md is the canonical manual source. The generator produces online HTML and editable Word; the reviewed Word rendering supplies the PDF. All nine manual pages and the one-page quick start were visually inspected. PDF contains 19 navigable contents links. Updated README, QUICKSTART, HANDOFF and INTEGRATION; PRESENTER remains the existing demo script.

Local browser QA: first visit, skip/reload, Help reopening, back/continue, keyboard Enter, completion/reload, and sample grant → requirement → prerequisite navigation passed. Desktop and 390-pixel iframe viewport layout visually reviewed; this is responsive layout testing, not physical-phone/device emulation. Help/manual download actions and online contents navigation checked. Existing API/SQLite suites pass, including save conflicts, dependencies, imports, reset isolation and promotion. TypeScript passes. No production records were altered for testing. No full assistive-technology audit or production integration tests were performed.

## Local foundation release — 2026-09-13 verification

local-foundation-v1 extends the existing app with grant-specific setup and customizable data collection. No hosted records were reset or modified for testing. Existing larger synthetic scenarios and advanced workflows remain available.

Added: atomic three-step grant/initial-requirements setup; editable/hidden custom fields with targets and collection instructions; aggregate ZIP counts; manual payment recipients; fictional stories and photo links; grant cards, requirement and outcome progress, dated staff assessment. Existing onboarding was revised and its browser completion key preserved. Schema 3 exports/imports nested tracking; versions 1, 2 and omitted legacy versions remain accepted. Photo upload, participant rosters, automatic outcome aggregation and reconciled accounting are not implemented.

Three API/SQLite suites pass, including atomic setup rejection, tracking validation, unsafe links, negative counts, duplicate field IDs, hidden-value preservation, version conflicts, schema-3 transfer and workspace isolation. Existing dependency, evidence, reset and promotion checks pass. TypeScript and the production build pass. Browser testing used local synthetic data: first visit, skip/reload, reopening, Back/Continue via keyboard, finish/reload, grant setup, saved measures/ZIP/payment/story links, award/end/report dates and staff assessment. Fixed input events so native date values persist across wizard steps and saves; field identifiers also work in the HTTP preview. Desktop and 390-pixel iframe layouts reviewed (not physical-device or assistive-technology testing). Help/manual navigation and download asset checks completed.

Manual: USER_MANUAL.md is the source for online HTML and editable Word, with PDF rendered from Word. All 11 manual pages and the one-page quick start were visually inspected. The manual PDF has 22 contents links. Administrator/integration/presenter guides updated. Site audience remains public with no authenticated agency authorization. Publication success does not establish production readiness.
