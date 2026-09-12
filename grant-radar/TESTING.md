# Nami Grant Radar Verification Record

Revision date: 2026-09-12. Application version: 1.0.0.

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

