import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeFinding, classifyTokenType, actionFor } from '../src/engine.js';

test('normalize finding validates required fields', ()=>{
  assert.throws(()=>normalizeFinding({}), /requires id and source/);
});

test('classify token type', ()=>{
  assert.equal(classifyTokenType('aws_access_key'), 'cloud_key');
  assert.equal(classifyTokenType('github_token'), 'vcs_token');
});

test('critical finding maps to revoke', ()=>{
  const a = actionFor(normalizeFinding({id:'1',source:'x',secret_type:'aws_access_key',repo:'r',confidence:0.95,exposure:'public',environment:'prod'}));
  assert.equal(a.action, 'REVOKE_NOW');
});
