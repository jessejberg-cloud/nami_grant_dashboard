# Agency integration handoff

The prototype currently supports manual entry and JSON import in Settings. The Site is public and local file import is not restricted by agency authentication. Both workspaces share access. Do not connect unattended systems to the interactive mutation endpoint without implementing authentication and scoped authorization.

## Grant Radar file contract

Top-level object: `{"schemaVersion":2,"records":[...]}`. The importer accepts numeric versions 1 and 2 or an omitted legacy version, rejects others, and applies the current validator to all accepted versions. Import 1–100 records; the request body limit is 2,000,000 characters. Only JSON is accepted, not CSV or XLSX.

Record fields:

- `id`: optional import-local string. IDs are replaced on import, and related grant references are remapped.
- `kind`: `opportunity`, `grant`, `requirement`, `task`, or `issue`.
- `title`: required text, max 180 characters.
- `owner`: text, max 120 characters; a display label.
- `grant`: optional linked grant ID (same workspace).
- `due`: optional valid `YYYY-MM-DD`.
- `status`: opportunities: New, Reviewing, Applying, Declined, Archived; grants: Active, Pending, Closed, Archived; requirements/tasks: Open, In progress, Blocked, Complete, Archived; issues: Open, Escalated, Resolved, Archived.
- `amount`, `spent`: required nonnegative numeric dollar totals, maximum 1 billion.
- `source`: optional HTTP(S) URL; required for completed requirements.
- `notes`: text, max 10,000 characters.
- `demo`: overwritten by the selected import workspace.
- `updated`: overwritten on save/import.

Additional optional fields:

- `dependsOn`: one task/requirement ID in the same workspace, max 100 characters. Import-local IDs are remapped. Cycles, premature completion and impossible date ordering are rejected.
- `verifiedOn`, `financialAsOf`: valid YYYY-MM-DD dates no later than today. Empty means UNKNOWN; over 30 days old means STALE.
- `severity`: Low, Medium, High or Critical (default Medium).
- `escalationOwner`: display label, max 120 characters; required for an Escalated issue.

`kind`, `title`, `status`, `amount` and `spent` are required. Other strings may be omitted. IDs are max 100 characters; source URLs max 2000. `demo` is supplied by the selected destination workspace. Import rejects duplicate nonempty IDs and duplicate kind/title/source combinations (title case-insensitive, source exact). Validation occurs before any batch writes.

Imports add records in an atomic database batch and reject duplicate kind/title/source combinations in the selected workspace. This is deliberately conservative; a reviewer can edit an existing lead when a funder updates an opportunity. No record overwrite occurs during import.

## Future connection work

The agency should add machine authentication, stable external source IDs, idempotent ingestion, review queues, provenance and last-checked timestamps, eligibility uncertainty, run logs, failure indicators, and integration-specific permissions before enabling weekly Radar ingestion. Keep discovery separate from award confirmation. Configure scheduling in the agency's environment and verify monitoring before showing it as connected.

For calendars, implement explicit deadline time zones, lead times, deduplication, delivery receipts, and escalation ownership. For accounting, use transaction IDs and mappings, reconciliation states, accounting period boundaries, and restricted funding rules. Do not treat imported accounting rows as approved or automatically allocate expenses to grants.

Future meta-dashboard tiles can open this Site using its published URL. Respect each destination's authorization and expose only summaries the viewer is allowed to see. Do not manufacture aggregate health scores.
