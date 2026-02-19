# Token Guardrail Architecture (DESIGN)

_Date: 2026-02-19_

## Objective
Turn secret scanner findings into owner-assigned revoke/rotate actions with evidence and auditability.

## System context

```text
[Scanner Inputs]
  GitHub alerts / trufflehog / gitleaks / CSV/JSON
            |
            v
      [Ingestion Layer] ---> [Normalizer]
            |                    |
            v                    v
      [Token Classifier] ---> [Blast Radius Engine]
            |                    |
            +-----> [Action Engine + Reason Codes]
                                |
              +-----------------+----------------+
              v                                  v
      [Slack Digest]                    [Ticket Payload Builder]
              \                                  /
               \                                /
                +------> [Audit Log Store] <---+
```

## Core components
1. **Ingestion**
   - Accept JSON/CSV findings via CLI and API.
   - Canonical schema: `id, source, secret_type, repo, file, confidence, exposure`.

2. **Classification Engine**
   - Map findings to token classes: cloud key, VCS token, API key, webhook secret, unknown.
   - Confidence normalization and reason extraction.

3. **Blast Radius Engine**
   - Risk factors: production repo, public exposure, privilege hints, secret age.
   - Output: `LOW | MEDIUM | HIGH | CRITICAL` plus rationale.

4. **Action Engine**
   - `REVOKE_NOW` for critical/high exploitable findings.
   - `ROTATE_NOW` for medium/high with managed replacement path.
   - `MONITOR` for low confidence / low blast radius.

5. **Delivery Integrations**
   - Slack webhook digest.
   - Ticket payload JSON (Jira/ServiceNow compatible fields).

6. **Audit Logging**
   - Append-only events for ingest, classification, action recommendation, and human decision.

## API surface (MVP)
- `POST /ingest` — ingest array of findings
- `POST /analyze` — classify + score + action queue
- `GET /queue` — current recommendations
- `GET /tickets` — ticket-ready payloads
- `POST /notify/slack` — send digest
- `GET /audit` — audit events

## Security controls
- Validate and sanitize all external fields.
- Reject oversized payloads and invalid schema.
- No secret values persisted by default (hash/fingerprint only in future rounds).

## MVP success criteria
- End-to-end from raw findings to ranked action queue in < 2 minutes.
- Recommendations include explicit reason codes.
- Every recommendation has an audit event.
