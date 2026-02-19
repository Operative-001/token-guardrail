# Token Guardrail — 10-Round Roadmap

## Round 1 — MVP Foundation
- Ingest findings (JSON/CSV)
- Token type classification + blast radius
- Action queue (REVOKE_NOW / ROTATE_NOW / MONITOR)
- Slack digest + ticket payload
- Audit log + tests

## Round 2 — Connectors v1
- GitHub secret scanning import
- Gitleaks/trufflehog parsers
- Idempotent dedup

## Round 3 — Policy Engine
- Per-environment thresholds
- Allowlist/suppressions with expiry
- Policy versioning

## Round 4 — Ownership Routing
- Repo/service owner mapping
- Team escalation routing
- SLA timers

## Round 5 — Workflow Integration
- Jira integration
- ServiceNow integration
- Two-way status sync

## Round 6 — Verification Loop
- Recheck/re-scan triggers
- Verify revoke/rotation closure
- Auto-close with evidence

## Round 7 — Risk Intelligence
- Secret entropy + context enrichment
- Leak source attribution hints
- Prior incident correlation

## Round 8 — Governance & Compliance
- Exportable audit reports
- Exception approvals
- Retention controls

## Round 9 — Scale & Reliability
- Queue workers + retries + DLQ
- Multi-tenant boundaries
- Performance tuning (10k findings/day)

## Round 10 — Launch Readiness
- Operator runbook
- API docs and SDK examples
- Public release checklist
