export function normalizeFinding(f) {
  if (!f || typeof f !== 'object') throw new Error('invalid finding object');
  if (!f.id || !f.source) throw new Error('finding requires id and source');
  if (!f.secret_type) throw new Error('finding requires secret_type');
  return {
    id: String(f.id),
    source: String(f.source),
    secret_type: String(f.secret_type).toLowerCase(),
    repo: String(f.repo || 'unknown'),
    file: String(f.file || 'unknown'),
    confidence: Number(f.confidence ?? 0.5),
    exposure: String(f.exposure || 'internal'),
    environment: String(f.environment || 'unknown')
  };
}

export function classifyTokenType(secretType) {
  const s = String(secretType).toLowerCase();
  if (s.includes('aws') || s.includes('cloud')) return 'cloud_key';
  if (s.includes('github') || s.includes('gitlab') || s.includes('vcs')) return 'vcs_token';
  if (s.includes('webhook')) return 'webhook_secret';
  if (s.includes('api')) return 'api_key';
  return 'unknown';
}

export function blastRadius(f) {
  let score = 20;
  if (f.exposure === 'public') score += 35;
  if (f.environment === 'prod') score += 25;
  if (f.confidence >= 0.8) score += 15;
  const t = classifyTokenType(f.secret_type);
  if (t === 'cloud_key' || t === 'vcs_token') score += 15;
  if (score >= 80) return { level: 'CRITICAL', score };
  if (score >= 60) return { level: 'HIGH', score };
  if (score >= 40) return { level: 'MEDIUM', score };
  return { level: 'LOW', score };
}

export function actionFor(f) {
  const cls = classifyTokenType(f.secret_type);
  const br = blastRadius(f);
  let action = 'MONITOR';
  if (br.level === 'CRITICAL' || (br.level === 'HIGH' && f.confidence >= 0.8)) action = 'REVOKE_NOW';
  else if (br.level === 'HIGH' || br.level === 'MEDIUM') action = 'ROTATE_NOW';

  return {
    id: f.id,
    repo: f.repo,
    token_class: cls,
    blast_radius: br.level,
    score: br.score,
    action,
    reasons: [
      `token_class=${cls}`,
      `exposure=${f.exposure}`,
      `environment=${f.environment}`,
      `confidence=${f.confidence}`
    ]
  };
}
