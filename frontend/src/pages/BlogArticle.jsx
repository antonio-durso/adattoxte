import { Link, useParams } from 'react-router-dom';
import { getArticle, articles } from '../content/articles';
import Seo from '../components/Seo';
import TestCta from '../components/TestCta';

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
          url: 'https://adattoxte.vercel.app/blog',
        },
        publisher: { '@type': 'Organization', name: 'Adatto x Te' },
        about: { '@type': 'MedicalCondition', name: 'Salute mentale e benessere psicologico' },
        mainEntityOfPage: `https://adattoxte.vercel.app/blog/${article.slug}`,
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
          url: 'https://adattoxte.vercel.app/blog',
        },
        publisher: { '@type': 'Organization', name: 'Adatto x Te' },
        mainEntityOfPage: `https://adattoxte.vercel.app/blog/${article.slug}`,
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

  return (
    <div className="container section">
      <Seo
        title={article.title}
        description={article.metaDescription}
        path={`/blog/${article.slug}`}
        image="https://adattoxte.vercel.app/images/hero.jpg"
        jsonLd={articleSchema}
      />
      <Link to="/blog" className="muted small" style={{ display: 'inline-block', marginBottom: 12 }}>
        ← Torna al blog
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
            <strong style={{ display: 'block', fontSize: 14.5 }}>Scritto da {ARTICLE_AUTHOR.name}</strong>
            <span className="muted" style={{ fontSize: 12.5 }}>
              {ARTICLE_AUTHOR.role} · {formatDate(article.date)} · ⏱ {minutes} min di lettura
            </span>
          </div>
        </div>
        <div dangerouslySetInnerHTML={{ __html: article.body }} />
      </article>

      {/* CTA verso i test clinici (contenuto → strumento) */}
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <TestCta variant={testVariant} />
      </div>

      {related.length > 0 && (
        <div style={{ maxWidth: 760, margin: '26px auto 0' }}>
          <h2 style={{ fontSize: 18 }}>Articoli correlati</h2>
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
        <p className="muted">Vuoi parlare con un professionista verificato?</p>
        <Link to="/terapeuti" className="btn btn-primary">
          Trova il tuo terapeuta
        </Link>
      </div>
    </div>
  );
}
