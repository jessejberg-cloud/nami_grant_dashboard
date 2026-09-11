# Agency integration handoff

The prototype currently supports manual entry and JSON import in Settings. No credential is required for local file import after the authorized user opens the Site. Do not connect unattended systems to the interactive mutation endpoint without implementing authentication and scoped authorization.

## Grant Radar file contract

Top-level object: `{"schemaVersion":1,"records":[...]}`. The UI currently validates each record and imports up to 100 records into the selected workspace. `schemaVersion` is descriptive and version 1 is the current supported shape.

Record fields:

- `id`: optional import-local string. IDs are replaced on import, and related grant references are remapped.
- `kind`: `opportunity`, `grant`, or `requirement`.
- `title`: required text, max 180 characters.
- `owner`: text, max 120 characters; a display label.
- `grant`: optional linked grant ID (same workspace).
- `due`: optional valid `YYYY-MM-DD`.
- `status`: opportunities: New, Reviewing, Applying, Declined, Archived; grants: Active, Pending, Closed, Archived; requirements: Open, In progress, Blocked, Complete, Archived.
- `amount`, `spent`: nonnegative numeric dollar totals, maximum 1 billion.
- `source`: optional HTTP(S) URL; required for completed requirements.
- `notes`: text, max 10,000 characters.
- `demo`: overwritten by the selected import workspace.
- `updated`: overwritten on save/import.

Imports add records in an atomic database batch and reject duplicate kind/title/source combinations in the selected workspace. This is deliberately conservative; a reviewer can edit an existing lead when a funder updates an opportunity. No record overwrite occurs during import.

## Future connection work

The agency should add machine authentication, stable external source IDs, idempotent ingestion, review queues, provenance and last-checked timestamps, eligibility uncertainty, run logs, failure indicators, and integration-specific permissions before enabling weekly Radar ingestion. Keep discovery separate from award confirmation. Configure scheduling in the agency's environment and verify monitoring before showing it as connected.

For calendars, implement explicit deadline time zones, lead times, deduplication, delivery receipts, and escalation ownership. For accounting, use transaction IDs and mappings, reconciliation states, accounting period boundaries, and restricted funding rules. Do not treat imported accounting rows as approved or automatically allocate expenses to grants.

Future meta-dashboard tiles can open this Site using its published URL. Respect each destination's authorization and expose only summaries the viewer is allowed to see. Do not manufacture aggregate health scores.
