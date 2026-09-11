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
