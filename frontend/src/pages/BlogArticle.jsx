import { Link, useParams } from 'react-router-dom';
import { getArticle, articles } from '../content/articles';
import Seo from '../components/Seo';

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return iso;
  }
}

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
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: article.title,
          description: article.metaDescription,
          datePublished: article.date,
          dateModified: article.date,
          inLanguage: 'it',
          author: { '@type': 'Organization', name: 'Redazione Adatto x Te' },
          publisher: { '@type': 'Organization', name: 'Adatto x Te' },
          mainEntityOfPage: `https://adattoxte.vercel.app/blog/${article.slug}`,
        }}
      />
      <Link to="/blog" className="muted small" style={{ display: 'inline-block', marginBottom: 12 }}>
        ← Torna al blog
      </Link>
      <article
        className="card"
        style={{ padding: '24px 20px', maxWidth: 760, margin: '0 auto', lineHeight: 1.65 }}
      >
        <h1 style={{ marginTop: 0 }}>{article.title}</h1>
        <div className="muted small" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #f1f5f9' }}>
          <span>✍️ Redazione Adatto x Te</span>
          <span>·</span>
          <span>{formatDate(article.date)}</span>
          <span>·</span>
          <span>⏱ {minutes} min di lettura</span>
        </div>
        <div dangerouslySetInnerHTML={{ __html: article.body }} />
      </article>

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
