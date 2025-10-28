import { mkdir, rm, cp } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SOURCE = path.resolve(ROOT, 'assets');
const DEST = path.resolve(ROOT, 'public', 'assets');

async function main() {
  await rm(DEST, { recursive: true, force: true });
  await mkdir(DEST, { recursive: true });
  await cp(SOURCE, DEST, { recursive: true });
  console.log(`Synced assets -> ${path.relative(ROOT, DEST)}`);
}

await main();
