export const db = { findings: [], queue: [], audit: [] };

export function log(event, details = {}) {
  db.audit.push({ ts: new Date().toISOString(), event, details });
}
