# Nami Events and Volunteers

Version 1.0.0 · October 5, 2026

Separate private evaluation application for NAMI Southeast Wisconsin. Designed for coordinators and leadership at a small nonprofit of roughly 30 employees, with many small events and occasional events up to 500 total people.

## Working capabilities

Events/list/calendar, explained readiness, preparation tasks, volunteers and independent verification, shifts and explicit assignments, attendance, reviewed actual service hours, donors/corporate sponsors/partners, money and in-kind donations, search, durable preferences, history, versioned backup/restore, CSV, manual ICS, suite summaries, onboarding, guided demo and in-app Help.

## Boundaries

Each authenticated evaluator has a separate durable D1 workspace. The Site starts owner-private. No shared staff workspace or agency role hierarchy is configured. Synthetic information only. No Microsoft 365, email, invitations, personal reminders, background scheduler, payments, accounting, tax valuation or automatic grant-compliance changes.

The Grant Dashboard and Radar remain unchanged. This app's Site ID is appgprj_6aa588a7c5648191b87924032a13a1ba. Preserve .openai/hosting.json and existing histories.

## Source and verification

app/workspace.tsx is the actual React interface; lib/domain.ts validates records; lib/service.ts applies state transitions and authenticated SQL operations; app/api/workspace/route.ts obtains platform identity. Drizzle migration creates the bounded evaluator datastore. Tests execute the actual React UI in jsdom and service handlers against SQLite.

Install the locked pnpm dependencies. For tests install esbuild, jsdom, @testing-library/dom and @testing-library/user-event into a separate test-tools directory and set TEST_TOOLS to its node_modules. Run node tests/build-tests.mjs and node --test --test-force-exit tests/core.test.mjs tests/ui.test.mjs. Run node node_modules/typescript/bin/tsc --noEmit and the Sites build workflow before publication. See TESTING.md for executed checks and limitations.

## Documentation

USER_MANUAL.md and QUICKSTART.md are maintained sources. public/ contains generated editable Word, PDF and HTML manuals. See ADMIN_HANDOFF.md, INTEGRATION.md and PRESENTER.md. scripts/build-docs.py regenerates document content; render/visually inspect every page before release.
