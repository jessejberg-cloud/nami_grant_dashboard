# Nami Grant Radar Administrator and Adoption Handoff

Revision date: 2026-09-12. Application version: 1.0.0.

## Current boundary

The published prototype is a separate owner-private Site. It has no agency SSO, role enforcement, shared database, Microsoft 365 connection, email, calendar, accounting connection, or unattended search. Labels such as Owner are workflow labels, not permissions. Browser-local storage is suitable only for evaluation with public or fictional information.

## Adoption checklist

- Assign a business owner, technical owner, source-verification owner, and backup owner.
- Approve a written search profile without treating preferences as organization facts.
- Verify legal applicant name, tax status, service geography, affiliate relationship, partnership requirements, and application authority outside the Radar.
- Choose an agency-controlled identity provider and enforce least-privilege roles.
- Move records and activity history to an authenticated shared datastore with encryption, retention, backups, tested recovery, audit logs, and concurrency control.
- Add staging, production, and rollback procedures.
- Establish source-verification standards, freshness thresholds, deadline/time-zone rules, and approval gates.
- Validate the Grant Dashboard handoff in a staging workspace and reconcile every imported record.
- Complete accessibility, privacy, security, legal, records-retention, and procurement reviews.
- Train staff with the onboarding, guided demo, quick start, and user manual.

## Weekly automation activation

Weekly discovery is not running. A production service needs:

- Agency-owned scheduler such as Azure Functions/Logic Apps, Power Automate, GitHub Actions in an agency repository, or another approved platform.
- Agency-managed service identities and source/API credentials where required. Never reuse the prototype creator's personal credentials.
- A source registry with allowed domains, crawl terms, cadence, rate limits, robots/terms review, and per-source parsing strategy.
- Search/API budget, cost cap, and alert threshold.
- Durable run records containing attempt, success, partial failure, sources checked, records added/changed, retry count, and terminal error.
- Exponential retry policy, dead-letter queue, and staff-visible failure state. A failed run must retain the prior baseline and must not report zero opportunities.
- Conservative duplicate matching using funder/source IDs first, then normalized official URL and title. Potential duplicates require human review.
- Field-level refresh proposals. Preserve staff owner, decision, notes, next action, and history. Do not silently overwrite reviewed data.
- Monitoring and an accountable responder for stale sources, repeated failures, unexpected volume, schema rejection, and cost anomalies.

## Microsoft 365 option

An agency could use Entra ID for identity, SharePoint Lists or Dataverse for reviewed records, Power Automate or Azure Functions for scheduled discovery and approvals, Teams/Outlook only for authorized notifications, and SharePoint/OneDrive for source documents. Exact products, licensing, retention, permissions, and cost require agency review.

## Recovery

The prototype has no shared backup. For production, implement scheduled encrypted backups, retention, restore drills, export validation, source reconciliation, and a documented incident owner. Browser downloads are not a database backup.

