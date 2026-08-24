import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { articles, totalArticles } from '../content/articles';
import Seo from '../components/Seo';

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return iso;
  }
}

// Categorie automatiche dagli articoli (keyword + titolo)
const CAT_RULES = [
  { cat: 'Ansia', kws: ['ansia', 'stress', 'attacco di panico', 'respirazione'] },
  { cat: 'Depressione', kws: ['depressione', 'umore', 'tristezza'] },
  { cat: 'Coppia', kws: ['coppia', 'relazioni', 'tradimento', 'separazione', 'amore'] },
  { cat: 'Sport', kws: ['sport', 'prestazione', 'allenamento', 'atleti', 'atleta'] },
  { cat: 'Concorsi', kws: ['concorsi', 'esame', 'studio'] },
  { cat: 'Lavoro', kws: ['lavoro', 'burnout', 'azienda', 'ufficio'] },
  { cat: 'Sonno', kws: ['sonno', 'insonnia', 'dormire'] },
  { cat: 'Famiglia', kws: ['genitori', 'famiglia', 'figli', 'adolescenti', 'adolescenza'] },
  { cat: 'Fobie', kws: ['fobia', 'paura di parlare', 'pubblico'] },
];

function articleCategory(a) {
  const k = `${a.keyword || ''} ${a.title || ''}`.toLowerCase();
  const hit = CAT_RULES.find((r) => r.kws.some((w) => k.includes(w)));
  return hit ? hit.cat : 'Altro';
}

export default function BlogList() {
  const [cat, setCat] = useState('Tutti');

  const categories = useMemo(() => {
    const set = new Set(articles.map(articleCategory));
    return ['Tutti', ...set].sort((a, b) => (a === 'Tutti' ? -1 : a < b ? -1 : 1));
  }, []);

  const filtered = cat === 'Tutti' ? articles : articles.filter((a) => articleCategory(a) === cat);

  return (
    <div className="container section">
      <Seo
        title="Blog di psicologia"
        description="Articoli di psicologia scritti dai nostri professionisti: ansia, depressione, coppia, sport, concorsi pubblici. Guide pratiche e approfondimenti."
        path="/blog"
      />
      <h1>Blog di Adatto x Te</h1>
      <p className="muted">
        Articoli di psicologia scritti dai nostri professionisti: guide, approfondimenti e consigli pratici
        su ansia, coppia, lavoro, sport e benessere. {totalArticles} articoli disponibili.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '16px 0' }}>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            style={{
              border: cat === c ? '2px solid #4f46e5' : '1px solid #e5e7eb',
              background: cat === c ? '#eef2ff' : '#fff',
              borderRadius: 999,
              padding: '7px 14px',
              cursor: 'pointer',
              fontSize: 14,
              color: 'inherit',
            }}
          >
            {c}
            {c !== 'Tutti' && ` (${articles.filter((a) => articleCategory(a) === c).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 && <p className="muted">Nessun articolo in questa categoria.</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {filtered.map((a) => (
          <Link key={a.slug} to={`/blog/${a.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div
              className="card"
              style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 18 }}
            >
              <div className="muted small" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                {articleCategory(a)} · {formatDate(a.date)}
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
