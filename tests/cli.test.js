import test from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

test('cli outputs actions', () => {
  const out = execSync('node src/cli.js --input examples/findings.json --top 2', {
    cwd: projectRoot,
    encoding: 'utf8'
  });
  assert.match(out, /REVOKE_NOW|ROTATE_NOW|MONITOR/);
});

test('cli fails on missing input', () => {
  let failed = false;
  try {
    execSync('node src/cli.js', { cwd: projectRoot, stdio: 'pipe' });
  } catch (e) {
    failed = true;
    assert.match(String(e.stderr || e.message), /missing --input|error|required/i);
  }
  assert.equal(failed, true);
});
