#!/usr/bin/env node
import fs from 'node:fs';
import { normalizeFinding, actionFor } from './engine.js';

function arg(name, fallback=null){ const i=process.argv.indexOf(`--${name}`); return i>-1 ? process.argv[i+1] : fallback; }

function loadFindings(path){
  if (!path) throw new Error('missing --input');
  const raw = fs.readFileSync(path,'utf8');
  if (path.endsWith('.json')) {
    const d = JSON.parse(raw);
    if (!Array.isArray(d)) throw new Error('json input must be array');
    return d;
  }
  if (path.endsWith('.csv')) {
    const [h,...lines] = raw.trim().split(/\r?\n/);
    const headers = h.split(',').map(x=>x.trim());
    return lines.map(line=>Object.fromEntries(headers.map((k,i)=>[k,(line.split(',')[i]||'').trim()])));
  }
  throw new Error('unsupported file type');
}

async function main(){
  try {
    const input = arg('input');
    const top = Number(arg('top','10'));
    const findings = loadFindings(input).map(normalizeFinding);
    const queue = findings.map(actionFor).sort((a,b)=>b.score-a.score).slice(0, top);

    console.log('id\trepo\ttoken_class\tblast\tscore\taction\treasons');
    queue.forEach(q=>console.log(`${q.id}\t${q.repo}\t${q.token_class}\t${q.blast_radius}\t${q.score}\t${q.action}\t${q.reasons.join('|')}`));

    if (process.argv.includes('--tickets')) {
      console.log('\n# Ticket Payloads');
      for (const q of queue) {
        console.log(JSON.stringify({ summary:`[${q.action}] ${q.id} in ${q.repo}`, labels:['token-guardrail', q.action.toLowerCase()], description:q.reasons.join('; ') }));
      }
    }
  } catch (e) {
    console.error(`token-guardrail error: ${e.message}`);
    process.exit(1);
  }
}

main();
