# Token Guardrail

[![License: PolyForm Noncommercial](https://img.shields.io/badge/License-PolyForm%20Noncommercial-blue.svg)](LICENSE)

Turn secret scanner findings into owner-assigned revoke/rotate actions.

## Round 1 MVP
- Secret finding ingestion (JSON/CSV)
- Token type classification + blast radius estimation
- Action queue: `REVOKE_NOW` / `ROTATE_NOW` / `MONITOR`
- Slack digest and ticket payload generation
- Audit logging

## Quickstart
```bash
npm install
npm test
node src/cli.js --input examples/findings.json --top 10
```

## Commercial License
This software is free for personal and non-commercial use.

For commercial/business use, open an issue with subject:
`[COMMERCIAL LICENSE INQUIRY]`
