import fs from 'node:fs';
import path from 'node:path';

const roots = ['src', 'tests'];
let failed = false;

for (const root of roots) {
  for (const file of fs.readdirSync(root)) {
    if (!file.endsWith('.js')) continue;
    const full = path.join(root, file);
    const text = fs.readFileSync(full, 'utf8');
    if (text.includes('eval(')) {
      console.error(`Disallowed eval() usage: ${full}`);
      failed = true;
    }
    if (/\t/.test(text)) {
      console.error(`Tab indentation found: ${full}`);
      failed = true;
    }
  }
}

if (failed) process.exit(1);
console.log('lint: ok');
