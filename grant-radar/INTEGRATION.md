# Nami Grant Radar Integration Contract

Revision date: 2026-09-12. Application version: 1.0.1.

## Grant Dashboard manual handoff

Radar exports a top-level JSON object with `schemaVersion: 2` and a `records` array. Each record uses `kind: opportunity`. This matches the Grant Dashboard contract inspected at source commit `931d5b8` on 2026-09-12. The dashboard accepts schema versions 1, 2, or omitted legacy version, validates 1-100 records, and imports additively.

The dashboard rejects a duplicate with the same kind, case-insensitive trimmed title, and exact source URL in the selected destination workspace. It does not overwrite or merge. The destination workspace controls the imported record's sample/agency scope. The dashboard replaces import IDs but Radar also includes the stable external ID in notes.

| Radar field | Dashboard field | Mapping |
|---|---|---|
| `externalId` | `id` and `notes` | Used as import-local ID; retained in notes because destination ID changes |
| record type | `demo` hint and `notes` | Destination workspace is authoritative; human-readable label stays in notes |
| title | `title` | Direct |
| owner | `owner` | Display label only |
| confirmed deadline | `due` | Rolling and unknown dates export blank |
| Radar status | `status` | New -> New; Verification needed, Reviewing, Shortlisted -> Reviewing; Declined -> Declined; Closed/Archived -> Archived |
| maximum/minimum known amount | `amount` | Maximum when known, otherwise minimum; zero when unknown; never an award |
| official source | `source` | Direct HTTP(S) URL |
| provenance, fit, gaps, restrictions, route, check date | `notes` | Serialized human-readable lines because dashboard opportunity schema lacks dedicated fields |
| checked date | `verifiedOn` | Date portion only; still a manual source-check assertion |

The export also supplies `grant: ""`, `spent: 0`, and `updated: ""`. Import validation controls destination timestamps and IDs.

## Promotion boundary

Import creates opportunity leads. It does not create or confirm an award. The existing Grant Dashboard may promote an opportunity to a `Pending` grant only after a separate human decision. Funding must be verified before activation.

## Future authenticated connection

An agency-owned service should use stable external IDs, idempotency keys, schema validation, a preview and approval queue, scoped authorization, run and delivery logs, retries with backoff, dead-letter handling, and reconciliation. Do not connect unattended jobs to the current Grant Dashboard public mutation endpoint.

## Future suite home contract

A future meta-dashboard may request or derive these summaries for an authorized viewer:

- active lead count
- leads with confirmed deadlines in the next 30 days
- leads awaiting verification
- shortlisted lead count
- last attempted and last successful discovery times
- search state: succeeded, partial, failed, or never run
- navigation URL to Grant Radar

Do not compute an overall compliance, financial, or organizational health score. Authorize source data before returning summaries.

Illustrative response:

```json
{
  "schemaVersion": 1,
  "application": "grant-radar",
  "generatedAt": "2026-09-12T12:00:00Z",
  "searchState": "manual-success",
  "lastAttemptedAt": "2026-09-12T11:31:00Z",
  "lastSuccessfulAt": "2026-09-12T11:31:00Z",
  "activeLeads": 3,
  "deadlinesWithin30Days": 1,
  "awaitingVerification": 3,
  "shortlisted": 0,
  "navigationUrl": "https://nami-grant-radar.brainspottingonline.chatgpt.site"
}
```

## Audit corrections in version 1.0.1

Exports now include top-level demo and prohibit mixed sample/public batches. The destination UI still controls final workspace scope. Invalid IDs over 100 characters, unsafe URLs, invalid amounts, and oversized notes are rejected before download. Full funding range, description, and freshness are preserved in notes. No truncation is performed. The exact upstream validator was executed against an isolated fictional Radar export.
