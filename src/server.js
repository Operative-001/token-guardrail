import http from 'node:http';
import { normalizeFinding, actionFor } from './engine.js';
import { db, log } from './store.js';

const PORT = Number(process.env.PORT || 8791);
function json(res, code, obj){ res.writeHead(code, {'content-type':'application/json'}); res.end(JSON.stringify(obj)); }
async function parseBody(req){ const chunks=[]; for await (const c of req) chunks.push(c); return JSON.parse(Buffer.concat(chunks).toString('utf8')||'{}'); }

function toTicketPayload(a){
  return {
    summary: `[${a.action}] ${a.id} in ${a.repo}`,
    labels: ['token-guardrail', a.action.toLowerCase()],
    description: `blast_radius=${a.blast_radius}, score=${a.score}, reasons=${a.reasons.join('; ')}`
  };
}

const server = http.createServer(async (req,res)=>{
  try {
    const u = new URL(req.url, `http://${req.headers.host}`);
    if (req.method==='GET' && u.pathname==='/health') return json(res,200,{ok:true});

    if (req.method==='POST' && u.pathname==='/ingest') {
      const b = await parseBody(req);
      if (!Array.isArray(b.findings) || b.findings.length===0) return json(res,400,{error:'findings array required'});
      const normalized = b.findings.map(normalizeFinding);
      db.findings.push(...normalized); log('ingest', {count: normalized.length});
      return json(res,201,{count: normalized.length});
    }

    if (req.method==='POST' && u.pathname==='/analyze') {
      db.queue = db.findings.map(actionFor).sort((a,b)=>b.score-a.score);
      log('analyze', {count: db.queue.length});
      return json(res,200,{count: db.queue.length, queue: db.queue});
    }

    if (req.method==='GET' && u.pathname==='/queue') return json(res,200,{count:db.queue.length,queue:db.queue});
    if (req.method==='GET' && u.pathname==='/tickets') return json(res,200,{count:db.queue.length,tickets:db.queue.map(toTicketPayload)});

    if (req.method==='POST' && u.pathname==='/notify/slack') {
      const b = await parseBody(req);
      const webhook = b.webhook_url || process.env.SLACK_WEBHOOK_URL;
      if (!webhook) return json(res,400,{error:'webhook_url required'});
      const lines = ['*Token Guardrail Digest*', ...db.queue.slice(0,10).map(q=>`• ${q.action} ${q.id} (${q.blast_radius})`)];
      const r = await fetch(webhook,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({text:lines.join('\n')})});
      log('notify_slack', {status:r.status, count: Math.min(10, db.queue.length)});
      return json(res,200,{status:r.status});
    }

    if (req.method==='GET' && u.pathname==='/audit') return json(res,200,{count:db.audit.length,events:db.audit});
    return json(res,404,{error:'not found'});
  } catch (e) {
    return json(res,500,{error:e.message});
  }
});

if (process.argv[1] && new URL(`file://${process.argv[1]}`).href === import.meta.url) {
  server.listen(PORT, ()=>console.log(`token-guardrail listening on :${PORT}`));
}

export default server;
