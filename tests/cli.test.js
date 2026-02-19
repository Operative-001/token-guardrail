import test from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';

test('cli outputs actions', ()=>{
  const out = execSync('node src/cli.js --input examples/findings.json --top 2', {cwd:'/home/reverser/.openclaw/workspace-swarm/projects/token-guardrail', encoding:'utf8'});
  assert.match(out, /REVOKE_NOW|ROTATE_NOW|MONITOR/);
});

test('cli fails on missing input', ()=>{
  let failed=false;
  try { execSync('node src/cli.js', {cwd:'/home/reverser/.openclaw/workspace-swarm/projects/token-guardrail', stdio:'pipe'});} catch(e){ failed=true; assert.match(String(e.stderr), /missing --input|error/i); }
  assert.equal(failed,true);
});
