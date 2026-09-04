import { Link, useParams } from 'react-router-dom';
import { getArticle, articles } from '../content/articles';
import { citta, CITTA_TOP } from '../content/citta';
import { paesi } from '../content/paesi';
import Seo from '../components/Seo';
import TestCta from '../components/TestCta';
import { useI18n } from '../i18n';

// ── Blocco "La terapia online, ovunque tu sia" ──────────────────────────────
// Link interni automatici in coda a ogni articolo (SEO hub & spoke):
// articoli sui disturbi → città italiane TOP; articoli generali → hub paese estero.
// Nessun testo degli articoli viene modificato: il blocco è generato dal codice.
const CITTA_MAP = Object.fromEntries(citta.map((c) => [c.slug, c.nome]));
const PAESE_POOL = [
  'regno-unito', 'germania', 'francia', 'spagna', 'svizzera', 'belgio',
  'paesi-bassi', 'austria', 'irlanda', 'stati-uniti', 'canada', 'lussemburgo',
];
const PAESE_MAP = Object.fromEntries(paesi.map((p) => [p.slug, p.nome]));
const ABROAD_RE = /estero|espatri|emigraz|londra|berlino|parigi|madrid|dublino|svizzera|germania|francia|spagna|regno unito|belgio|austria|paesi bassi|irlanda|stati uniti|america|canada|new york|lussemburgo|all'estero/i;
const CLINICAL_RE = /ansia|depress|panic|fobi|ossess|disturbo|insonn|autostim|burnout|lutto|trauma|stress|rabbia|gelosi|dipendenz|adhd|cybercondri|assertiv|timidezz|bipolare|sonno|umore|alimentar|anoressi|bulimi|tristez|attacco|autolesion|pensieri negativ|mindfulness|meditaz|homesickness|nostalgia/i;

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

// Selezione deterministica (stabile per slug) da CITTA_TOP: 4 città diverse per articolo.
function cityBlockLinks(slug) {
  const h = hashStr(slug);
  const step = 7; // coprimo con 30 → distribuzione uniforme
  const picks = [];
  for (let i = 0; i < 4; i++) {
    const s = CITTA_TOP[(h + i * step) % CITTA_TOP.length];
    if (!picks.includes(s)) picks.push(s);
  }
  return picks.map((s) => ({ to: `/psicologo-online/${s}`, label: CITTA_MAP[s] }));
}

// Selezione deterministica dagli hub paese; se l'articolo cita un paese del pool,
// quello viene messo in prima posizione.
function countryBlockLinks(slug, hay) {
  const h = hashStr(slug);
  const step = 5; // coprimo con 12
  const picks = [];
  for (let i = 0; i < 4; i++) {
    const s = PAESE_POOL[(h + i * step) % PAESE_POOL.length];
    if (!picks.includes(s)) picks.push(s);
  }
  const hit = PAESE_POOL.find((s) => PAESE_MAP[s] && hay.includes(PAESE_MAP[s].toLowerCase()));
  if (hit && !picks.includes(hit)) picks.unshift(hit);
  return picks.slice(0, 5).map((s) => ({ to: `/italiani-all-estero/${s}`, label: PAESE_MAP[s] }));
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return iso;
  }
}

// Autore reale con credenziali (E-E-A-T / YMYL: Google premia gli articoli firmati da professionisti)
const ARTICLE_AUTHOR = {
  name: "Dott. Antonio D'Urso",
  role: "Iscritto all'albo degli psicologi della Campania n. 5408",
  initial: 'A',
};

function readingMinutes(html) {
  const words = (html || '')
    .replace(/<[^>]+>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export default function BlogArticle() {
  const { slug } = useParams();
  const { lang } = useI18n();
  const article = getArticle(slug);

  if (!article) {
    return (
      <div className="container section">
        <Seo title="Articolo non trovato" description="L'articolo richiesto non esiste." path="/blog" />
        <h1>Articolo non trovato</h1>
        <p className="muted">L'articolo che cerchi non esiste o è stato spostato.</p>
        <Link to="/blog" className="btn btn-outline">
          Torna al blog
        </Link>
      </div>
    );
  }

  const minutes = readingMinutes(article.body);
  // Un solo H1 per pagina: l'H1 è il titolo dell'articolo, quindi gli H1 presenti
  // nei body vengono retrocessi a H2 (evita H1 duplicati nelle pagine blog).
  const bodyHtml = (article.body || '')
    .replace(/<h1([^>]*)>/g, '<h2$1>')
    .replace(/<\/h1>/g, '</h2>');
  const keyword = (article.keyword || '').toLowerCase();
  // Schema medico per contenuti salute (E-E-A-T, settore YMYL)
  const medical = /ansia|depress|stress|psicolog|panic|salute|benessere|sonno|trauma|umore/i.test(
    keyword + ' ' + (article.title || '')
  );
  const articleSchema = medical
    ? {
        '@context': 'https://schema.org',
        '@type': 'MedicalWebPage',
        headline: article.title,
        description: article.metaDescription,
        datePublished: article.date,
        dateModified: article.date,
        inLanguage: 'it',
        author: {
          '@type': 'Person',
          name: "Dott. Antonio D'Urso",
          jobTitle: 'Psicologo',
          identifier: 'Albo Psicologi Campania n. 5408',
          url: 'https://www.adattoxte.com/chi-siamo',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Adatto x Te',
          url: 'https://www.adattoxte.com',
          sameAs: ['https://it.trustpilot.com/review/adattoxte.com'],
        },
        about: { '@type': 'MedicalCondition', name: 'Salute mentale e benessere psicologico' },
        mainEntityOfPage: `https://www.adattoxte.com/blog/${article.slug}`,
      }
    : {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.metaDescription,
        datePublished: article.date,
        dateModified: article.date,
        inLanguage: 'it',
        author: {
          '@type': 'Person',
          name: "Dott. Antonio D'Urso",
          jobTitle: 'Psicologo',
          identifier: 'Albo Psicologi Campania n. 5408',
          url: 'https://www.adattoxte.com/chi-siamo',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Adatto x Te',
          url: 'https://www.adattoxte.com',
          sameAs: ['https://it.trustpilot.com/review/adattoxte.com'],
        },
        mainEntityOfPage: `https://www.adattoxte.com/blog/${article.slug}`,
      };
  // Test consigliato in base al tema dell'articolo (Hub & Spoke)
  const testVariant = /umore|depress|tristez|burnout|sonno/i.test(keyword + ' ' + article.title) ? 'umore' : 'ansia';
  const related = articles
    .filter((a) => a.slug !== article.slug)
    .sort((a, b) => {
      const sa = keyword && (a.keyword || '').toLowerCase().includes(keyword) ? 1 : 0;
      const sb = keyword && (b.keyword || '').toLowerCase().includes(keyword) ? 1 : 0;
      return sb - sa || (a.date < b.date ? 1 : -1);
    })
    .slice(0, 3);

  // Classificazione per il blocco città/paese: estero o articoli generali → hub paese;
  // disturbi e temi clinici → città italiane TOP (regola approvata).
  const hay = `${keyword} ${(article.title || '').toLowerCase()} ${article.slug}`;
  const abroad = ABROAD_RE.test(hay);
  const clinical = CLINICAL_RE.test(hay);
  const geoLinks = abroad || !clinical ? countryBlockLinks(article.slug, hay) : cityBlockLinks(article.slug);
  const geoIsCity = !(abroad || !clinical);

  return (
    <div className="container section">
      <Seo
        title={article.title}
        description={article.metaDescription}
        path={`/blog/${article.slug}`}
        image="https://www.adattoxte.com/images/hero.jpg"
        jsonLd={[
          articleSchema,
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.adattoxte.com/' },
              { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.adattoxte.com/blog' },
              { '@type': 'ListItem', position: 3, name: article.title, item: `https://www.adattoxte.com/blog/${article.slug}` },
            ],
          },
        ]}
      />
      {/* FAQPage rich snippet (se l'articolo ha domande frequenti) */}
      {article.faq && article.faq.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: article.faq.map((f) => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
              })),
            }),
          }}
        />
      )}
      <Link to="/blog" className="muted small" style={{ display: 'inline-block', marginBottom: 12 }}>
        {lang === 'it' ? '← Torna al blog' : '← Back to the blog'}
      </Link>
      <article
        className="card"
        style={{ padding: '24px 20px', maxWidth: 760, margin: '0 auto', lineHeight: 1.65 }}
      >
        <h1 style={{ marginTop: 0 }}>{article.title}</h1>
        {/* Byline autore (E-E-A-T: Google premia gli articoli firmati) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, paddingBottom: 14, borderBottom: '1px solid #f1f5f9' }}>
          <div
            aria-hidden="true"
            style={{ width: 44, height: 44, borderRadius: '50%', background: '#2f7ba6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 19, flexShrink: 0 }}
          >
            {ARTICLE_AUTHOR.initial}
          </div>
          <div style={{ lineHeight: 1.4 }}>
            <strong style={{ display: 'block', fontSize: 14.5 }}>
              {lang === 'it' ? 'Scritto da' : 'Written by'} {ARTICLE_AUTHOR.name}
            </strong>
            <span className="muted" style={{ fontSize: 12.5 }}>
              {ARTICLE_AUTHOR.role} · {formatDate(article.date)} · ⏱ {minutes} {lang === 'it' ? 'min di lettura' : 'min read'}
            </span>
          </div>
        </div>
        <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      </article>

      {/* Blocco "La terapia online, ovunque tu sia": link a città TOP o hub paese (SEO hub & spoke) */}
      <div style={{ maxWidth: 760, margin: '18px auto 0', background: '#f0faf7', border: '1px solid #bcd9cf', borderRadius: 12, padding: '16px 20px' }}>
        <h2 style={{ fontSize: 16, margin: '0 0 6px' }}>
          {lang === 'it' ? 'La terapia online, ovunque tu sia' : 'Online therapy, wherever you are'}
        </h2>
        <p className="muted small" style={{ margin: '0 0 12px' }}>
          {lang === 'it'
            ? geoIsCity
              ? 'Il percorso psicologico in italiano parte anche dalla tua città: sedute in videochiamata con professionisti qualificati.'
              : 'Vivi all\u2019estero o sei in trasferta? La terapia in italiano ti segue in ogni paese, nello stesso fuso orario dell\u2019Italia.'
            : geoIsCity
              ? 'Your therapy journey starts from your city too: video sessions with qualified professionals.'
              : 'Living abroad or travelling? Therapy in Italian follows you to every country.'}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {geoLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              style={{ textDecoration: 'none', background: '#fff', border: '1px solid #bcd9cf', color: '#166b52', borderRadius: 999, padding: '6px 14px', fontSize: 13.5, fontWeight: 600 }}
            >
              {geoIsCity ? `Psicologo online a ${l.label}` : `Italiani in ${l.label}`}
            </Link>
          ))}
        </div>
      </div>

      {/* Link interni verso le landing principali (SEO: hub & spoke blog -> landing) */}
      <div style={{ maxWidth: 760, margin: '22px auto 0', background: '#f0f7fb', border: '1px solid #cfe6f2', borderRadius: 12, padding: '16px 20px' }}>
        <h2 style={{ fontSize: 16, margin: '0 0 10px' }}>
          {lang === 'it' ? 'Approfondisci: percorsi di supporto' : 'Learn more: support paths'}
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {[
            { to: '/psicologo-online', label: lang === 'it' ? 'Psicologo online' : 'Online psychologist' },
            { to: '/psicologo-online/ansia', label: lang === 'it' ? 'Psicologo per l\u2019ansia' : 'Anxiety' },
            { to: '/psicologo-online/depressione', label: lang === 'it' ? 'Psicologo per la depressione' : 'Depression' },
            { to: '/psicologo-online/attacchi-di-panico', label: lang === 'it' ? 'Attacchi di panico' : 'Panic attacks' },
            { to: '/psicologo-online/insonnia', label: lang === 'it' ? 'Insonnia' : 'Insomnia' },
          ].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              style={{ textDecoration: 'none', background: '#fff', border: '1px solid #cfe6f2', color: '#2f7ba6', borderRadius: 999, padding: '6px 14px', fontSize: 13.5, fontWeight: 600 }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Bio autore a fine articolo (E-E-A-T: firma del professionista) */}
      <div style={{ maxWidth: 760, margin: '26px auto 0', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '18px 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#2f7ba6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18, flexShrink: 0 }}>
          {ARTICLE_AUTHOR.initial}
        </div>
        <div style={{ fontSize: 13.5, lineHeight: 1.55, color: '#334155' }}>
          <strong style={{ display: 'block', marginBottom: 4 }}>
            {lang === 'it' ? 'Chi ha scritto questo articolo' : 'About the author'}
          </strong>
          {lang === 'it'
            ? `Questo articolo è stato scritto da ${ARTICLE_AUTHOR.name}, ${ARTICLE_AUTHOR.role.toLowerCase()} e fondatore di Adatto x Te, con 13 anni di esperienza nel settore. I contenuti sono revisionati dall'équipe e non sostituiscono un consulto professionale.`
            : `This article was written by ${ARTICLE_AUTHOR.name}, ${ARTICLE_AUTHOR.role} and founder of Adatto x Te, with 13 years of experience in the field. Content is reviewed by the team and does not replace professional advice.`}
          {' '}
          <Link to="/chi-siamo" className="muted small" style={{ textDecoration: 'underline' }}>
            {lang === 'it' ? 'Scopri chi siamo' : 'Learn more about us'}
          </Link>
        </div>
      </div>

      {/* CTA verso i test clinici (contenuto → strumento) */}
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <TestCta variant={testVariant} />
      </div>

      {related.length > 0 && (
        <div style={{ maxWidth: 760, margin: '26px auto 0' }}>
          <h2 style={{ fontSize: 18 }}>{lang === 'it' ? 'Articoli correlati' : 'Related articles'}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            {related.map((r) => (
              <Link key={r.slug} to={`/blog/${r.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="card" style={{ height: '100%', padding: 14 }}>
                  <h3 style={{ margin: 0, fontSize: 15, lineHeight: 1.35 }}>{r.title}</h3>
                  <p className="muted small" style={{ margin: '8px 0 0' }}>{formatDate(r.date)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: 28 }}>
        <p className="muted">{lang === 'it' ? 'Vuoi parlare con un professionista verificato?' : 'Want to talk to a verified professional?'}</p>
        <Link to="/terapeuti" className="btn btn-primary">
          {lang === 'it' ? 'Trova il tuo terapeuta' : 'Find your therapist'}
        </Link>
      </div>
    </div>
  );
}
