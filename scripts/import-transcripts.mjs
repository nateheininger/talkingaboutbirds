// Copies transcripts from your local Transcripts folder into src/data/transcripts/<episode>.txt
// so they get published on the episode pages.
//
//   npm run import-transcripts                       # reads ../Transcripts
//   npm run import-transcripts -- "/path/to/folder"  # reads a different folder
//   npm run import-transcripts -- --force            # overwrite transcripts already imported
//
// File names just need to start with the episode number: "241.txt", "241trans.docx", "241 final.txt".
// .txt is preferred over .docx when both exist. .docx conversion uses macOS's built-in textutil.
import { readdir, readFile, writeFile, access } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const args = process.argv.slice(2);
const force = args.includes('--force');
const source = path.resolve(args.find((a) => !a.startsWith('--')) ?? path.join(root, '..', 'Transcripts'));
const dest = path.join(root, 'src', 'data', 'transcripts');

const rank = (file) => (file.endsWith('.txt') ? 0 : file.endsWith('.docx') ? 1 : 2);
const best = new Map();
for (const file of (await readdir(source)).sort()) {
  const match = file.match(/^(\d+)/);
  if (!match || !/\.(txt|docx)$/i.test(file)) continue;
  const number = Number(match[1]);
  const current = best.get(number);
  if (!current || rank(file) < rank(current)) best.set(number, file);
}

let imported = 0;
for (const [number, file] of [...best].sort((a, b) => a[0] - b[0])) {
  const target = path.join(dest, `${number}.txt`);
  if (!force && (await access(target).then(() => true, () => false))) continue;
  const full = path.join(source, file);
  const text = file.endsWith('.docx')
    ? execFileSync('textutil', ['-convert', 'txt', '-stdout', full], { encoding: 'utf8' })
    : await readFile(full, 'utf8');
  await writeFile(target, text.replace(/\r\n?/g, '\n').trim() + '\n');
  console.log(`  ${number}  ←  ${file}`);
  imported++;
}
console.log(`Imported ${imported} transcript(s) into src/data/transcripts/`);
