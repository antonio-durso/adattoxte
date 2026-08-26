import { Link, useParams } from 'react-router-dom';
import Seo from '../components/Seo';
import Reveal from '../components/Reveal';
import { disturbi } from '../content/disturbi';
import { citta } from '../content/citta';

/**
 * Pagina dinamica "psicologo online + disturbo" e "psicologo online + città".
 * Una sola rotta (/psicologo-online/:slug) che risolve lo slug nei due archivi.
 * Template disturbo: sintomi, consiglio, FAQ. Template città: servizio a domicilio.
 */

function FaqBlock({ faqs }) {
  return (
    <section className="container section">
      <Reveal>
        <h2>Domande frequenti</h2>
        <div className="faq-list">
          {faqs.map(([q, a], i) => (
            <details key={i} className="faq-item">
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function DisturboView({ d }) {
  const related = disturbi.filter((x) => x.slug !== d.slug).slice(0, 6);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: d.faq.map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
  return (
    <>
      <Seo
        title={d.keyword.charAt(0).toUpperCase() + d.keyword.slice(1)}
        description={`${d.nome}: sintomi, quando chiedere aiuto e come funziona la terapia online con uno psicologo qualificato. Sedute da 45€, videochiamata sicura.`}
        path={`/psicologo-online/${d.slug}`}
        jsonLd={jsonLd}
      />
      <div className="container section">
        <p className="muted small" style={{ marginBottom: 4 }}>
          <Link to="/">Home</Link> · <Link to="/terapeuti">Terapeuti</Link> · Psicologo online {d.nome}
        </p>
        <h1>Psicologo online per {d.nome}</h1>
        <p className="section-sub" style={{ maxWidth: 640 }}>{d.intro}</p>
        <div className="row-gap" style={{ margin: '18px 0' }}>
          <Link to="/terapeuti" className="btn btn-primary btn-lg">Trova il tuo terapeuta</Link>
          <span className="muted">Sedute da 45€ · Videochiamata sicura · Orari flessibili</span>
        </div>
      </div>

      <section className="container section">
        <Reveal>
          <h2>Segnali da non ignorare</h2>
          <ul className="check-list">
            {d.sintomi.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="container section">
        <Reveal>
          <div className="card" style={{ padding: 20 }}>
            <h2 style={{ marginTop: 0 }}>Come può aiutarti un percorso online</h2>
            <p>{d.consiglio}</p>
            <Link to="/terapeuti" className="btn btn-primary">Prenota una prima seduta</Link>
          </div>
        </Reveal>
      </section>

      <FaqBlock faqs={d.faq} />

      <section className="container section">
        <Reveal>
          <h3>Potrebbe interessarti anche</h3>
          <div className="chip-row">
            {related.map((r) => (
              <Link key={r.slug} to={`/psicologo-online/${r.slug}`} className="chip">
                {r.nome}
              </Link>
            ))}
          </div>
        </Reveal>
      </section>
    </>
  );
}

function CittaView({ c }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: `Come funziona lo psicologo online a ${c.nome}?`, acceptedAnswer: { '@type': 'Answer', text: `Le sedute si svolgono in videochiamata: prenoti giorno e ora, paghi online (45€) e ti colleghi da casa o da dove preferisci, anche se vivi a ${c.nome} o in provincia.` } },
      { '@type': 'Question', name: `Devo recarmi in uno studio a ${c.nome}?`, acceptedAnswer: { '@type': 'Answer', text: 'No: il servizio è completamente online, in tutta Italia. La terapia online ha la stessa efficacia di quella in presenza ed è più comoda da conciliare con lavoro e famiglia.' } },
      { '@type': 'Question', name: `Quanto costa una seduta a ${c.nome}?`, acceptedAnswer: { '@type': 'Answer', text: 'La seduta individuale costa 45€, quella di coppia 50€. Pagamento sicuro online con carta di credito.' } },
    ],
  };
  const altre = citta.filter((x) => x.slug !== c.slug && x.regione === c.regione).slice(0, 5);
  const principali = citta.filter((x) => ['milano', 'roma', 'torino', 'napoli', 'bologna', 'firenze'].includes(x.slug) && x.slug !== c.slug);
  return (
    <>
      <Seo
        title={`Psicologo online a ${c.nome}`}
        description={`Psicologo online a ${c.nome} e in tutta Italia: sedute in videochiamata da 45€, terapeuti qualificati, orari flessibili. Prenota in 2 minuti.`}
        path={`/psicologo-online/${c.slug}`}
        jsonLd={jsonLd}
      />
      <div className="container section">
        <p className="muted small" style={{ marginBottom: 4 }}>
          <Link to="/">Home</Link> · <Link to="/terapeuti">Terapeuti</Link> · Psicologo online {c.nome}
        </p>
        <h1>Psicologo online a {c.nome}</h1>
        <p className="section-sub" style={{ maxWidth: 640 }}>
          Hai bisogno di uno psicologo a {c.nome} ma non vuoi spostarti, aspettare o incastrare gli orari di uno studio?
          Con Adatto x Te le sedute si svolgono in videochiamata, in tutta Italia (provincia di {c.provincia} inclusa).
        </p>
        <div className="row-gap" style={{ margin: '18px 0' }}>
          <Link to="/terapeuti" className="btn btn-primary btn-lg">Trova il tuo terapeuta</Link>
          <span className="muted">Sedute da 45€ · Videochiamata sicura · Sera e weekend</span>
        </div>
      </div>

      <section className="container section">
        <Reveal>
          <h2>Perché scegliere la terapia online a {c.nome}</h2>
          <ul className="check-list">
            <li><strong>Zero spostamenti:</strong> niente traffico o parcheggi, ti colleghi da casa, dall\'ufficio o da dove sei</li>
            <li><strong>Terapeuti qualificati:</strong> professionisti iscritti all\'albo, selezionati e verificati</li>
            <li><strong>Prezzi trasparenti:</strong> 45€ la seduta individuale, 50€ quella di coppia, pagamento sicuro online</li>
            <li><strong>Orari flessibili:</strong> sedute anche la sera e nel weekend, adatte a chi lavora</li>
            <li><strong>Stessa efficacia:</strong> la terapia online è efficace quanto quella in presenza per ansia, depressione e molti altri disturbi</li>
          </ul>
        </Reveal>
      </section>

      <section className="container section">
        <Reveal>
          <div className="card" style={{ padding: 20 }}>
            <h2 style={{ marginTop: 0 }}>Come funziona</h2>
            <p>1. Scegli il terapeuta e l\'orario · 2. Paga online in modo sicuro · 3. Ti colleghi alla videochiamata al momento della seduta.</p>
            <Link to="/terapeuti" className="btn btn-primary">Inizia ora</Link>
          </div>
        </Reveal>
      </section>

      <FaqBlock faqs={[
        ['Le sedute si svolgono davvero online?', `Sì: tutto avviene in videochiamata sicura. Puoi fare terapia a ${c.nome} senza recarti in studio, con la stessa qualità di quella in presenza.`],
        ['Posso scegliere lo psicologo che preferisco?', `Sì: la piattaforma ti mostra i profili dei terapeuti (specializzazioni, recensioni, lingue) e prenoti direttamente l\'orario che vuoi.`],
        ['Come funziona il pagamento?', `Il pagamento avviene online con carta di credito, in modo sicuro: 45€ la seduta individuale, 50€ quella di coppia.`],
      ]} />

      <section className="container section">
        <Reveal>
          <h3>{c.regione === 'Lombardia' || c.regione === 'Piemonte' ? 'Altre città vicine' : `Altre città in ${c.regione}`}</h3>
          <div className="chip-row">
            {[...altre, ...principali].slice(0, 8).map((x) => (
              <Link key={x.slug} to={`/psicologo-online/${x.slug}`} className="chip">{x.nome}</Link>
            ))}
          </div>
        </Reveal>
      </section>
    </>
  );
}

export default function DisturboLanding() {
  const { slug } = useParams();
  const d = disturbi.find((x) => x.slug === slug);
  if (d) return <DisturboView d={d} />;
  const c = citta.find((x) => x.slug === slug);
  if (c) return <CittaView c={c} />;
  return (
    <div className="container section">
      <h1>Pagina non trovata</h1>
      <p className="muted">La pagina che cerchi non esiste.</p>
      <Link to="/terapeuti" className="btn btn-primary">Vai ai terapeuti</Link>
    </div>
  );
}
