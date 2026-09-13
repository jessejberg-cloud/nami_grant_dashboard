# Administrator handoff

## Existing application

Preserve the existing Site ID in `.openai/hosting.json`. The GitHub and original Site histories were joined with a merge; do not recreate the application. JSON payload extensions require no database schema migration; the existing records/activity tables remain in use. Older records without new fields render UNKNOWN.

## Configuration still required for production

| Connection | Intended boundary | Agency work required |
|---|---|---|
| Entra ID / SSO | Agency user identity and roles | Tenant registration, least-privilege authorization, server-side role enforcement and access review |
| SharePoint / OneDrive | Authoritative documents and evidence links | Site/library mapping, permissions, link verification and version metadata |
| Outlook / Microsoft Calendar / Teams | Reminders and escalation delivery | Time zones, recipients, deduplication, delivery receipts, retries and failure monitoring |
| Excel / Power Automate | Reviewed staging and scheduled transfers | Column mapping, validation, approvals, error queue and ownership |
| Accounting system | Read-only totals and reconciled snapshots | Choose vendor adapter, grant/fund mapping, accounting period, reconciliation and source timestamps |
| Grant Radar | Opportunity review queue | Stable source IDs, provenance, eligibility uncertainty, machine auth, idempotency and run/failure logs |
| Aggregate outcome systems | Program totals only | Approved aggregate fields, validation and freshness; exclude participant records |

All connectors are NOT CONNECTED. No unattended searches, reminders, messages or automated accounting actions run. The dashboard complements the accounting and document systems; it does not replace them.

## Data operations

- Export selected-workspace JSON before changes. Version 2 adds task/issue kinds, dependsOn, financialAsOf, verifiedOn, severity and escalationOwner. Version 1 remains accepted.
- Import is additive, 1–100 records, with ID and dependency remapping, validation, duplicate rejection and same-workspace linkage. Importing a backup into a populated workspace is not a restore. Split larger datasets carefully; related records should stay in the same batch or reference existing IDs.
- Reset deletes sample records and reseeds five scenarios in one database batch. Agency records are preserved; action history is retained.
- Establish agency-managed database backup and tested recovery before production. Record exports exclude activity history and do not preserve original IDs on import.
- Current activity is a shared recent-action summary with changed field names, not an immutable audit trail with before/after values and authenticated actors.
- A single prerequisite per task/requirement is supported. Cycles, impossible deadline ordering and premature completion are rejected. Automatic date propagation, business calendars and multiple prerequisites are future work.
- Freshness threshold is currently 30 calendar days; deadline attention is 14 days. Date-only deadlines require funder timezone/time notes. Verification dates are manual assertions.
- The current Site is public. The records API has no authentication/role enforcement; both workspaces are returned on reads. Assignments are display labels, not permissions. Review authentication, CSRF, scoped authorization, rate/size limits and concurrent writes before multi-user deployment.

## Verification and release

Run `node --test tests/records.test.cjs`, `node node_modules/typescript/bin/tsc --noEmit`, and the existing production build. The integration tests use SQLite with a D1 adapter and the production migration. They are not a substitute for live agency integration acceptance tests.

For a new local database, apply `drizzle/0000_thankful_gwen_stacy.sql` to the local D1 binding using Wrangler before preview. Do not apply seed/reset operations to agency data.

Use PRESENTER.md for the leadership script and QUICKSTART.md for operational orientation. Share the existing Site only with agency-approved viewers; the existing public access setting has been preserved. This evaluation Site must contain synthetic or non-sensitive demonstration records only.

## Onboarding and documentation release

2026-09-11 · onboarding-v1, based on 8ea3311. No existing first-time orientation was present; the nine-step guided demo is preserved. Orientation stores only completion/skip status in localStorage (`nami-grants-onboarding-v1`), without modifying records or representing an authenticated profile. Help reopens orientation and links to manuals. There are no persistent theme/layout preferences.

Maintain USER_MANUAL.md and QUICKSTART.md; scripts/build-manuals.py generates HTML and Word from them. Render DOCX to the public PDFs, inspect every page, and commit the sources and downloads together. Never reset production or shared sample data merely to test onboarding. Browser QA must use local synthetic data.

## Local foundation release — 2026-09-12

The existing onboarding and Help are revised, not duplicated. Browser onboarding key remains unchanged so returning evaluators are not forced through it again. Per-grant custom fields and collection entries are durable shared record settings; no authenticated profiles were added. Grant setup validates before one atomic write batch. Existing awards are not reset or converted. The $5,000 sample shortcut opens an unsaved draft.

Export/template schema is now 3; importer also accepts 1, 2 and omitted legacy versions. Grant JSON adds optional tracking; no D1 schema migration. Define household/person counting rules, ZIP deduplication, reporting periods, staff review cadence, and outcome units before adoption. Budget snapshots and payment notes must be reconciled manually. Photos remain external links. Confidential stories/photos require a protected agency deployment with approved consent and retention rules.

Maintain USER_MANUAL.md and QUICKSTART.md as the sources for generated HTML, Word and reviewed PDF. Use three API suites, TypeScript, production build and synthetic local browser checks for this release. Existing larger-grant scenarios and advanced functions remain available for regression demonstration.
