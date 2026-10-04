// Patcher generico per frontend/src/content/paesi-zone.js
// Uso: node research/_patch_zone.mjs research/batch-N.json
// Il JSON è { "slug": "<h2>...</h2>...", ... } (nessun doppio apice nel testo).
import fs from 'fs';

const jsonPath = process.argv[2];
if (!jsonPath) { console.error('manca il file JSON'); process.exit(1); }
const file = 'frontend/src/content/paesi-zone.js';
const blocks = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
let src = fs.readFileSync(file, 'utf8');

const updated = [];
const appended = [];
for (const [slug, html] of Object.entries(blocks)) {
  if (html.includes('"')) { console.error('DOPPIO APICE nel blocco ' + slug); process.exit(2); }
  const re = new RegExp("(slug: '" + slug + "',[\\s\\n]*?)zoneNota: \"[^\"]*\"");
  if (re.test(src)) {
    src = src.replace(re, function (_m, p1) { return p1 + 'zoneNota: "' + html + '"'; });
    updated.push(slug);
  } else {
    appended.push(slug);
  }
}

if (appended.length) {
  const i = src.lastIndexOf('];');
  let head = src.slice(0, i).replace(/\s+$/, '');
  if (!head.endsWith(',')) head += ',';
  const ents = appended.map(function (s) {
    return "  {\n    slug: '" + s + "',\n    zoneNota: \"" + blocks[s] + "\",\n  },";
  }).join('\n');
  src = head + '\n' + ents + '\n];\n';
}

fs.writeFileSync(file, src);
console.log('aggiornati: ' + updated.length + ' [' + updated.join(', ') + ']');
console.log('aggiunti:   ' + appended.length + ' [' + appended.join(', ') + ']');
