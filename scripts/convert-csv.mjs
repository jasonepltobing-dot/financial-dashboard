import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SRC = process.argv[2];
const DEST = process.argv[3] ?? path.join(__dirname, '../public/cleaned_data.csv');

if (!SRC) {
  console.error('Usage: node convert-csv.mjs <source.csv> [dest.csv]');
  process.exit(1);
}

function parseCSVLine(line) {
  const cols = [];
  let cur = '';
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { inQuote = !inQuote; continue; }
    if (ch === ',' && !inQuote) { cols.push(cur.trim()); cur = ''; continue; }
    cur += ch;
  }
  cols.push(cur.trim());
  return cols;
}

function formatAmount(raw) {
  if (raw == null || raw === '') return '';
  const n = Number(raw);
  if (!Number.isFinite(n)) return raw;
  return String(n);
}

const raw = fs.readFileSync(SRC, 'utf8').replace(/^\uFEFF/, '');
const lines = raw.replace(/\r/g, '').split('\n');
const header = parseCSVLine(lines[0] || '');
const hasSourceSheet = header[0] === 'Source Sheet';

const out = ['Year,Month,Segment,Sub-Segment,Category,Subcategory,Tag,Amount,Quarter,Difference,Difference YTD Budget'];
let kept = 0;
let skippedSheet = 0;
let skippedEmpty = 0;

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  const cols = parseCSVLine(line);
  let rest = cols;
  if (hasSourceSheet) {
    const sheet = cols[0];
    if (sheet && sheet !== 'Sheet1') {
      skippedSheet++;
      continue;
    }
    rest = cols.slice(1);
  }
  const yearRaw = rest[0] ?? '';
  const month = rest[1] ?? '';
  if (!yearRaw || !month) {
    skippedEmpty++;
    continue;
  }
  const year = String(yearRaw).replace(/\.0+$/, '');
  const segment = rest[2] ?? '';
  const subSegment = rest[3] ?? '';
  const category = rest[4] ?? '';
  const subcategory = rest[5] ?? '';
  const tag = rest[6] ?? '';
  const amount = formatAmount(rest[7]);
  const quarter = rest[8] ?? '';
  const difference = rest[9] ?? '';
  const diffYtd = rest[10] ?? '';
  out.push([year, month, segment, subSegment, category, subcategory, tag, amount, quarter, difference, diffYtd].join(','));
  kept++;
}

fs.mkdirSync(path.dirname(DEST), { recursive: true });
fs.writeFileSync(DEST, out.join('\n') + '\n', 'utf8');
console.log(`Wrote ${DEST}`);
console.log(`kept=${kept} skippedSheet=${skippedSheet} skippedEmpty=${skippedEmpty}`);
