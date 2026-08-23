import { Link, useParams } from 'react-router-dom';
import { getArticle } from '../content/articles';

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return iso;
  }
}

export default function BlogArticle() {
  const { slug } = useParams();
  const article = getArticle(slug);

  if (!article) {
    return (
      <div className="container section">
        <h1>Articolo non trovato</h1>
        <p className="muted">L'articolo che cerchi non esiste o è stato spostato.</p>
        <Link to="/blog" className="btn btn-outline">
          Torna al blog
        </Link>
      </div>
    );
  }

  return (
    <div className="container section">
      <Link to="/blog" className="muted small" style={{ display: 'inline-block', marginBottom: 12 }}>
        ← Torna al blog
      </Link>
      <article
        className="card"
        style={{ padding: '24px 20px', maxWidth: 760, margin: '0 auto', lineHeight: 1.65 }}
      >
        <div className="muted small" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
          {formatDate(article.date)}
        </div>
        <div dangerouslySetInnerHTML={{ __html: article.body }} />
      </article>
      <div style={{ textAlign: 'center', marginTop: 28 }}>
        <p className="muted">Vuoi parlare con un professionista verificato?</p>
        <Link to="/terapeuti" className="btn btn-primary">
          Trova il tuo terapeuta
        </Link>
      </div>
    </div>
  );
}
