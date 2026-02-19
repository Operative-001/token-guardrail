import test from 'node:test';
import assert from 'node:assert/strict';
import server from '../src/server.js';

let base;
test.before(async ()=>{ await new Promise(r=>server.listen(0,r)); base=`http://127.0.0.1:${server.address().port}`; });
test.after(async ()=>{ await new Promise(r=>server.close(r)); });

test('ingest+analyze+queue+tickets+audit works', async ()=>{
  const ing = await fetch(`${base}/ingest`, {method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({findings:[{id:'a',source:'scan',secret_type:'api_key',repo:'x',confidence:0.8,exposure:'public',environment:'prod'}]})});
  assert.equal(ing.status, 201);
  const an = await fetch(`${base}/analyze`, {method:'POST'}); assert.equal(an.status,200);
  const q = await fetch(`${base}/queue`).then(r=>r.json()); assert.equal(q.count,1);
  const t = await fetch(`${base}/tickets`).then(r=>r.json()); assert.equal(t.count,1);
  const a = await fetch(`${base}/audit`).then(r=>r.json()); assert.ok(a.count>=2);
});

test('ingest validation rejects empty findings', async ()=>{
  const r = await fetch(`${base}/ingest`, {method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({findings:[]})});
  assert.equal(r.status, 400);
});
