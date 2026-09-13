# Nami Grant Workspace User Manual

Revision date: 2026-09-12. Application documentation release: local-foundation-v1, extending the existing onboarding release. The commit containing this manual identifies the complete release. This guide covers the grant dashboard, not the separate financial dashboard.

The Associate Director and grant-management staff can use this prototype to explore how to answer: What needs my attention now, and is everything else being tracked? The Executive Director can review summaries and escalated issues. Use fictional records during evaluation. The Site is public and has no agency role enforcement. Completing onboarding does not authorize confidential or production use.

## Contents

1. [Start with orientation](#start-with-orientation)
2. [Workspaces and access](#workspaces-and-access)
3. [Needs Attention](#needs-attention)
4. [Find and manage grants](#find-and-manage-grants)
5. [Set up each local foundation grant](#set-up-each-local-foundation-grant)
6. [Customize collection and outcomes](#customize-collection-and-outcomes)
7. [Read the grant progress visual](#read-the-grant-progress-visual)
8. [Requirements and tasks](#requirements-and-tasks)
9. [Owners deadlines and dependencies](#owners-deadlines-and-dependencies)
10. [Evidence and confidence](#evidence-and-confidence)
11. [Financial snapshots](#financial-snapshots)
12. [Issues and escalation](#issues-and-escalation)
13. [Grant Radar](#grant-radar)
14. [Activity history](#activity-history)
15. [Import records](#import-records)
16. [Export and reset](#export-and-reset)
17. [Preferences and integrations](#preferences-and-integrations)
18. [Troubleshooting](#troubleshooting)
19. [Worked sample examples](#worked-sample-examples)
20. [First week checklist](#first-week-checklist)
21. [Administrator adoption checklist](#administrator-adoption-checklist)
22. [Glossary](#glossary)

## Start with orientation

On the first visit in a browser, an orientation panel appears above the workspace. Use Continue and Back to move through its seven short steps. Skip onboarding dismisses it. Finish and return to Needs Attention completes it. Both choices prevent automatic repetition in that browser.

Choose Explore the sample workspace to continue with fictional records. Review agency setup opens Settings for information only; it does not connect accounts or approve real data. The orientation explains records, trust indicators and available settings, then offers Open a sample grant for a read-only practice action. Inspect Edit setup & tracking, then open a report under Reports, requirements & work to find its owner, evidence and prerequisite. If the original sample is absent, inspect another sample or deliberately reset samples after exporting changes.

Use Help → Reopen onboarding any time. Help also offers Start guided demo, the online manual, Word and PDF downloads, and a quick-start guide. The nine-step guided demo changes the displayed section and provides fictional scenarios; its Previous, Next step, Finish tour and Close tour controls are independent of onboarding. It does not automatically complete work or reset data.

The Site stores onboarding status and date in browser local storage under nami-grants-onboarding-v1. This is not a signed-in user profile and may be shared by people using the same browser profile. Clearing Site storage, private browsing or another browser can show orientation again. If storage is unavailable, the panel explains that it may return. Record data is stored separately in the dashboard database.

Keyboard users can Tab through controls and press Enter or Space on buttons. Each orientation step places focus on its heading. Edit forms contain keyboard focus; Escape closes a form when it is not saving. Cancel discards unsaved form changes. On narrow screens, scroll to the orientation action buttons or navigation as needed.

## Workspaces and access

Use Records at the top of the page to select Sample workspace or Agency workspace. New forms and imports use the selected workspace. Record detail forms identify Sample record or Agency record. Check that label before saving practice edits.

The two record sets are separate in storage, but they are not separate permission boundaries. The records API returns both sets, and Activity shows actions from both. There is no app-enforced Associate Director or Executive Director role, authenticated ownership, or per-workspace authorization. The current Site audience is public. Anyone able to access the application may interact with its shared prototype records. Do not enter client, participant, confidential, or production information in either workspace.

The Agency workspace is staging for a future deployment after administrative and security preparation. It can be evaluated with synthetic records now. Do not connect the prototype creator's personal accounts. Agency adoption requires the checklist later in this guide.

## Needs Attention

Choose Overview to return to Needs Attention. Grant cards now appear first. Expand Portfolio totals & detailed attention queue to see the original summaries. Open any row in Attention queue to inspect details and the written reasons for its priority. The queue considers the selected workspace only. It includes issues, deadlines, missing owners, missing evidence, dependencies and uncertain information.

Priority combines flags rather than sorting solely by due date: critical issues receive a strong priority increase; overdue work, overspending and escalations add high weight; UNKNOWN information, blocked work and waiting dependencies add medium weight; other flags add smaller weight. Multiple flags accumulate. Ties sort by due date, with missing dates first. This ordering supports review; it is not a clinical, financial or compliance risk score.

Due within 14 days includes today. Complete, Resolved, Closed, Archived and Declined records are excluded from attention reasons. That means a blank queue does not establish complete coverage or compliance. A closed record may still have stale supporting information. Review award terms and records outside the queue too.

Active awards counts only Active grants. Recorded expenses includes all grants in the selected workspace, including archived grants. Evidence missing counts requirements without a source except Archived ones. These tiles use different populations; they should not be treated as a reconciled financial statement or a single health score. The Needs attention tile opens Deadlines; use Attention queue to inspect all types of flagged records.

## Find and manage grants

1. Choose Grants in the navigation. Grant cards show the award amount, end date, next dated open requirement and requirement completion bar.
2. Use Search titles, owners, notes to narrow the portfolio. Search does not search custom field values or linked documents.
3. Open a grant card. Your grant at a glance leads to What we collect and Reports, requirements & work.
4. Choose Edit setup & tracking to change its saved information. Continue through three steps and choose Save grant. Back preserves the draft; Cancel or Escape discards unsaved changes. Server errors leave the draft open.

To archive a grant, open Edit setup & tracking, choose Archived in Status on step 1, Continue to step 3 and Save grant. The record remains accessible under Grants, but is omitted from home cards. Archiving a grant does not archive its linked requirements or tasks. Change Status back to Active to reopen it.

Navigation changes clear selected detail and search. The grant's Back to grants button returns to the section from which you opened it. Switching workspaces clears selected detail but may retain search; clear search if expected records are missing.

## Set up each local foundation grant

Use Add grant or Overview → Set up a grant each time you receive an award. No standard long checklist is imposed. For an editable fictional starting point, choose Overview → Try a $5,000 sample grant. It opens a draft in Sample workspace and does not save until you choose Save grant. Cancel makes no database change. Existing larger demonstration awards remain available; this shortcut does not reset them.

1. **Award basics:** Enter Grant name, Foundation / funder, Grant owner, Award amount, Awarded on, Starts on and Grant ends on. Only the grant name is required to begin; an empty amount defaults to zero, so record the actual synthetic amount when known. End date must not precede start date. Put funder timezone and submission times in Grant notes.
2. **Choose what to collect:** New blank grants start with editable Families served, People served and Outcome data fields. Rename, hide or add fields for this funder's needs. Add ZIP, payment or story/photo entries only when useful.
3. **Reports and review:** Choose Add report / requirement for each commitment, with its name, report due date, owner and data/evidence needed. A small award may need only one final report. Set a staff progress assessment and review date when justified. Save grant creates the award and its initial requirements together; invalid entries save neither.

Grants default to Active. Use Pending for unconfirmed funding. Award date, grant end date and report due dates are distinct; final reports may be due after the grant period. Initial setup accepts up to 25 requirements. Later, use Add report / requirement on the grant page; editing setup never recreates existing requirements.

## Customize collection and outcomes

Open a grant → Edit setup & tracking → Continue to step 2. Each field has a Field name, Field type, Current value, Collection owner, Collection / target due date, and What to collect, counting rules & frequency. Number fields also have an optional Target. Available types are Number, Short text, Long text, Date and Link. Fields are specific to the grant, not global templates or private preferences.

Use Add custom field for measures such as sessions held, transportation vouchers used, outcome improvement percentage or a narrative finding. Define the unit in the field name or collection instructions: percentage is a Number with your own 0–100 convention, not a special validated percentage type. Numeric entries allow nonnegative decimals up to one billion. Blank means not entered; zero is an entered value. Targets are optional. Date and Link fields validate calendar dates and HTTP(S) URLs.

Hide this field preserves its value and configuration but removes it from What we collect and target checks. It remains editable in setup and included in exports. There is no delete-field button or drag-to-reorder control. A field with a value cannot change type until you deliberately clear its current value. Save grant is required to persist edits; moving Back and Continue alone does not save.

Custom fields track the current value, not a dated measurement history. Record the measurement period and deduplication rules in collection instructions. Families and people are aggregate counts; this is not a participant roster. No form requires names, addresses, consent records or personal accounts. Built-in award identifiers, dates and the ZIP/payment/story entry structures have fixed labels; custom measures are freely named.

### ZIP codes served

Choose Add ZIP code and enter a five-digit ZIP code (optionally ZIP+4), Families served and People served. Counts must be nonnegative whole numbers; blanks remain unknown. Remove ZIP entry requires confirmation and changes only the draft until Save grant. Avoid repeated ZIP rows unless intentionally documenting separate periods in your grant notes.

ZIP counts and custom Families served / People served values are independent. They are not summed automatically. Define whether people moving between ZIP codes are counted once, and reconcile totals before reporting.

### Spending recipients

Choose Add payment. Enter Payment date, Recipient / organization, Purpose, Amount and an optional Receipt / source URL. Saved entries appear under Where the money went, with a total of entered amounts. Blank amounts are excluded from that total, not verified as zero. Remove payment requires confirmation before the next Save grant.

These are manually recorded spending notes. They do not send money, enforce allowability, reconcile bank activity, or update Recorded expenses in the separate financial snapshot. Compare and reconcile the two yourself; do not add both totals together.

### Success stories and photos

Choose Add story / photo. Enter a Title, Story / outcome narrative and optional Photo URL; either a story or a photo link can be useful alone. Save grant, then View linked photo opens the URL in another tab. The app stores links only: no file upload, image storage or embedded preview is implemented. A source may require its own access permission.

Use fictional narratives and nonconfidential demonstration images here. The public Site is unsuitable for identifiable participant stories or photographs. Eventual agency adoption needs privacy, consent, retention and document-access rules. Remove story / photo requires confirmation and affects the draft until saved.

## Read the grant progress visual

Each grant card and detail shows requirements completed out of recorded non-archived requirements. This is checklist completion, not a compliance percentage. No requirements recorded means there is no basis for a completion claim. Each numeric target has a separate bar, capped visually at its target; the text can show more than 100 percent when recorded counts exceed the target.

Staff assessment is Not reviewed, On track, Needs attention or At risk, with a Reviewed on date in setup step 3. Missing review dates or Not reviewed show Not reviewed. Reviews over 30 days old show Review due. An incomplete requirement past its due date, or a visible numeric target past its target date that is blank or below target, overrides an active grant's display to Needs attention. Pending, Closed and Archived grants display their lifecycle status instead. A due date today is not overdue.

The visual does not infer linear pace from time elapsed. It does not automatically incorporate spending, evidence adequacy, issues or staff tasks into the staff assessment. Review those separately, then update the assessment and its date. This is a practical progress aid, not certification that all funder terms are met. The detailed attention queue remains available for broader verification and dependency flags.

## Requirements and tasks

A requirement is a commitment imposed by an award, such as a report. A task is staff work needed to fulfill it, such as collecting totals. They are separate records with independent status.

Open a grant, then Add report / requirement or Add staff task under Reports, requirements & work. This preselects the linked grant. Alternatively, use Compliance → Add requirement or Tasks → Add task and choose Linked grant yourself. Deadlines displays both types, while Compliance displays requirements only.

Statuses are Open, In progress, Blocked, Complete and Archived. Mark complete is available in a non-complete task or requirement detail. Requirements need a Source / evidence URL before completion; tasks do not. Both must have a completed prerequisite if Depends on is set. Saving Complete in the edit form uses the same validation.

Completing a task never changes its dependent requirement automatically. Review the requirement separately. Archived work is not a completed prerequisite. The application does not verify whether a human actually performed the recorded work.

## Owners deadlines and dependencies

Use Edit record → Owner to enter an assignment label, and Due date for a calendar date. Labels do not grant access, validate staff identity or notify anyone. Put submission time, funder time zone and special instructions in Notes / requirements. Deadlines use the UTC calendar day; there is no business-day calendar or automatic timezone conversion.

For a task or requirement, select one prerequisite using Depends on. The selector lists tasks and requirements in the same workspace; it is not restricted to the same grant. Verify you chose the intended record. Inspect the prerequisite by opening its row in the Next step panel.

The application rejects self-dependencies, cycles, missing or cross-workspace prerequisites, and a prerequisite due after the dependent deadline when both dates are present. It also checks changes to a prerequisite's deadline against its dependents. Missing dates do not establish a valid sequence; they still require manual review.

Complete the prerequisite before its dependent. To reopen a prerequisite of a completed record, first reopen that completed dependent. Dates do not propagate automatically when one date changes. Multiple prerequisites and advanced project scheduling are future features.

## Evidence and confidence

For tasks, requirements, issues and leads, use Edit record → Source / evidence URL. For a grant, use Edit setup & tracking → Award terms / source link on step 1. Use an HTTP or HTTPS link. Save, then use Open source / evidence in Record details to open it in another tab. There is one source/evidence field per record; additional context can go in notes. The dashboard does not upload documents, check link permissions, read file contents or independently establish evidence sufficiency.

Source verified on is a manual assertion. Record it only after reviewing the intended source. UNKNOWN means no verification date; STALE means that date is more than 30 days old. A recent verification date does not itself prove the source exists or supports the requirement. If you replace a source, reassess its verification date yourself.

Evidence missing means a requirement has no linked source. UNKNOWN deadline means no due date is recorded. UNKNOWN dependency indicates a missing referenced prerequisite. If loading fails, Workspace status UNKNOWN replaces the summary rather than presenting misleading zero counts.

## Financial snapshots

Choose Finances. Each grant shows Award, Expenses, Remaining, Financial freshness and an As of date. Remaining is award amount minus recorded expenses; a negative balance remains visible. These are manual cumulative totals, not transactions, reconciled balances, restricted-fund rules or approval to spend.

Open a grant → Edit setup & tracking. Award amount is on step 1; Recorded expenses and Financial snapshot as of are in Optional financial snapshot & source verification on step 3. No date means UNKNOWN; more than 30 days old means STALE. Editing unrelated fields does not refresh financial freshness. Dates cannot be in the future. Amounts must be nonnegative numbers no greater than one billion dollars.

Export summary downloads a grant-array financial summary. It is not the same envelope as Settings → Export records and is not directly accepted by the record importer. Use the Settings export for transferable record data. Compliance and financial indicators remain separate.

## Issues and escalation

Choose Issues → Add issue, or add an issue from a grant. Enter the problem in Title and Notes / requirements, select Linked grant, assign Owner and Due date, then choose Severity: Low, Medium, High or Critical.

Issue statuses are Open, Escalated, Resolved and Archived. Escalated requires an Escalation owner. This records who should review the problem and affects attention ordering. It does not send email, Teams messages, calendar events or any other notification. Staff must contact the reviewer through their normal process. The Executive Director has the same technical app capabilities as other visitors; no read-only leadership role is enforced.

Set Resolved after the decision or action is complete and record the rationale in notes. Activity will show an action summary, not a verified approval signature.

## Grant Radar

Choose Grant Radar to review opportunity leads. Use Add opportunity for manual entry or Download import template for a JSON example. Opportunity statuses are New, Reviewing, Applying, Declined and Archived. Requested amount is not an award.

Open a lead and select Promote to pending award. This creates a separate grant with Pending status, zero recorded expenses, no financial snapshot date, and a note identifying its originating lead. It does not confirm eligibility, apply for funding, send anything, or mark the original lead as awarded. Inspect the new record under Grants. Change it to Active only after actual award verification in an approved future environment.

Repeat promotion of the same lead is rejected while the identifying note remains. Do not remove the Radar lead ID note: current duplicate protection relies on it rather than an immutable relationship. Weekly searches, automated ingestion and monitoring require future agency configuration.

## Activity history

Choose Activity for the latest 100 action summaries from both workspaces. Updates list changed field names, but not previous and new values. Entries have timestamps and record/workspace labels; no authenticated actor or approval identity is recorded.

This is a shared operational history, not an immutable regulatory audit trail. Export records excludes activity. Sample reset retains activity, so old sample actions may remain after new scenarios are loaded.

## Import records

Only JSON files are accepted by the interface. CSV, Excel, Word and direct Microsoft imports are not implemented. The supporting workbook is a planning artifact, not a file the import control can read.

1. Choose the intended workspace; use Sample workspace during evaluation.
2. In Grant Radar, choose Download import template, or obtain a Settings record export.
3. Edit a copy using the contract in INTEGRATION.md. Keep related records together when practical.
4. Open Settings → Choose JSON and select the file. Selection starts import immediately; there is no preview or approval screen.
5. Read the saved notification or error. Review imported records in their corresponding sections.

The current template/export declares schemaVersion 3. The API accepts numeric version 1, 2, 3, or an omitted version for legacy files; unsupported values are rejected. All accepted version numbers use the current validator, not separate kind restrictions. Supported kinds are opportunity, grant, requirement, task and issue. A top-level records array must contain 1–100 records. The request body limit is 2,000,000 characters. An empty workspace export is valid JSON but cannot be imported because it contains zero records.

Every record requires a supported kind, nonblank title, valid kind-specific status, and numeric amount and spent (use zero when not relevant). Other string fields can be omitted or empty. The import workspace overwrites demo. Imported IDs and updated timestamps are replaced. Import-local grant and dependsOn references are remapped; existing destination IDs may also be referenced. Those links must resolve in the selected workspace. Source URLs, date values, field lengths, completion gates and deadline order are checked before saving.

Duplicate import IDs reject the batch. A duplicate kind plus case-insensitive trimmed title plus exact source URL, either within the batch or already in that workspace, rejects the entire batch. No merge or overwrite occurs. Correct the file or edit the existing record; do not rename records just to evade duplicate checks. Validation failures cause no partial import. Database writes and the activity entry are batched atomically.

For batches larger than 100, split carefully. Import-generated IDs differ from input IDs; later batches must use the resulting destination IDs for earlier records. The Radar download template is a single opportunity example. A customized grant export includes its optional tracking object with fields, ZIP entries, payments and stories. The repository also provides examples/local-foundation-v3.json. Legacy records without tracking remain readable and can be configured with Edit setup & tracking. INTEGRATION.md contains the complete field contract and statuses.

## Export and reset

Settings → Export records downloads all records in the selected workspace in a version 3 JSON envelope. Save a copy before significant sample changes. The file excludes activity, onboarding state and browser selections. It is a record export, not a complete database backup.

Import is additive. Importing that export into the same populated workspace usually fails duplicate checks. It cannot roll back edits, remove later records, preserve IDs, or restore activity. Full restoration requires a separate administrator-managed database recovery process, not an in-app button.

Settings → Reset demo data displays an explicit confirmation. Cancel leaves samples unchanged. Confirm replaces all sample records with five fictional award scenarios whose dates are relative to the reset day. It discards everyone's changes in the shared sample workspace, even if you selected Agency workspace before invoking reset. Agency records are preserved, and activity is retained. Export sample changes first if they matter. Onboarding never invokes reset.

If Sample workspace is empty, Load sample portfolio adds the fictional scenarios. It refuses to seed when sample records already exist.

## Preferences and integrations

Custom field names, types, values, targets, owners, collection instructions and field visibility are saved per grant. They are shared record settings. There are no saved color themes, global layout choices or permission-role preferences. Workspace selection, navigation and search are page-session state and reset on reload. Only onboarding skipped/completed status persists locally. Record edits persist in the shared database.

Settings lists future Entra ID / SSO, SharePoint / OneDrive, Outlook / Calendar / Teams, Excel / Power Automate, accounting, Grant Radar and aggregate outcome integrations. All require agency configuration and are not connected. No unattended searches, reminders, automatic evidence verification or accounting actions run. This list is a handoff, not an integration wizard.

## Troubleshooting

**Failed load:** Read Workspace status UNKNOWN and use Retry loading. Do not interpret missing counts as no work. If it persists, report the time and error to the administrator. The database or its binding may be unavailable.

**Rejected save:** Read the error inside the open form. Check required title, allowed status, nonnegative amounts, real calendar dates, HTTP(S) source links, completed prerequisites and escalation owner. In grant setup, also check custom field labels, valid ZIP codes, whole ZIP counts, dates and photo links; use Back to reach earlier steps. Correct the field and Save record. Your form remains available on a rejected save.

**Conflicting edit:** The message says the record changed or no longer exists. Copy unsaved notes somewhere safe, close the form, choose Retry loading, reopen the current record, compare changes and reapply only the intended edits. Do not repeatedly submit an old form. Per-record version checks exist; cross-record simultaneous dependency edits still need production hardening.

**Import failure:** Confirm a JSON object containing records, numeric schemaVersion 1, 2 or 3, 1–100 records and all required numeric fields. Check duplicate titles/source combinations, IDs, links and dates. A financial Export summary array is not a record-import envelope. Correct and select the file again.

**Missing record or information:** Check the workspace, current section and search text. Archived grants remain under Grants but disappear from home cards and attention flags. Inspect the owner, deadline, source and verification dates; missing values are not proof the underlying work is unnecessary.

**Evidence link fails:** Check the URL and source system permissions outside the dashboard. A link can exist while its destination is inaccessible. Do not set verified status based only on its presence.

**Onboarding appears again:** Browser site data may have been cleared or blocked, or you may be using a different browser/profile. Skip or finish again. Reopen it through Help whenever needed.

**Download fails:** Check browser download restrictions and reopen Help. The online manual and quick start remain readable without downloading. If a network error occurred during a save, reload and inspect the record/activity before retrying because the server may have saved it before the response was lost.

## Worked sample examples

### A small foundation award with one report

Choose Overview → Try a $5,000 sample grant. The fictional Neighborhood Family Fund draft has a families target of 30 and people target of 75. Set synthetic award/end dates. On step 2, enter Families served 18 and People served 40, add ZIP 53204 with those counts, and add an Outcome data narrative. Add a payment of $200 to Fictional Supply Shop and a fictional success story. On step 3 add Final report with a future deadline and data needed: family totals, ZIP summary, story and spending source. Save grant.

Open the saved grant: the families target shows 18 of 30, or 60 percent; the requirements bar shows 0 of 1. These describe different things. Leave the staff assessment Not reviewed until you have reviewed the synthetic scenario. Edit setup later to add a custom Number field called Workshops held with its own target and collection owner.


### A report blocked by staff work

In Sample workspace, open Grants → Government demonstration award — aggregate outreach → Government monthly expenditure report. It depends on Finance staff: deliver aggregate expense schedule, due four days before the sample reset date. The report is due four days after that date. Inspect the prerequisite row and owner.

For a practice edit, add https://example.org/synthetic-report as the report's evidence URL. Attempt Mark complete while the prerequisite is incomplete; completion is rejected. Open the prerequisite and Mark complete. Return to the report and complete it separately. These edits affect synthetic shared records only. The illustrative URL is not verified evidence.

### A requirement missing evidence

Open Compliance → Quarterly progress report. Its source is initially blank. Find Source or evidence and Owner. Mark complete is rejected without a URL. Use Edit record to add a synthetic link for practice. In future approved use, personally review the actual document before entering Source verified on; a URL alone does not establish adequacy.

### Stale financial information

Open Finances → Government demonstration award — aggregate outreach. Its synthetic snapshot is 45 days old at reset, so it shows STALE. The sample has an award of $160,000 and expenses of $92,000. The $68,000 remainder is arithmetic, not spending authorization. Edit the snapshot date only when there is a basis for a new snapshot; changing notes does not make finance current.

### An issue for leadership review

Open Issues → Overspend requires leadership review. The sample is Critical and Escalated, with Associate director as escalation owner. Its linked troubled award records $22,500 of expenses against $20,000 awarded. Review who should decide next and document that decision. If practice uses Executive director as the escalation owner, it remains a text label and sends no message.

### An opportunity remains unconfirmed

Open Grant Radar → Community wellbeing funding lead → Promote to pending award. Under Grants, find the new Pending grant. It is excluded from the Active awards count. Funding has not been awarded by this action. The original lead remains available; repeating promotion is rejected while its provenance note exists.

## First week checklist

- Day 1: Complete orientation and the guided demo. Confirm Sample workspace and learn Help and the manual.
- Day 2: Set up a small fictional foundation grant with one report, families and people targets, ZIP counts and counting rules.
- Day 3: Practice the blocked-report example. Explain why task completion and requirement completion differ.
- Day 4: Add a fictional outcome, success story, photo link and spending recipient. Review evidence confidence, financial freshness and the escalated issue separately. Identify who would verify each source in an agency deployment.
- Day 5: Export samples, inspect the JSON contract and practice an additive import with a new synthetic lead. Give leadership a list of workflow gaps and adoption requirements.

## Administrator adoption checklist

- Keep evaluation data synthetic. Confirm Site audience with the owner; the current public setting is preserved. Do not treat onboarding or workspace labels as protection.
- Establish agency ownership, approved deployment, authentication, server-side authorization, least-privilege roles and access reviews before production data. Review direct API access as well as the interface.
- Agree on per-grant measures, reporting periods, household/person deduplication, ZIP coverage and outcome definitions. Define who reviews progress and reconciles payment notes with accounting.
- Approve the data inventory, retention, story/photo consent and access rules, confidentiality rules and verified award terms. Exclude participant/client-level records from this prototype scope.
- Configure agency-managed source systems and test permissions, mapping, source timestamps and reconciliation. Do not use the creator's personal accounts.
- Define owners, escalation contacts, deadline timezones and notification delivery processes. Test receipt, retries, deduplication and failure monitoring before calling an integration connected.
- Harden simultaneous dependent-record writes, request limits, abuse controls, authenticated audit attribution and recovery. Test database backups and full restoration separately from JSON exports.
- Validate imports in a safe staging deployment. Confirm every record relationship and duplicate policy, and reconcile source totals before approval.
- Run acceptance testing with Associate Director and Executive Director users. Record remaining gaps and assign release responsibility.
- Maintain USER_MANUAL.md as the manual source; regenerate HTML and Word, render the Word to PDF, visually review every page and publish the matching downloads with the app. Update the revision date and release identifier together.

## Glossary

- Custom field: A grant-specific measure or text/date/link entry with optional target and collection instructions.
- Staff assessment: A dated manual progress judgment, separate from financial and compliance verification.
- Grant: An award record; Pending indicates unconfirmed funding.
- Requirement: A commitment that must be satisfied under an award.
- Task: Staff work that can support a requirement.
- Dependency: The one prerequisite selected for a task or requirement.
- Evidence link: A URL to a supporting source; the link is not independent verification.
- Owner: An assignment label with no authorization effect.
- Issue: A problem recorded for follow-up or decision.
- Escalation owner: A named reviewer for an escalated issue; no automatic delivery occurs.
- Opportunity lead: A potential funding source requiring review, not an award.
- UNKNOWN: Required information or its verification is not recorded.
- STALE: A verification or snapshot date is more than 30 days old.
- Additive import: Adds validated records without replacing existing ones.
- Agency setup: Future administrative preparation for an approved deployment.
