# Nami Dashboard Suite — Grant Command Prototype

Nami Dashboard Suite is a functional grant-management and compliance prototype for NAMI Southeast Wisconsin. It gives reviewers a hands-on workspace for exploring grant opportunities, active awards, compliance requirements, deadlines, evidence links, owners, budgets, activity history, and a future Grant Radar handoff.

The prototype is intentionally populated with fictional sample data. It is not connected to NAMI's production Microsoft environment, accounting system, calendars, email, shared drives, or funding-source accounts.

## Live prototype

The existing ChatGPT Site is available at:

https://nami-grant-workspace.brainspottingonline.chatgpt.site

Access to the live Site is controlled separately from this source repository.

## Presentation

Choose Sample workspace → Settings → Reset demo data, then Overview → Start guided demo. Read [PRESENTER.md](PRESENTER.md), [QUICKSTART.md](QUICKSTART.md), and [HANDOFF.md](HANDOFF.md). The Site currently has public access; use synthetic data only.

## Current capabilities

- Five synthetic grant scenarios, safe sample reset, and a nine-step guided demo
- Separate tasks, requirements, prerequisite completion gates, issues and escalation owners
- Explicit financial/source UNKNOWN and STALE states and prioritized attention reasons
- Opportunity promotion to pending awards with duplicate protection
- Separate fictional sample and agency workspaces
- Manual create, edit, archive, and validation flows for opportunities, grants, and requirements
- At-a-glance award, deadline, evidence, and expense summaries
- Requirement ownership, due dates, workflow states, notes, and supporting URLs
- Evidence-link enforcement before a requirement can be marked complete
- Manual award and expense totals with visible remaining balances and overspending
- Validated, additive Grant Radar JSON import with linked-record remapping and duplicate protection
- JSON template download and backup export
- Recent activity history, atomic record-plus-log writes, and stale-edit protection
- Durable Cloudflare D1 storage through Drizzle migrations
- Responsive application layout and accessible dialog behavior

See [AUDIT.md](AUDIT.md) for tested behavior, limitations, and prototype boundaries. See [INTEGRATION.md](INTEGRATION.md) before connecting any external system.

## Repository structure

- `app/` — application pages, styles, authentication helpers, and records API
- `lib/records.ts` — record types, validation rules, and fictional sample portfolio
- `lib/database.ts` and `db/` — database access and schema
- `drizzle/` — production database migration and migration metadata
- `components/`, `hooks/`, `public/`, `vendor/` — UI components, helpers, and assets
- `tests/records.test.cjs` — API/database integration tests
- `INTEGRATION.md` — Grant Radar JSON contract and future integration requirements
- `AUDIT.md` — implementation audit, verification record, and boundaries
- `project-data/Grant_Management_Compliance_Dashboard_MVP.xlsx` — supporting MVP workbook
- `.openai/hosting.json` — identity and bindings for the existing ChatGPT Site

## Local setup

Requirements:

- Node.js 22.13 or newer
- pnpm 11.25.0

Install the locked dependencies:

```bash
pnpm install --frozen-lockfile
```

Start local development:

```bash
pnpm dev
```

The Site uses Cloudflare/Vinext tooling. Local runtime data is written only to ignored directories.

## Tests and production build

Run the records API/database integration test:

```bash
node --test tests/records.test.cjs
```

Run the production build:

```bash
pnpm build
```

## Grant Radar JSON contract

The current import contract is version 1:

```json
{
  "schemaVersion": 1,
  "records": []
}
```

Supported record kinds are `opportunity`, `grant`, and `requirement`. Imports are validated, additive, limited to 100 records, scoped to the selected workspace, and reject duplicate kind/title/source combinations. Imported IDs are replaced and related grant references are remapped. The complete field contract and production-readiness requirements are documented in [INTEGRATION.md](INTEGRATION.md).

## Security and data boundaries

- No agency credentials, secrets, production funder records, or verified award rules are included.
- Sample data is fictional and identified as such.
- Environment files, credentials, keys, runtime databases, build output, exports, and backups are excluded from version control.
- Interactive Site authorization is not sufficient for unattended machine ingestion. Add scoped machine authentication and authorization before connecting Grant Radar or another automated source.
- Evidence links, budget totals, owners, and activity entries are prototype workflow aids; they are not verified compliance evidence, an accounting ledger, authenticated agency roles, or an immutable regulatory audit trail.

## Supporting workbook

The repository includes `project-data/Grant_Management_Compliance_Dashboard_MVP.xlsx` as a supporting planning and data artifact. Its expected SHA-256 checksum is:

```text
1a0e27b0049b4d33f8bad364ec724ad6f2060d16621c1d0fe892f183ca117828
```

## Deployment and continuation

This repository is the GitHub handoff of the existing working prototype. Future work should preserve the Site project identity in `.openai/hosting.json`; do not create a replacement Site. Read `INTEGRATION.md` before adding Grant Radar, calendar, accounting, or shared-drive connections.
