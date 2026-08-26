import { Link } from 'react-router-dom';
import { articles, totalArticles } from '../content/articles';
import Reveal from './Reveal';

// Anteprima blog in home — importata in lazy (il contenuto dei 69 articoli
// si carica solo dopo il primo rendering, non blocca la pagina)
export default function BlogPreview() {
  return (
    <section className="container section">
      <Reveal>
        <h2>Dal nostro blog</h2>
        <p className="section-sub">
          Guide e approfondimenti di psicologia scritti dai nostri professionisti.{' '}
          <Link to="/blog">Leggi tutti i {totalArticles} articoli →</Link>
        </p>
      </Reveal>
      <div className="grid cards">
        {articles.slice(0, 3).map((a, i) => (
          <Reveal key={a.slug} delay={i * 90}>
            <Link to={`/blog/${a.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <h2 style={{ margin: 0, lineHeight: 1.3, fontSize: '1.15rem' }}>{a.title}</h2>
                <p className="muted small" style={{ flex: 1 }}>{a.metaDescription}</p>
                <span className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start' }}>Leggi l'articolo</span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
