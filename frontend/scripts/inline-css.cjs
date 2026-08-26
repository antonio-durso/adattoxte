// Post-build: incorpora il CSS principale direttamente nell'HTML (inline).
// Rimuove la richiesta render-blocking del foglio di stile -> FCP piu veloce.
// Tecnica sicura: il CSS resta identico, cambia solo come viene consegnato.
// Processa TUTTI gli HTML generati (home + rotte prerenderizzate).
const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, '..', 'dist');

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else if (entry.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const htmls = walk(dist);
if (htmls.length === 0) {
  console.log('Nessun HTML trovato: salto inline CSS');
  process.exit(0);
}

// Trova il CSS principale dal primo HTML che ha il link
let css = null;
let cssFile = null;
for (const p of htmls) {
  const html = fs.readFileSync(p, 'utf8');
  const m = html.match(/<link[^>]*rel="stylesheet"[^>]*href="(\/assets\/[^"]*\.css)"[^>]*>/);
  if (m) {
    cssFile = path.join(dist, m[1].replace(/^\//, ''));
    if (fs.existsSync(cssFile)) {
      css = fs.readFileSync(cssFile, 'utf8');
      break;
    }
  }
}

if (!css) {
  console.log('CSS principale non trovato: salto inline CSS');
  process.exit(0);
}

let done = 0;
for (const p of htmls) {
  let html = fs.readFileSync(p, 'utf8');
  const linkRe = /<link[^>]*rel="stylesheet"[^>]*href="\/assets\/[^"]*\.css"[^>]*>/;
  if (linkRe.test(html)) {
    html = html.replace(linkRe, `<style>${css}</style>`);
    fs.writeFileSync(p, html);
    done++;
  }
}
console.log(`CSS inline: ${css.length} bytes in ${done} pagine (${cssFile})`);
