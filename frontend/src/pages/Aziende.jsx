import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import Reveal from '../components/Reveal';
import ContactForm from '../components/ContactForm';

/**
 * Pagina /aziende — benessere psicologico per i dipendenti (B2B).
 * Pacchetti 10/25/50 sedute, reporting HR anonimo, contatto diretto.
 */

const PACKAGES = [
  {
    n: '10',
    title: 'Pacchetto Starter',
    desc: 'Per piccoli team o per un primo progetto pilota: percorsi individuali su misura per i tuoi dipendenti.',
    cta: 'Richiedi un preventivo',
  },
  {
    n: '25',
    title: 'Pacchetto Growth',
    featured: true,
    desc: 'Il più scelto: copertura continua per il tuo team con reportistica aggregata e anonima per l\u2019HR.',
    cta: 'Richiedi un preventivo',
  },
  {
    n: '50',
    title: 'Pacchetto Enterprise',
    desc: 'Per aziende strutturate: percorsi dedicati, priorit\u00e0 di slot e gestione personalizzata.',
    cta: 'Richiedi un preventivo',
  },
];

const BENEFITS = [
  ['🤫', 'Riservatezza totale', 'Il nome del dipendente non viene mai condiviso con l\u2019azienda: il catalogo è anonimo e i dati sanitari restano tra paziente e terapeuta.'],
  ['📊', 'Reporting HR anonimo', 'Solo dati aggregati e anonimi: adesioni, livello di partecipazione e benessere percepito, senza mai individuare la singola persona.'],
  ['💻', 'Zero infrastruttura', 'Sedute in videochiamata sicura, prenotabili online: nessuno spazio, nessun appuntamento da gestire, copertura in tutta Italia.'],
  ['⏰', 'Orari flessibili', 'Sedute anche la sera e nel weekend, adatte a chi lavora: meno assenze e più benessere.'],
];

const FAQS = [
  ['I dipendenti possono usare i pacchetti in totale anonimato?', 'Sì: la piattaforma è progettata per la riservatezza. Il catalogo dei terapeuti è anonimo (il nome del professionista si svela solo dopo la prenotazione) e l\u2019azienda riceve solo report aggregati e anonimi, senza mai vedere i nomi o i dati di salute dei dipendenti.'],
  ['Come funziona il pagamento per le aziende?', 'Emettiamo un preventivo su misura in base al numero di sedute (pacchetti da 10, 25 o 50). Il pagamento è fatturabile alla società e le sedute vengono accreditate ai dipendenti.'],
  ['Che costi ci sono?', 'Le sedute individuali partono da 45€; per volumi più alti (25-50 sedute) applichiamo condizioni dedicate. Contattaci per un preventivo personalizzato.'],
  ['Da dove si svolgono le sedute?', 'Interamente online, in videochiamata sicura (Jitsi Meet): il dipendente si collega da casa o dall\u2019ufficio, in tutta Italia, senza spostamenti.'],
];

export default function Aziende() {
  return (
    <>
      <Seo
        title="Psicologia online per le aziende"
        description="Supporto psicologico per i dipendenti con totale riservatezza: pacchetti da 10, 25 o 50 sedute, reporting HR anonimo, sedute online da 45€."
        path="/aziende"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: FAQS.map(([q, a]) => ({
            '@type': 'Question',
            name: q,
            acceptedAnswer: { '@type': 'Answer', text: a },
          })),
        }}
      />
      <div className="container section">
        <p className="muted small" style={{ marginBottom: 4 }}>
          <Link to="/">Home</Link> · Per le aziende
        </p>
        <h1>Benessere psicologico per il tuo team</h1>
        <p className="section-sub" style={{ maxWidth: 640 }}>
          Percorsi individuali di supporto psicologico per i tuoi dipendenti, con totale riservatezza
          rispetto all'azienda e reporting aggregato e anonimo. Sedute online, in tutta Italia.
        </p>
        <div className="row-gap" style={{ margin: '18px 0' }}>
          <a href="#contatti-b2b" className="btn btn-primary btn-lg">
            Richiedi un preventivo
          </a>
          <span className="muted">A partire da 45€ a seduta · Fatturazione alla società</span>
        </div>
      </div>

      <section className="container section">
        <Reveal>
          <h2>Perché Adatto x Te per la tua azienda</h2>
          <div className="grid cards">
            {BENEFITS.map(([icon, title, desc]) => (
              <Reveal key={title}>
                <div className="card">
                  <div className="card-icon">{icon}</div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="container section">
        <Reveal>
          <h2>I nostri pacchetti</h2>
          <div className="grid pricing">
            {PACKAGES.map((p) => (
              <Reveal key={p.n}>
                <div className={`card pricing-card${p.featured ? ' featured' : ''}`}>
                  <h3>{p.title}</h3>
                  <div className="price">{p.n} sedute</div>
                  <p>{p.desc}</p>
                  <a href="#contatti-b2b" className="btn btn-primary">
                    {p.cta}
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="container section">
        <Reveal>
          <h2>Domande frequenti</h2>
          <div className="faq-list">
            {FAQS.map(([q, a], i) => (
              <details key={i} className="faq-item">
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Form contatti B2B: riusa il modulo contatti della piattaforma */}
      <section className="container section" id="contatti-b2b" style={{ paddingBottom: 8 }}>
        <Reveal>
          <h2 style={{ textAlign: 'center' }}>Richiedi un preventivo</h2>
          <p className="section-sub" style={{ maxWidth: 560, textAlign: 'center', margin: '0 auto 18px' }}>
            Scrivici: ti rispondiamo di persona con una proposta su misura per la tua azienda.
          </p>
        </Reveal>
        <ContactForm />
      </section>
    </>
  );
}
