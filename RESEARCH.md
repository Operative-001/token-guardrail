# Token Guardrail — VALIDATE Research (Draft)

_Date: 2026-02-19_

## Hypothesis
Teams detect secrets and auth misuse, but remediation is slow and fragmented. A lightweight agent that turns findings into immediate revoke/rotate/ticket actions can close the last-mile gap quickly.

## Why now
- Auth/token governance is actively discussed at high volume (HN policy thread around subscription auth misuse and third-party use controls).
- Open GitHub issues repeatedly surface hardcoded secrets and insecure token handling.
- Security pressure remains high due to fast-moving exploited vulnerabilities, raising urgency for reducing credential attack surface.

## Evidence links
1. HN front page (high-comment auth policy/compliance pressure):
   - https://news.ycombinator.com/
2. GitHub open issues showing hardcoded-secret remediation demand:
   - https://github.com/search?q=%22hardcoded+secret%22+is%3Aissue+is%3Aopen&type=issues
3. CISA KEV catalog showing continued urgent risk environment:
   - https://www.cisa.gov/known-exploited-vulnerabilities-catalog
4. GitHub trending (ecosystem pull toward automation tooling):
   - https://github.com/trending

## User pain summary
- Security findings land as alerts, but revoke/rotate ownership is unclear.
- Secrets remain exposed too long due to manual routing and inconsistent runbooks.
- Teams need decision-ready outputs, not just scanner findings.

## 2-week MVP scope
1. Ingest secret findings (JSON/CSV/webhook)
2. Classify token type + severity + probable blast radius
3. Output queue with explicit actions:
   - REVOKE_NOW
   - ROTATE_NOW
   - MONITOR
4. Generate ticket-ready payload + Slack digest
5. Record audit log of recommendation + human decision

## Success criteria
- Time from finding to owner-assigned action under 15 minutes
- >=50% reduction in manual triage handling time on secret findings
- 100% evidence-attached recommendations (reason codes + source)
