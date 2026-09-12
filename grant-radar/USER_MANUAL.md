# Nami Grant Radar User Manual

Revision date: 2026-09-12. Application version: 1.0.0.

Nami Grant Radar helps the Associate Director and development or grant-management staff decide which funding opportunities deserve attention, what must be verified, and what to pursue next. It organizes research before a lead enters the existing Grant Dashboard. The Executive Director may review recommendations and decisions. The Radar does not confirm eligibility, submit applications, contact funders, track awarded-grant requirements, or establish access permissions.

This is an evaluation prototype. The initial published Site is owner-private. Its records, activity, preferences, and onboarding state are stored in the current browser profile. Use only public or fictional information. Do not enter confidential, client, employee, donor, financial, credential, or production agency information.

## Contents

1. Start and orient
2. Understand record labels and uncertainty
3. Use the home view
4. Review an opportunity
5. Search and filter
6. Create and edit records
7. Assign and decide
8. Configure the research profile
9. Verify sources and refresh records
10. Handle duplicates and changes
11. Understand search health
12. Export to the Grant Dashboard
13. Use the guided demonstration
14. Troubleshoot
15. Limitations and agency setup
16. Worked examples
17. First-week checklist
18. Administrator adoption checklist
19. Glossary

## 1 Start and orient

On the first visit in a browser profile, a seven-step orientation appears on Home. It explains the Radar's purpose and boundaries, real-public and fictional labels, uncertainty, explainable fit, preferences, and a useful first action. Continue and Back move between steps. Skip onboarding dismisses it. Finish records completion in this browser. Neither choice edits or resets opportunity records.

Use Help and choose Reopen onboarding at any time. Clearing Site data, using private browsing, or opening another browser or device can make onboarding appear again. The completion key is `nami-radar-onboarding-v1`. It is not a user account, identity, permission, training certification, or agency approval.

The orientation may open the fictional Community Peer Wellbeing lead. This is a safe exploration route. It does not connect an account, change a record, or start a search.

## 2 Understand record labels and uncertainty

Every opportunity is labeled as either REAL PUBLIC LEAD or FICTIONAL SAMPLE.

- REAL PUBLIC LEAD means the record came from public research, usually an official funder page. It does not mean the opportunity is open, suitable, or eligible for the agency.
- FICTIONAL SAMPLE means the opportunity and funder are invented for practice. Do not treat the example URL, deadline, amount, or eligibility as real.

Source state describes research freshness. CURRENT means a source was checked on the displayed date. STALE means staff should recheck it. UNKNOWN means a check date or source condition is not established. None of these states confirms agency eligibility.

Deadline state is separate. CONFIRMED means a date was recorded from the source; verify the time zone and final submission time. APPROACHING means a confirmed date is within 30 days. ROLLING means the source describes an ongoing or rolling route. UNKNOWN means no dependable date is recorded. CLOSED means the deadline passed or staff marked the record closed.

## 3 Use the home view

Home summarizes five actionable signals:

- New public leads have not entered a decision workflow.
- Approaching deadlines are confirmed dates within 30 days.
- Needs verification includes unanswered questions or non-current sources.
- Promising signals count leads with at least two visible fit reasons and no recorded disqualifier. This is not an eligibility score.
- Search health states whether discovery is manual, scheduled, successful, partial, failed, or unavailable.

The priority review queue raises approaching deadlines, shortlists, verification gaps, and unacknowledged source changes. Open any row for detail. A blank queue does not prove that no funding exists; check Search health first.

## 4 Review an opportunity

Open Opportunities and select a row. Confirm the record label before doing anything else. Review the official source, description, geography, applicant eligibility, amount, deadline and time zone, application route, matching-fund requirement, restrictions, owner, source state, and next action.

The Explainable fit panel shows three separate ideas:

- Why it may fit lists observable matches to the research profile.
- Verify before pursuing lists eligibility gaps and unanswered questions.
- Disqualifiers or blockers lists conditions that currently prevent action, such as a closed cycle or unconfirmed open application.

There is no hidden ranking score. Counts summarize the displayed reasons, gaps, and disqualifiers. Staff remain responsible for reading the source and making the decision.

## 5 Search and filter

Opportunities provides text search, status filtering, and record-type filtering. Text search covers title, funder, description, owner, notes, and next action. Status can isolate New, Verification needed, Reviewing, Shortlisted, Declined, Archived, or Closed records. Record type isolates real public leads or fictional samples.

Filters are current-page controls and are not saved across reloads. Opportunity records persist separately in browser storage.

## 6 Create and edit records

Choose Add opportunity from Home or Opportunities. Enter a title and classify the record correctly. Use Fictional sample unless the record comes from an actual public source. For a real public lead, include the official URL, stable source or funder identifier when available, source state, and actual check information.

Record confirmed deadlines only when the source provides a dependable date. Record a time zone or explicitly say it was not stated. Use rolling or unknown when appropriate. A funding amount is a possible range, not an award. Put one fit reason, gap, or disqualifier on each line.

Save opportunity writes the record to this browser. Edit record updates it and adds local activity/history. Browser-local saving does not create a shared record or backup.

## 7 Assign and decide

Owner is a workflow label. It does not grant access or send a notification. Use the status sequence to make the team's decision visible:

- New: captured but not triaged.
- Verification needed: potentially relevant, but essential facts are unresolved.
- Reviewing: assigned and under active review.
- Shortlisted: staff recommend deeper pursuit analysis; this still does not establish eligibility.
- Declined: staff chose not to pursue.
- Archived: retained outside the active pipeline.
- Closed: the opportunity or cycle is closed.

Record the next concrete action, such as “Confirm Washington County service eligibility with program leadership.” Archive preserves notes and history. There is no automatic application, email, calendar event, or funder contact.

## 8 Configure the research profile

Search profile stores browser-local research preferences for geography, program interests, applicant types, amount range, deadline horizon, exclusions, and keywords. Defaults emphasize mental health, peer support, family education, advocacy, community outreach, and southeastern Wisconsin.

Preferences guide research; they are not facts. The separate Organization facts section remains unconfigured for legal applicant name, tax status, authorized service area, required partnerships, and application authority. Verify those facts through agency governance and authoritative records before use.

Save preferences writes `nami-radar-preferences-v1` in this browser profile. Restore defaults affects preferences only; it does not reset opportunities or connect accounts.

## 9 Verify sources and refresh records

Open the official source in a new tab. Confirm that the page is the intended funder source and check open/closed state, deadline, submission time zone, applicant types, service area, award range, application route, matching funds, restrictions, and contact instructions.

Return to the record and choose Record source check. Enter the date, source state, deadline type/date, funding range, and a note describing what remained uncertain or changed. This action records what a human observed. It does not fetch the page or perform a live search.

If watched source fields changed, the record displays Source changes to review. Staff ownership, review status, notes, and next action remain intact. Acknowledge changes only after reviewing their effect on the decision.

## 10 Handle duplicates and changes

Radar uses a conservative stable key. It first compares the external source identifier. If none exists, it compares normalized title plus official source URL. A create or edit that matches an existing stable key is blocked and points staff to the existing record.

Do not change a title merely to bypass duplicate protection. Open the existing record and update its source check. Potential fuzzy duplicates, reorganized funder pages, and renamed cycles still require human review.

Source refresh preserves staff owner, decision status, notes, next action, and history. It flags changed deadline, deadline type, time zone, funding minimum/maximum, restrictions, application route, or source state. It does not silently overwrite reviewed staff information.

## 11 Understand search health

Search health distinguishes the last attempted run from the last successful run. It reports sources checked, records added or updated, failures, automation state, and coverage limits.

The prototype contains one actual manual research history entry dated September 12, 2026. Four official sources were reviewed and four public research records were added. One published open cycle was found, one closed cycle was retained for monitoring, and two research leads remained unconfirmed.

The separate fictional failure example demonstrates the required error state. A failure must retain the prior successful baseline and show the error. It must not replace results with “no opportunities.”

Weekly automation is not running. The interface accurately says Requires agency configuration.

## 12 Export to the Grant Dashboard

Open Exports and choose Export active leads. Radar downloads a schema-version-2 JSON file. The existing Grant Dashboard accepts opportunity records from Settings through Choose JSON. Select the intended dashboard workspace before import. For testing, use the Sample workspace and synthetic records.

The dashboard import is additive. It rejects an existing record with the same kind, case-insensitive trimmed title, and exact source URL. It does not merge or overwrite. Radar maps Verification needed, Reviewing, and Shortlisted to the dashboard's Reviewing status. Closed and Archived map to Archived. Rolling and unknown deadlines export with a blank due date and a description in notes.

The dashboard replaces imported IDs. Radar therefore repeats the stable external ID, record label, funder, geography, eligibility, fit reasons, gaps, disqualifiers, deadline type/time zone, application route, matching funds, restrictions, last check, and next action in notes. Review the resulting record after import.

Importing creates an opportunity lead. It does not confirm funding or create an award. The Grant Dashboard may promote a lead to a Pending grant only after a human decision. Funding must be verified before activation.

## 13 Use the guided demonstration

Help and Start guided demonstration opens the fictional Community Peer Wellbeing record and a short task list. Confirm the purple sample label, open the example source, read fit and gaps, edit the owner or next action if desired, and inspect the export handoff. The guide does not reset records or automatically complete work.

Onboarding and the guided demonstration are separate. Onboarding explains boundaries and can be skipped or completed. The guided demonstration is an optional practice route.

## 14 Troubleshoot

**Onboarding returns.** Browser Site storage may have been cleared, blocked, or separated by private browsing, browser profile, device, or domain. Complete or skip it again. This does not affect authorization.

**Changes disappeared.** Confirm you are using the same browser profile and Site address. Browser-local storage is not shared or backed up. Do not rely on it for production work.

**A duplicate is blocked.** Search for the existing title or source. Update the existing record so notes and decisions stay together.

**Deadline shows UNKNOWN.** Record a confirmed date only after checking the official page. If the source says rolling, select rolling. If the source is unclear, leave it unknown and add a next action.

**Search health says manual.** This is expected. No scheduler or search credentials are connected.

**Export will not import.** Use the downloaded JSON unchanged, import 1-100 records, and verify the destination workspace. The dashboard rejects invalid URLs, dates, amounts, statuses, duplicate IDs, and duplicate kind/title/source combinations. Radar export status mapping is designed for the inspected version-2 contract.

**A source link fails.** Search for the funder's current official page, do not substitute an aggregator without marking provenance, and record a source check with UNKNOWN or STALE until verified.

**Document download fails.** Use the online manual or quick start from Help and check browser download permissions.

## 15 Limitations and agency setup

This prototype has no shared database, user accounts, role permissions, concurrency control, production audit log, backup, Microsoft 365 connection, accounting connection, calendar, email, notification delivery, live crawler, grant database subscription, or unattended scheduler. It is not suitable for confidential or production data.

An agency deployment needs an identity provider, least-privilege roles, authenticated shared storage, encryption, retention, backups, restore tests, activity logging, staging and rollback, privacy/security/accessibility review, source policies, and staff ownership.

Weekly discovery also needs agency-owned scheduling and credentials, approved sources and terms, rate limits, cost caps, run monitoring, retries, dead-letter handling, partial-failure reporting, conservative deduplication, and human approval before the Grant Dashboard handoff. See ADMIN_HANDOFF.md and INTEGRATION.md.

## 16 Worked examples

### Example A review a real public lead

Open the West Bend Insurance Company Charitable Fund cycle. Confirm the REAL PUBLIC LEAD label and official Foundation URL. Note the confirmed October 9, 2026 deadline and the missing time zone. Read the fit reason that mental health is an explicit priority. Then read the gaps: agency service in Washington County, applicant requirements, and funding amount are unverified. Set an owner only if authorized and write a next action. Do not shortlist until the required geography and applicant criteria are confirmed.

### Example B retain a closed cycle without treating it as open

Open the Greater Milwaukee Foundation 2026 cycle 2 record. The record is Closed because the official June 12, 2026 deadline passed. Keep it as a monitoring reference if it helps identify a future cycle. Do not export it among active leads or imply that applications are open.

### Example C practice safely

Open the fictional Community Peer Wellbeing record. Confirm its purple label and fictional note. Change the owner or next action and save. Use Exports to download the lead, then import only into the Grant Dashboard Sample workspace. Confirm the dashboard shows an opportunity rather than an award.

### Example D handle a source change

Choose Record source check on a sample. Change its date or funding maximum and describe the observation. Radar flags the changed field while retaining notes, owner, status, and next action. Review the flag before acknowledging it.

## 17 First week staff checklist

- Day 1: Complete onboarding, read the quick start, and use the guided demonstration with the fictional sample.
- Day 2: Agree on status meanings, owner naming, next-action style, verification standard, and source freshness threshold.
- Day 3: Review each real public lead against the official page and record unknowns without asserting eligibility.
- Day 4: Approve a provisional search profile and separately verify organization facts through agency records.
- Day 5: Export one fictional sample to the Grant Dashboard Sample workspace, reconcile the fields, and document gaps before any production decision.

## 18 Administrator adoption checklist

- Confirm Site audience and keep evaluation data public or fictional.
- Assign business, technical, verification, privacy/security, and backup owners.
- Approve identity, roles, storage, retention, backup, recovery, and audit controls.
- Validate the import contract in staging and define rejection/reconciliation handling.
- Approve official sources, refresh cadence, stale thresholds, deadline/time-zone rules, and human decision gates.
- Configure agency-owned scheduler and credentials only after monitoring, retries, cost caps, and shutdown controls are ready.
- Complete accessibility testing with keyboard, screen reader, zoom, mobile devices, and agency users.
- Train users and record adoption approval. Onboarding completion is not approval.

## 19 Glossary

**Active lead:** A New, Verification needed, Reviewing, or Shortlisted opportunity.

**Agency configuration:** Identity, storage, credentials, scheduler, integrations, policies, and controls supplied and approved by the nonprofit.

**Approaching:** A confirmed deadline within 30 days of the current date used by the prototype.

**Confirmed deadline:** A date recorded from the source. Staff must still verify the submission time and time zone.

**Disqualifier:** A known condition that blocks or materially undermines pursuit.

**External ID:** A stable source or funder identifier used before the source title changes.

**Fit reason:** A visible connection between an opportunity and a research preference. It is not confirmed eligibility.

**Grant Dashboard:** The separate application that manages grant records, requirements, tasks, issues, and opportunity intake after human handoff.

**Provenance:** Where a record came from, when the source was checked, and what remains unknown.

**Research preference:** A configurable search interest. It is not an organization fact or permission.

**Rolling deadline:** An ongoing route without one recorded closing date.

**Source check:** A human-recorded review of an official page. The prototype does not fetch the page during this action.

**STALE:** A source that needs rechecking under the team's policy.

**UNKNOWN:** Information or state that has not been established.

