# Events and Volunteers Integration Contracts

Version 1.0.0 · October 5, 2026

## Existing suite boundary

Inspected suite GitHub commit 05a758f534b9abe35ec375185027b7680b4267df. The Grant Dashboard receiving record contract is schemaVersion 3, accepting versions 1, 2, 3 and legacy omitted version. It supports opportunity, grant, requirement, task and issue, not event/volunteer/donation records. It replaces IDs, imports additively, and is documented as having a public unauthenticated mutation endpoint. No direct handoff or unattended writes are implemented.

Grant Dashboard owns awards and grant requirements. Radar owns opportunity discovery. This app owns event/volunteer coordination and donation relationship records. Donation amounts are not automatically accounting revenue, grant match or tax valuations.

## Backup v1

Envelope: application=nami-events-volunteers, schemaVersion=1, scope=sample|agency, exportedAt, records, history, preferences. Each record has stable id, kind, sample, title, status, updated and kind-specific scalar fields. Kinds: event, volunteer, shift, assignment, task, attendance, hours, sponsor, partner, donation.

Links: shift.event and task.event → event; assignment.shift → shift and assignment.volunteer → volunteer; attendance.assignment → assignment; hours.attendance → attendance; donation.contributor → sponsor or partner; optional donation.event → event. All links must exist in the same scope. Stable IDs are preserved. No CSV import exists.

Merge skips identical stable-ID records and rejects conflicts and semantic duplicates. Replace swaps selected-scope records only after exact confirmation, preserves the other scope and existing history, and labels imported history. Preferences are previewed, not silently applied. Full validation precedes a single conditional database write.

## Suite summary v1

Manual export contains application, schemaVersion, scope, generatedAt, automationState=not-configured and metrics. Metrics events, shifts, tasks, verification and hours each contain count, human-readable definition and a navigation URL. Counts are derived from loaded selected-scope records. No export is available on a failed load. URLs navigate to the app section and still require destination authorization; the file grants no access.

A future authenticated meta-dashboard should return state=unknown when reading fails, include source freshness, apply viewer authorization and scope, and never convert failed retrieval to zero. No overall organizational/compliance score is defined.

## Reviewed aggregate v1

Manual package: type=reviewed-aggregate, scope, generatedAt, review assertion, inclusive date period, optional eventId/grantId, summary of uniqueVolunteers, assignments, attendances, approvedHours and pendingHours. Names, contacts and volunteer IDs are omitted. User acknowledgment is a review assertion, not agency sign-off.

Mapping is manual: eventId identifies the event source; grantId is an unverified external reference; approvedHours may support a narrative aggregate after review. Unique volunteer counts are not families served or general attendee totals. No outcomes, diagnoses, ZIPs, photos, valuation or compliance determination are inferred. Record-level provenance and detailed approval history are lost in aggregation; retain a source backup for reconciliation.

Do not import this package into the Grant Dashboard record importer. Agency reviewers can reference a reviewed aggregate file from a grant requirement after verifying its relevance. It does not set requirement status. Deduplicate reviewed evidence by source event ID, period and export timestamp; later revisions supersede deliberately, not by summing files.

## Microsoft 365 future activation

All entries below are Requires agency configuration.

- Entra ID: agency tenant registration, group/role mapping, least privilege, server-side tenant and role enforcement, access reviews and emergency revocation. Use managed identity where available; secrets belong in an agency vault, never GitHub or the browser.
- SharePoint/Lists: map stable source IDs, event/volunteer/relationship lists, scopes and fields. Use explicit item permissions, ETags, idempotency keys and conflict review. Do not assume a workspace label is authorization.
- Outlook: agency-owned mailbox/calendar and narrowly scoped permissions. Require reviewed recipient identity, explicit approval before sending, stable event UID, cancellation sequence and delivery reconciliation. Manual ICS in this release is not synchronized.
- Teams: approved team/channel mapping and service identity. Limit payloads to necessary operational information. Record delivery IDs and receipt/failure; no sensitive volunteer reports.
- Power Automate: agency-owned flows, connection references and scheduler; documented owners and backup owners; approved licensing. Stage changes for human review. Retry transient failures with bounded exponential backoff; route permanent failures to an error queue. Use source IDs plus operation/version as duplicate keys and reconcile after timeout.

Before activation, test least-privilege reads/writes in agency staging, expired credentials, partial failure, retries, duplicate messages, canceled events, DST, restore and monitoring alerts. Separate synthetic examples from actual runs. Record attempted/succeeded/partial/failed states and last successful sync. Assign a responder and disable unsafe flows on repeated failures. No personal account is a substitute.
