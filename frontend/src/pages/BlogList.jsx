import { Link } from 'react-router-dom';
import { articles, totalArticles } from '../content/articles';

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return iso;
  }
}

export default function BlogList() {
  return (
    <div className="container section">
      <h1>Blog di Adatto x Te</h1>
      <p className="muted">
        Articoli di psicologia scritti dai nostri professionisti: guide, approfondimenti e consigli pratici
        su ansia, coppia, lavoro, sport e benessere. {totalArticles} articoli disponibili.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {articles.map((a) => (
          <Link key={a.slug} to={`/blog/${a.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div
              className="card"
              style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 18 }}
            >
              <div className="muted small" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                {formatDate(a.date)}
              </div>
              <h3 style={{ margin: 0, lineHeight: 1.3 }}>{a.title}</h3>
              <p className="muted small" style={{ flex: 1 }}>
                {a.metaDescription}
              </p>
              <span className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start' }}>
                Leggi l'articolo
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
