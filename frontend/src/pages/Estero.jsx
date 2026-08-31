import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import Reveal from '../components/Reveal';
import { paesi } from '../content/paesi';

const WHY = [
  { icon: '🗣️', title: 'La tua lingua, la tua cultura', desc: 'Sedute in italiano con professionisti che conoscono il contesto culturale italiano: certe emozioni si esprimono meglio nella propria lingua.' },
  { icon: '🕒', title: 'Orari che rispettano il tuo fuso', desc: 'Scegli slot flessibili, anche sera e weekend. Se cambi paese, sposti le sedute con un semplice avviso.' },
  { icon: '🌍', title: 'Continuità ovunque', desc: 'Trasferte, rientri, nuovi progetti: il tuo percorso ti segue in ogni angolo del mondo, senza interruzioni.' },
];

const STEPS = [
  { n: '1', title: 'Registrati', desc: 'Crea il tuo account in 2 minuti: bastano email e una password.' },
  { n: '2', title: 'Scegli il terapeuta', desc: 'Confronta i profili dei professionisti e prenota l\'orario più comodo per te.' },
  { n: '3', title: 'Collegati in videochiamata', desc: 'La seduta si apre nel browser, da qualsiasi dispositivo e da qualsiasi paese.' },
];

const FAQS = [
  { q: 'La terapia online funziona dall\'estero?', a: 'Sì: la videochiamata si apre nel browser e funziona ovunque nel mondo, basta una connessione stabile. Tutte le sedute si svolgono in italiano.' },
  { q: 'I terapeuti sono in Italia o all\'estero?', a: 'Sono professionisti qualificati e iscritti all\'albo, attivi sulla piattaforma da tutta Italia: online scegli chi preferisci, indipendentemente dal fuso orario.' },
  { q: 'Come gestiamo i fusi orari?', a: 'Gli orari sono flessibili: scegli lo slot più comodo, anche di sera o nel weekend. Al cambio di fuso sposti le sedute con un semplice avviso.' },
  { q: 'I pagamenti funzionano dall\'estero?', a: 'Sì: i pagamenti avvengono online in modo sicuro e non ci sono abbonamenti — paghi solo la seduta che prenoti.' },
];

export default function Estero() {
  return (
    <>
      <Seo
        title="Psicologo online per italiani all'estero | Adatto x Te"
        description="Psicologo online per italiani all'estero: sedute in videochiamata in italiano, da qualsiasi paese. Prima seduta gratuita, sedute da 45€, terapeuti qualificati."
        path="/italiani-all-estero"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            '@id': 'https://www.adattoxte.com/#servizio-estero',
            name: 'Psicologo online per italiani all\'estero',
            serviceType: 'Psicologia online',
            provider: { '@id': 'https://www.adattoxte.com/#organization' },
            areaServed: 'Worldwide',
            inLanguage: 'it',
            offers: {
              '@type': 'AggregateOffer',
              lowPrice: '38.25',
              highPrice: '50',
              priceCurrency: 'EUR',
              offers: [
                { '@type': 'Offer', name: 'Seduta individuale 50 minuti', price: '45', priceCurrency: 'EUR' },
                { '@type': 'Offer', name: 'Terapia di coppia 50 minuti', price: '50', priceCurrency: 'EUR' },
                { '@type': 'Offer', name: 'Prima seduta conoscitiva', price: '0', priceCurrency: 'EUR' },
              ],
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.adattoxte.com/' },
              { '@type': 'ListItem', position: 2, name: 'Italiani all\'estero', item: 'https://www.adattoxte.com/italiani-all-estero' },
            ],
          },
        ]}
      />

      <section className="hero" style={{ textAlign: 'center', padding: '64px 20px' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <p className="badge" style={{ display: 'inline-block', background: 'var(--secondary, #eef2ff)', color: 'var(--primary, #4f46e5)', padding: '6px 14px', borderRadius: 999, fontSize: 13, fontWeight: 600 }}>
            🌍 Vivi all'estero? La tua terapia resta in italiano
          </p>
          <h1>Psicologo online per italiani all'estero</h1>
          <p className="lead">
            Sedute in videochiamata in italiano, da qualsiasi paese. Terapeuti qualificati, prima seduta conoscitiva gratuita, sedute da 45€.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 20 }}>
            <Link to="/terapeuti" className="btn btn-primary">Scegli il tuo terapeuta</Link>
            <Link to="/registrazione" className="btn btn-outline">Inizia gratis</Link>
          </div>
        </div>
      </section>

      <section className="container section">
        <h2 style={{ textAlign: 'center' }}>Perché uno psicologo online per chi vive fuori dall'Italia</h2>
        <div className="cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginTop: 24 }}>
          {WHY.map((w, i) => (
            <Reveal key={w.title} delay={i * 90}>
              <div className="card" style={{ height: '100%' }}>
                <div className="card-icon">{w.icon}</div>
                <h3>{w.title}</h3>
                <p>{w.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container section section-deep">
        <h2 style={{ textAlign: 'center' }}>Come funziona</h2>
        <div className="cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginTop: 24 }}>
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 90}>
              <div className="card" style={{ height: '100%' }}>
                <div className="card-icon" style={{ fontSize: 26, fontWeight: 800 }}>{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container section">
        <h2 style={{ textAlign: 'center' }}>Quanto costa</h2>
        <div className="cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginTop: 24 }}>
          <Reveal delay={0}><div className="card" style={{ height: '100%' }}><div className="card-icon">🎁</div><h3>Prima seduta</h3><p><strong>Gratuita</strong> — 15 minuti conoscitivi con il terapeuta.</p></div></Reveal>
          <Reveal delay={90}><div className="card" style={{ height: '100%' }}><div className="card-icon">🪑</div><h3>Seduta individuale</h3><p><strong>45€</strong> per 50 minuti, in videochiamata.</p></div></Reveal>
          <Reveal delay={180}><div className="card" style={{ height: '100%' }}><div className="card-icon">💑</div><h3>Terapia di coppia</h3><p><strong>50€</strong> per 50 minuti, anche da paesi diversi.</p></div></Reveal>
          <Reveal delay={270}><div className="card" style={{ height: '100%' }}><div className="card-icon">📦</div><h3>Pacchetto 3 sedute</h3><p><strong>38,25€/seduta</strong> con il 15% di sconto.</p></div></Reveal>
        </div>
      </section>

      <section className="container section section-deep">
        <h2 style={{ textAlign: 'center' }}>Domande frequenti</h2>
        <div style={{ maxWidth: 720, margin: '24px auto 0' }}>
          {FAQS.map((f) => (
            <div key={f.q} className="card" style={{ marginBottom: 12 }}>
              <h3 style={{ margin: '0 0 6px', fontSize: 16 }}>{f.q}</h3>
              <p className="muted" style={{ margin: 0 }}>{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container section">
        <h2 style={{ textAlign: 'center' }}>I paesi coperti</h2>
        <p className="muted" style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 20px' }}>
          Una pagina dedicata per ogni paese e per la sua capitale: scegli la tua destinazione.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {paesi.map((p) => (
            <Link
              key={p.slug}
              to={`/italiani-all-estero/${p.slug}`}
              className="card"
              style={{ display: 'block', padding: 14, textDecoration: 'none', color: 'inherit' }}
            >
              <h3 style={{ margin: 0, fontSize: 15 }}>
                {p.bandiera} Italiani in {p.nome}
              </h3>
              <p className="muted small" style={{ margin: '4px 0 0' }}>
                <Link to={`/italiani-all-estero/${p.slug}/${p.capitale.slug}`} style={{ textDecoration: 'underline' }} onClick={(e) => e.stopPropagation()}>
                  {p.capitale.nome} →
                </Link>
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container section" style={{ textAlign: 'center' }}>
        <h2>Inizia il tuo percorso, ovunque tu sia</h2>
        <p className="muted" style={{ maxWidth: 560, margin: '0 auto 20px' }}>
          Approfondisci su <Link to="/blog/psicologo-online-all-estero">come funziona la psicologia online dall'estero</Link> o sulle <Link to="/blog/psicologo-online-in-inglese">sedute in inglese</Link>.
        </p>
        <Link to="/registrazione" className="btn btn-primary">Registrati gratis</Link>
      </section>
    </>
  );
}
