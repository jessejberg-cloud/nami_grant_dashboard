# Nami Events and Volunteers Administrator Handoff

Version 1.0.0 · October 5, 2026

## Ownership and audience

Reuse Site appgprj_6aa588a7c5648191b87924032a13a1ba. It was registered September 12 but never published before this completion effort. Workspace maintenance removed the original unsaved checkout. The source was restored from the visible implementation and extended for donations, sponsors and partnerships. The existing Grant Dashboard and Radar remain separate.

The Site starts owner-private with one authorized owner and no external viewers. Preserve this audience. Sharing the URL does not grant access. The API requires platform-authenticated user ID and email and keys the D1 workspace by that user ID. Client owner labels and sample/agency scope never choose another user's workspace. Platform identity headers rely on Sites dispatch integrity; direct Worker exposure outside that trusted boundary is not supported.

This is an evaluator-per-user prototype, not a shared 30-employee service. All authorized viewers can manage their own evaluator records. No coordinator/reviewer/administrator separation is implemented. Agency rollout requires Entra ID, tenant/group checks and server-enforced roles before production data.

## Data and recovery

One D1 row per evaluator contains a versioned JSON workspace and revision. Every mutation validates the full linked state; an atomic conditional update prevents lost updates across dependent records. Limits: 2,000 records, 5,000 history entries, 1.5 MB saved JSON and 2 MB request/import. This design is bounded evaluation storage, not a production relational architecture.

Generated Drizzle migration creates the table. Do not edit an applied migration. Append future migrations and test recovery. Backups contain selected-scope records/history and preferences. Imports retain stable IDs, validate references and preserve current history; replace changes only selected-scope records. Preferences require a separate deliberate save. Establish database-level backups, retention and restore drills before agency adoption.

History has server-authenticated actor IDs for app actions and before/after values. Imported history is labeled unverified imported content. It is not append-only regulatory storage. Replace can restore prior workflow states; review restored approvals before relying on them. No clinical information, background-check reports, identity documents or participant-level clinical data belongs here.

## Production activation checklist

Assign an agency business owner, technical owner, privacy/security owner and backup owner. Approve the data inventory, verification policies, capacity rules, donation acceptance, partnership agreements and retention. Choose shared agency storage and test migration/permissions. Complete load, mobile, accessibility, security and staff acceptance reviews. Define operational support and incident response.

For the roughly 30-employee organization and events up to 500 people, retain aggregate public attendance. Do not treat event capacity as 500 concurrent app users or create attendee identities unnecessarily. Load testing 30 concurrent authenticated staff and multi-year history remains future work.

## Automation status and costs

No background schedules, personal ChatGPT reminders, email, Teams notifications, invitations or calendar synchronization exist. Deterministic in-app counts, validations, cancellation propagation and timestamps operate during use. No automation run history is fabricated.

Future agency services need budget approval. Review Microsoft 365/Entra, SharePoint/Lists, Power Automate premium connector or per-flow licensing, Azure compute/storage/monitoring, backup costs and hosting terms under the agency's agreements. No exact current price or license entitlement is asserted. Set spending limits and an accountable responder.

## Maintenance

Maintain USER_MANUAL.md and QUICKSTART.md as sources. scripts/build-docs.py generates HTML and editable DOCX. Render each DOCX through the documents skill renderer, retain matching PDFs under public/, and visually inspect every page. Update version/revision date together with code and TESTING.md. The app links only to bundled documents.

Run tests/build-tests.mjs with TEST_TOOLS pointing to a development install containing esbuild, jsdom and testing-library packages. Then run node --test --test-force-exit tests/core.test.mjs tests/ui.test.mjs, TypeScript and the Sites production build. Test tools and generated test bundles do not ship as runtime dependencies.
