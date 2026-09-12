# Nami Grant Radar Verification Record

Revision date: 2026-09-12. Application version: 1.0.1.

## Audit correction and executed evidence

The initial verification overstated confidence: it had not executed the application script in a DOM. This audit found and repaired unmatched form-handler braces, an onboarding navigation exception, unused search-profile controls, misleading public-access wording, mixed sample exports, insufficient duplicate fallback, absent source aging, and silently truncated export notes.

Twelve tests now pass on Node 24, including two UI tests executing the actual app script in jsdom with isolated storage. These cover first visit, navigation during orientation, skip, back, reopen, finish, returning visit, record creation/editing/assignment, source refresh, note preservation, duplicate blocking, archiving, preferences, and demo Escape dismissal. A synthetic Radar export is executed through the actual upstream dashboard validator in a read-only checkout. No live dashboard records are written.

For repeatable tests install jsdom in a separate test-tools directory and set JSDOM_PATH to its absolute module path. Set GRANT_DASHBOARD_RULES to the inspected dashboard lib/records.ts. Run node --test tests/*.test.mjs. Defaults refer to sibling audit checkouts. Core tests alone need no external dependency.

UI tests are DOM tests, not rendered-browser tests. Responsive CSS and focus handling were inspected; physical mobile, 200% zoom, and screen-reader behavior remain unverified. The static Site has no compatible managed browser-preview server. Source dates remain the original research dates; this audit is not a discovery run.

## Automated tests

`node --test tests/*.test.mjs` covers stable duplicate keys, duplicate detection, deadline states, explainable-fit counts, source refresh preservation and flags, and schema-version-2 Grant Dashboard export fields/statuses. `node --check dist/app.js` validates application JavaScript syntax.

## Interaction checks

The completed interface was checked for:

- first visit, skip, finish, reopen, and returning-visit onboarding logic
- browser-local preference, opportunity, activity, and onboarding scope
- keyboard focus, visible focus indicators, modal Escape close, labeled controls, and responsive CSS
- distinct real-public and fictional-sample labels
- add, edit, assign, status change, search, filter, source check, change acknowledgement, and archive paths
- conservative duplicate blocking without overwriting notes
- confirmed, rolling, unknown, closed, current, stale, and unknown states
- actual manual research history separated from a fictional failure example
- schema-version-2 export against the inspected Grant Dashboard validator
- Help and document routes
- preservation of the existing Grant Dashboard Site and its public access setting

Limitations: no physical-device test, screen-reader session, multi-user concurrency test, hosted browser automation, or production integration test was performed. The Site is a browser-local evaluation prototype.
