# Events and Volunteers Verification

October 5, 2026 · Version 1.0.0

25 automated tests pass: 24 domain/service tests and one extended actual React interface test. The interface test executes onboarding, event creation, 500-person capacity validation, duplication, calendar navigation, volunteers, shift assignment and explicit acceptance, attendance, submission/approval/rejection/correction of service hours, tasks, sponsors, received food contributions, partnership changes, preference persistence, reload, downloadable exports, import preview/merge/replace, malformed import, failed loading, Help, guided demonstration, modal focus and Escape.

Domain/service checks cover DST gaps/folds, stable IDs, semantic duplicates, overlapping assignments, inactive volunteers, shift capacity, duration, cancellation propagation, unknown/stale/expired verification, actual-hour limits, immutable attribution after attendance, linked backups, malformed and cross-scope imports, CSV formula escaping, ICS UTC timestamps, authenticated evaluator isolation, same-origin requests, stale/concurrent saves and storage failures. A UI regression confirms editing notes preserves both instants of an event created in the later repeated fall-back hour.

TypeScript noEmit passes. Production build and deployment must succeed before handoff. Word quick start is one page and the user manual is nine pages; every rendered page was visually inspected. Matching PDF and HTML guides are bundled in public/. Documentation links were checked against actual files.

Reproduce with the locked pnpm install. Install esbuild, jsdom, @testing-library/dom and @testing-library/user-event into a separate tool directory; set TEST_TOOLS to its absolute node_modules path. Run:

    node tests/build-tests.mjs
    node --test --test-force-exit tests/core.test.mjs tests/ui.test.mjs
    node node_modules/typescript/bin/tsc --noEmit
    pnpm build

The SQLite adapter executes the actual SQL handler against the shipped schema. UI tests use jsdom and the actual service; they do not verify rendered CSS, platform sign-in or hosted Cloudflare behavior. No physical mobile device, screen-reader, 200% zoom, 30-user load test or agency acceptance testing was performed. Complete these before production adoption. Evaluation records are per authenticated user and synthetic only; Microsoft 365, delivery and scheduling are disconnected.
