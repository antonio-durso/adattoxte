// Convertitore markdown->JS per gli articoli SEO esistenti
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'seo');
const out = path.join(__dirname, '..', 'frontend', 'src', 'content', 'articles-base.js');

const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));

function mdToHtml(md) {
  const lines = md.split('\n');
  let html = '';
  let inList = false;
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { if (inList) { html += '</ul>'; inList = false; } continue; }
    const h1 = line.match(/^# (.*)/);
    const h2 = line.match(/^## (.*)/);
    const li = line.match(/^- (.*)/);
    let text = h1 ? h1[1] : h2 ? h2[1] : li ? li[1] : line;
    text = text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    if (h1) html += `<h1>${text}</h1>\n`;
    else if (h2) { if (inList) { html += '</ul>'; inList = false; } html += `<h2>${text}</h2>\n`; }
    else if (li) { if (!inList) { html += '<ul>'; inList = true; } html += `<li>${text}</li>\n`; }
    else { if (inList) { html += '</ul>'; inList = false; } html += `<p>${text}</p>\n`; }
  }
  if (inList) html += '</ul>\n';
  return html.trim();
}

function parseFrontmatter(file) {
  const content = fs.readFileSync(file, 'utf8');
  const meta = {};
  const m = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return null;
  for (const kv of m[1].split('\n')) {
    if (kv.startsWith('faq:')) { try { meta.faq = JSON.parse(kv.slice(4).trim()); } catch(e) {} continue; }
    const mm = kv.match(/^([a-z_]+):\s*"?(.+?)"?$/);
    if (mm) meta[mm[1]] = mm[2].replace(/"$/, '');
  }
  let body = m[2].trim();
  // rimuovi il titolo h1 ripetuto (è già nel frontmatter)
  body = body.replace(/^# .+\n/, '');
  return { ...meta, body };
}

const articles = files
  .map((f) => parseFrontmatter(path.join(dir, f)))
  .filter(Boolean)
  .map((a) => ({
    slug: a.slug,
    title: a.title,
    keyword: a.keyword,
    metaDescription: a.meta_description,
    date: a.date || '2026-08-24',
    body: mdToHtml(a.body),
    faq: (a.faq || []).map(([q, a]) => ({ q, a })),
  }));

const output = `// Generato da content/seo (script content/build-articles.js) — NON modificare a mano.
export const baseArticles = ${JSON.stringify(articles, null, 2)};
`;
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, output);
console.log(`Convertiti ${articles.length} articoli -> ${out}`);
