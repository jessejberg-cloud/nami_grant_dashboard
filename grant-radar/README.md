# Nami Grant Radar

Nami Grant Radar is a separate application in the Nami Dashboard Suite. It helps nonprofit development staff discover, organize, verify, compare, and review funding opportunities before a human-controlled handoff to the existing Grant Dashboard.

Version 1.0.1 was prepared on 2026-09-12 as an evaluation prototype for NAMI Southeast Wisconsin. The app starts with four real public research leads gathered from official funder pages and one clearly labeled fictional sample. Public-source records do not assert agency eligibility.

## Working prototype

- At-a-glance signals for new leads, approaching deadlines, verification work, explained fit, and search health
- Browser-local opportunity creation, editing, assignment, status changes, archiving, filtering, and activity history
- Explicit REAL PUBLIC LEAD and FICTIONAL SAMPLE labels
- Confirmed, rolling, unknown, and closed deadline states
- Explainable fit using visible reasons, gaps, and disqualifiers rather than an opaque score
- Stable external IDs and conservative duplicate checks
- Source-check workflow that flags changed source fields while preserving staff notes and decisions
- Editable browser-local research preferences kept separate from organization facts
- Versioned schema-2 JSON export tested against the current Grant Dashboard contract
- First-time onboarding, distinct guided demonstration, Help, quick start, and complete manuals

## Storage and access

The initial Site is owner-private. Opportunity records, preferences, activity, and onboarding state are stored in browser localStorage. That storage is neither a shared agency database nor an authorization system. Clearing browser Site data, using private browsing, or changing browser/device can remove or separate data. Do not enter confidential or production information.

## Automation status

Weekly discovery is **not running**. The prototype records the actual initial manual research run and separately displays a fictional failure example. Agency deployment requires an agency-owned scheduler, credentials, authenticated datastore, monitoring, retries, ownership, and cost controls. See [ADMIN_HANDOFF.md](ADMIN_HANDOFF.md).

## Development and verification

The Site is a static application in `dist/`. Run:

```bash
node --test tests/*.test.mjs
node --check dist/app.js
python3 -m http.server 4173 --directory dist
```

See [TESTING.md](TESTING.md), [USER_MANUAL.md](USER_MANUAL.md), [QUICKSTART.md](QUICKSTART.md), and [INTEGRATION.md](INTEGRATION.md).

