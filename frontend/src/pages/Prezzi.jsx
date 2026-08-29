import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import Reveal from '../components/Reveal';

/**
 * Pagina /prezzi — centralizza tutti i prezzi della piattaforma
 * (prima seduta gratuita, individuale 45€, coppia 50€, pacchetto -15%, B2B).
 */

const PRICES = [
  {
    title: 'Prima seduta gratuita',
    price: '0 €',
    desc: '15 minuti conoscitivi senza pagare: la prima seduta individuale è sempre gratuita.',
    featured: false,
    cta: 'Prenota gratis',
    to: '/terapeuti',
  },
  {
    title: 'Seduta individuale',
    price: '45 €',
    desc: '50 minuti di videochiamata sicura con uno psicologo qualificato, dalla comodità di casa tua.',
    featured: true,
    cta: 'Trova il tuo terapeuta',
    to: '/terapeuti',
  },
  {
    title: 'Seduta di coppia',
    price: '50 €',
    desc: '50 minuti per due persone in collegamento: comunicazione, crisi di relazione, decisioni condivise.',
    featured: false,
    cta: 'Trova il tuo terapeuta',
    to: '/terapeuti',
  },
  {
    title: 'Pacchetto 3 sedute',
    price: '114,75 €',
    desc: 'Pacchetto con sconto del 15%: circa 38€ a seduta. Perfetto per iniziare un percorso con continuità.',
    featured: false,
    cta: 'Prenota la prima seduta',
    to: '/terapeuti',
  },
];

const FAQS = [
  ['La prima seduta è davvero gratuita?', 'Sì: la prima seduta individuale è gratuita e dura 15 minuti — un colloquio conoscitivo per capire se il terapeuta fa per te. Se poi vuoi continuare, paghi solo le sedute successive (45€ individuale, 50€ di coppia).'],
  ['Come funziona il pagamento?', 'Il pagamento avviene online, prima della seduta, tramite circuito sicuro (PayPal): puoi pagare con carta di credito o con il tuo account PayPal. I dati della carta non passano mai dai nostri server.'],
  ['Posso cancellare o spostare una seduta?', 'Sì, dalla tua area personale. Le cancellazioni con almeno 24 ore di preavviso vengono rimborsate; oltre tale termine il rimborso è a discrezione del professionista.'],
  ['Dove trovo la ricevuta?', 'Dopo ogni seduta pagata trovi la ricevuta nella tua area personale (pagina Ricevuta), con tutti i dettagli della prenotazione.'],
];

export default function Prezzi() {
  return (
    <>
      <Seo
        title="Prezzi"
        description="Prezzi chiari e senza abbonamenti: prima seduta gratuita, seduta individuale 45€, di coppia 50€, pacchetto 3 sedute con -15%. Pagamento sicuro PayPal."
        path="/prezzi"
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
        <h1>Prezzi semplici, senza sorprese</h1>
        <p className="section-sub" style={{ maxWidth: 620 }}>
          Nessun abbonamento, nessun vincolo: paghi solo quando prenoti. La prima seduta individuale è
          sempre gratuita.
        </p>

        <div className="grid pricing" style={{ marginTop: 22 }}>
          {PRICES.map((p) => (
            <Reveal key={p.title}>
              <div className={`card pricing-card${p.featured ? ' featured' : ''}`}>
                <h3>{p.title}</h3>
                <div className="price">{p.price}</div>
                <p>{p.desc}</p>
                <Link to={p.to} className="btn btn-primary">
                  {p.cta}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="card" style={{ padding: 20, marginTop: 20, background: '#f8fafc' }}>
          <h2 style={{ marginTop: 0 }}>Per le aziende</h2>
          <p className="muted" style={{ margin: '0 0 10px' }}>
            Percorsi individuali di supporto psicologico per i tuoi dipendenti a partire da 45€ a seduta,
            con totale riservatezza rispetto all'azienda e reporting aggregato e anonimo.
          </p>
          <Link to="/aziende" className="btn btn-outline">
            Scopri i pacchetti aziendali →
          </Link>
        </div>

        <section style={{ marginTop: 28 }}>
          <h2>Domande frequenti sui prezzi</h2>
          <div className="faq-list">
            {FAQS.map(([q, a], i) => (
              <details key={i} className="faq-item">
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
