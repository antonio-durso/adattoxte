import { Link, useParams } from 'react-router-dom';
import Seo from '../components/Seo';
import Reveal from '../components/Reveal';
import { paesi } from '../content/paesi';

const BASE = 'https://www.adattoxte.com';

export default function PaeseLanding() {
  const { paese: paeseSlug, capitale: capitaleSlug } = useParams();
  const paese = paesi.find((p) => p.slug === paeseSlug);
  if (!paese) {
    return (
      <div className="container section" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h1>Pagina non trovata</h1>
        <p className="muted">Questa destinazione non è disponibile. <Link to="/italiani-all-estero">Torna alla pagina Italiani all'estero →</Link></p>
      </div>
    );
  }
  const capitale = capitaleSlug ? paese.capitale : null;
  const isCapitale = !!(capitale && capitale.slug === capitaleSlug);
  const eff = isCapitale ? capitale : paese;

  // Elenco città principali per il paese (campo opzionale `citta` in paesi.js).
  // Alimenta la sezione "da ogni città" e la FAQ dedicata (solo vista paese, non capitale).
  const elenca = (arr) => (arr.length > 1 ? `${arr.slice(0, -1).join(', ')} e ${arr[arr.length - 1]}` : arr[0] || '');
  const cittaPrincipali = (paese.citta || []).slice(0, 6);
  const cittaAltre = (paese.citta || []).slice(6);

  const nome = isCapitale ? eff.nome : paese.nome;
  const titolo = isCapitale
    ? `Psicologo online per italiani a ${nome}`
    : `Psicologo online per italiani in ${nome}`;
  const desc = isCapitale
    ? `Psicologo online per italiani a ${nome} (${paese.nome}): sedute in videochiamata in italiano, ${paese.fuso}. Prima seduta gratuita, sedute da 45€.`
    : `Psicologo online per italiani in ${nome}: sedute in videochiamata in italiano, ${paese.fuso}. Prima seduta gratuita, sedute da 45€, terapeuti qualificati.`;
  const path = isCapitale ? `/italiani-all-estero/${paese.slug}/${capitale.slug}` : `/italiani-all-estero/${paese.slug}`;

  const faqs = [
    {
      q: `La terapia online funziona dall'${paese.nome}?`,
      a: `Sì: la videochiamata si apre nel browser e funziona ovunque. I fusi orari non sono un problema (${paese.fuso}): scegli tu lo slot più comodo.`,
    },
    {
      q: `Posso seguire le sedute in italiano da ${isCapitale ? nome : paese.nome}?`,
      a: 'Certamente: tutte le sedute si svolgono in italiano con psicologi e psicoterapeuti qualificati, per mantenere il legame con la tua lingua e la tua cultura.',
    },
    {
      q: 'Come gestisco i pagamenti dall\'estero?',
      a: 'I pagamenti avvengono online in modo sicuro, senza abbonamenti: paghi solo la seduta che prenoti.',
    },
    {
      q: 'Quanto costa una seduta?',
      a: '45€ la seduta individuale (50 minuti), 50€ quella di coppia, prima seduta conoscitiva gratuita e pacchetto 3 sedute con il 15% di sconto.',
    },
    ...(!isCapitale && cittaPrincipali.length > 0
      ? [
          {
            q: `Fate sedute con italiani che vivono a ${elenca(cittaPrincipali.slice(0, 4))}${
              cittaAltre.length > 0 ? ` o in centri come ${elenca(cittaAltre.slice(0, 4))}` : ''
            }?`,
            a: `Sì: la videochiamata raggiunge ogni città del ${paese.nome}. Scegli tu l'orario (${paese.fuso}) e la prima seduta conoscitiva è gratuita: il servizio funziona esattamente come se fossi in Italia.`,
          },
        ]
      : []),
  ];

  return (
    <>
      <Seo
        title={titolo}
        description={desc}
        path={path}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: isCapitale ? `Psicologo online per italiani a ${nome}` : `Psicologo online per italiani in ${paese.nome}`,
            serviceType: 'Psicologia online',
            provider: { '@id': `${BASE}/#organization` },
            areaServed: isCapitale ? nome : paese.nome,
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
            mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/` },
              { '@type': 'ListItem', position: 2, name: 'Italiani all\'estero', item: `${BASE}/italiani-all-estero` },
              { '@type': 'ListItem', position: 3, name: isCapitale ? `${paese.nome} — ${nome}` : paese.nome, item: `${BASE}${path}` },
            ],
          },
        ]}
      />

      <section className="hero" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div className="container" style={{ maxWidth: 780 }}>
          <p className="badge" style={{ display: 'inline-block', background: 'var(--secondary, #eef2ff)', color: 'var(--primary, #4f46e5)', padding: '6px 14px', borderRadius: 999, fontSize: 13, fontWeight: 600 }}>
            {paese.bandiera} {isCapitale ? `Italiani a ${nome}` : `Italiani in ${paese.nome}`}
          </p>
          <h1>{isCapitale ? `Psicologo online per italiani a ${nome}` : `Psicologo online per italiani in ${paese.nome}`}</h1>
          <p className="lead">
            {paese.comunita}. Sedute in videochiamata in italiano da qualsiasi città del {paese.nome}, {paese.fuso}. Prima seduta conoscitiva gratuita, sedute da 45€.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 20 }}>
            <Link to="/terapeuti" className="btn btn-primary">Scegli il tuo terapeuta</Link>
            <Link to="/registrazione" className="btn btn-outline">Inizia gratis</Link>
          </div>
        </div>
      </section>

      <section className="container section">
        <h2 style={{ textAlign: 'center' }}>Perché uno psicologo online per chi vive {isCapitale ? `a ${nome}` : `in ${paese.nome}`}</h2>
        <div className="cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginTop: 24 }}>
          <Reveal delay={0}><div className="card" style={{ height: '100%' }}><div className="card-icon">🗣️</div><h3>In italiano</h3><p>Sedute nella tua lingua con professionisti che conoscono il contesto culturale italiano.</p></div></Reveal>
          <Reveal delay={90}><div className="card" style={{ height: '100%' }}><div className="card-icon">🕒</div><h3>Fusi orari gestiti</h3><p>{paese.fuso}: prenoti quando vuoi, anche sera e weekend, e sposti le sedute se cambi città.</p></div></Reveal>
          <Reveal delay={180}><div className="card" style={{ height: '100%' }}><div className="card-icon">🌍</div><h3>Continuità totale</h3><p>Il tuo percorso ti segue in ogni spostamento: trasferte, rientri, nuovi progetti.</p></div></Reveal>
        </div>
      </section>

      <section className="container section section-deep">
        <h2 style={{ textAlign: 'center' }}>Come funziona</h2>
        <div className="cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginTop: 24 }}>
          {['Registrati in 2 minuti', 'Scegli il terapeuta e prenota', 'Collegati in videochiamata'].map((s, i) => (
            <Reveal key={s} delay={i * 90}>
              <div className="card" style={{ height: '100%' }}>
                <div className="card-icon" style={{ fontSize: 26, fontWeight: 800 }}>{i + 1}</div>
                <h3>{s}</h3>
                <p>{i === 0 ? 'Bastano email e password.' : i === 1 ? 'Confronta i profili e scegli l\'orario più comodo.' : 'La seduta si apre nel browser, da qualsiasi dispositivo.'}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Sezione città (solo vista paese): testo ricco con i nomi delle città per intercettare
          le ricerche "psicologo italiano online [città]" — dati dal campo `citta` in paesi.js */}
      {!isCapitale && cittaPrincipali.length > 0 && (
        <section className="container section section-deep">
          <h2 style={{ textAlign: 'center' }}>La terapia in italiano, da qualsiasi città in {paese.nome}</h2>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <p>
              Che tu sia a {elenca(cittaPrincipali)}
              {cittaAltre.length > 0 ? `, o in un centro più piccolo come ${elenca(cittaAltre)}` : ''}:
              le sedute si svolgono in videochiamata in italiano, senza spostamenti e nello stesso fuso
              orario dell'Italia ({paese.fuso}).
            </p>
            <p>
              La prima seduta conoscitiva è gratuita, le sedute da 50 minuti costano 45€ e, se ti sposti
              per lavoro o per un trasferimento tra città del {paese.nome},
              il tuo percorso ti segue senza interruzioni.
            </p>
          </div>
        </section>
      )}

      <section className="container section section-deep">
        <h2 style={{ textAlign: 'center' }}>Domande frequenti</h2>
        <div style={{ maxWidth: 720, margin: '24px auto 0' }}>
          {faqs.map((f) => (
            <div key={f.q} className="card" style={{ marginBottom: 12 }}>
              <h3 style={{ margin: '0 0 6px', fontSize: 16 }}>{f.q}</h3>
              <p className="muted" style={{ margin: 0 }}>{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cross-link SEO: paesi della stessa area (maglia interna verso le altre destinazioni) */}
      <section className="container section section-deep">
        <h2 style={{ textAlign: 'center' }}>{isCapitale ? `Altre destinazioni vicine per chi vive a ${nome}` : `Altre destinazioni per italiani nella stessa area`}</h2>
        <p style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 18px' }}>
          {(() => {
            const vicini = paesi.filter((p) => p.slug !== paese.slug && p.regione === paese.regione);
            const altri = vicini.length > 0 ? vicini : paesi.filter((p) => p.slug !== paese.slug).slice(0, 6);
            return altri.map((p, i, arr) => (
              <span key={p.slug}>
                <Link to={`/italiani-all-estero/${p.slug}`} style={{ fontWeight: 600 }}>{p.nome}</Link>
                {i < arr.length - 1 ? ' · ' : ''}
              </span>
            ));
          })()}
        </p>
        <p style={{ textAlign: 'center' }}>
          <Link to="/italiani-all-estero">Tutte le destinazioni per italiani all'estero →</Link>
        </p>
      </section>

      <section className="container section" style={{ textAlign: 'center' }}>
        <h2>Inizia il tuo percorso da {isCapitale ? nome : paese.nome}</h2>
        <p className="muted" style={{ maxWidth: 560, margin: '0 auto 20px' }}>
          {!isCapitale && (
            <>
              Vivi nella capitale?{' '}
              {paese.capitale && (
                <Link to={`/italiani-all-estero/${paese.slug}/${paese.capitale.slug}`}>Scopri le sedute per italiani a {paese.capitale.nome} →</Link>
              )}
            </>
          )}
          {isCapitale && (
            <>
              Altre città? <Link to={`/italiani-all-estero/${paese.slug}`}>Torna alla pagina per italiani in {paese.nome} →</Link>
            </>
          )}
        </p>
        <Link to="/registrazione" className="btn btn-primary">Registrati gratis</Link>
      </section>
    </>
  );
}
