// Accoda testo in fondo al zoneNota esistente (senza riscriverlo).
// Uso: node research/_append_zone.mjs research/batch-7-append.json
import fs from 'fs';

const jsonPath = process.argv[2];
if (!jsonPath) { console.error('manca il file JSON'); process.exit(1); }
const file = 'frontend/src/content/paesi-zone.js';
const add = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
let src = fs.readFileSync(file, 'utf8');

const done = [];
for (const [slug, suffix] of Object.entries(add)) {
  if (suffix.includes('"')) { console.error('DOPPIO APICE nel suffisso ' + slug); process.exit(2); }
  const re = new RegExp("(slug: '" + slug + "',[\\s\\n]*?zoneNota: \")([^\"]*)(\")");
  if (!re.test(src)) { console.error('non trovato: ' + slug); process.exit(1); }
  src = src.replace(re, function (_m, a, b, c) { return a + b + suffix + c; });
  done.push(slug);
}
fs.writeFileSync(file, src);
console.log('accodato a: ' + done.join(', '));
