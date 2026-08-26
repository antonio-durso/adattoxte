import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { articles, totalArticles } from '../content/articles';
import Seo from '../components/Seo';
import { useI18n } from '../i18n';

function formatDate(iso, lang) {
  try {
    return new Date(iso).toLocaleDateString(lang === 'it' ? 'it-IT' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return iso;
  }
}

// Traduzione nomi categorie (IT -> EN)
const CAT_EN = {
  Ansia: 'Anxiety',
  Depressione: 'Depression',
  Coppia: 'Couples',
  Sport: 'Sport',
  Concorsi: 'Exams',
  Lavoro: 'Work',
  Sonno: 'Sleep',
  Famiglia: 'Family',
  Fobie: 'Phobias',
  Altro: 'Other',
};

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
  const { lang } = useI18n();
  const [cat, setCat] = useState('Tutti');
  const L =
    lang === 'it'
      ? {
          title: 'Blog di Adatto x Te',
          seoTitle: 'Blog di psicologia',
          seoDesc: 'Articoli di psicologia scritti dai nostri professionisti: ansia, depressione, coppia, sport, concorsi pubblici. Guide pratiche e approfondimenti.',
          desc: 'Articoli di psicologia scritti dai nostri professionisti: guide, approfondimenti e consigli pratici su ansia, coppia, lavoro, sport e benessere.',
          all: 'Tutti',
          empty: 'Nessun articolo in questa categoria.',
          readMore: "Leggi l'articolo",
        }
      : {
          title: 'Adatto x Te Blog',
          seoTitle: 'Psychology Blog',
          seoDesc: 'Psychology articles written by our professionals: anxiety, depression, couples, sport, public exams. Practical guides and in-depth insights.',
          desc: 'Psychology articles written by our professionals: guides, insights and practical advice on anxiety, couples, work, sport and wellbeing.',
          all: 'All',
          empty: 'No articles in this category.',
          readMore: 'Read the article',
        };
  const catLabel = (c) => (lang === 'it' ? c : c === 'Tutti' ? L.all : CAT_EN[c] || c);

  const categories = useMemo(() => {
    const set = new Set(articles.map(articleCategory));
    return ['Tutti', ...set].sort((a, b) => (a === 'Tutti' ? -1 : a < b ? -1 : 1));
  }, []);

  const filtered = cat === 'Tutti' ? articles : articles.filter((a) => articleCategory(a) === cat);

  return (
    <div className="container section">
      <Seo
        title={L.seoTitle}
        description={L.seoDesc}
        path="/blog"
      />
      <h1>{L.title}</h1>
      <p className="muted">
        {L.desc} {totalArticles} {lang === 'it' ? 'articoli disponibili.' : 'articles available.'}
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
            {catLabel(c)}
            {c !== 'Tutti' && ` (${articles.filter((a) => articleCategory(a) === c).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 && <p className="muted">{L.empty}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {filtered.map((a) => (
          <Link key={a.slug} to={`/blog/${a.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div
              className="card"
              style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 18 }}
            >
              <div className="muted small" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                {catLabel(articleCategory(a))} · {formatDate(a.date, lang)}
              </div>
              <h2 style={{ margin: 0, lineHeight: 1.3, fontSize: '1.15rem' }}>{a.title}</h2>
              <p className="muted small" style={{ flex: 1 }}>
                {a.metaDescription}
              </p>
              <span className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start' }}>
                {L.readMore}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
