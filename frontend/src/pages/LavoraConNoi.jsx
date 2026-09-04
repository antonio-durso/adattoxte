import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import InlineMessageForm from '../components/InlineMessageForm';
import { paesi } from '../content/paesi';

/**
 * Pagina /lavora-con-noi — reclutamento psicologi/psicoterapeuti.
 * La piattaforma è italiana ma raggiunge italiani in 43 paesi: cerchiamo
 * colleghi ovunque siamo presenti, con i requisiti verificati per paese.
 * Nessuna persona finta e nessun riferimento personale: solo fatti e trasparenza.
 */

const PERCHE = [
  {
    icon: '🖥️',
    title: 'Piattaforma già pronta',
    text: 'Prenotazioni, pagamenti, area paziente, videochiamate e documentazione GDPR: non devi costruire nulla, inizi a lavorare subito.',
  },
  {
    icon: '🌍',
    title: '43 paesi da cui arrivano pazienti',
    text: 'La piattaforma è indicizzata in tutta Europa e nel mondo: ogni paese in cui siamo presenti è un mercato in cui cercare colleghi.',
  },
  {
    icon: '📈',
    title: 'Visibilità SEO già costruita',
    text: 'Decine di pagine indicizzate su disturbi, città e paesi: chi cerca uno psicologo online trova la piattaforma — e trova te.',
  },
  {
    icon: '🗓️',
    title: 'Autonomia e orari tuoi',
    text: 'Costruisci il tuo calendario, scegli i tuoi orari e i tuoi percorsi, in videochiamata da qualsiasi luogo.',
  },
];

const PROFILI = [
  {
    titolo: 'Psicologi iscritti all\u2019Albo italiano',
    testo: 'Possono seguire pazienti italiani ovunque nel mondo. È la base della piattaforma: richiesta l\u2019iscrizione all\u2019Albo degli Psicologi in Italia.',
  },
  {
    titolo: 'Professionisti iscritti nel proprio paese',
    testo: 'Per i pazienti che vivono all\u2019estero cerchiamo anche psicologi e psicoterapeuti regolarmente iscritti nel paese di residenza (es. Svizzera, Regno Unito, Germania). I titoli vengono verificati con te al momento della candidatura, paese per paese.',
  },
];

const REQUISITI = [
  'Laurea magistrale in Psicologia (o titolo equipollente) e iscrizione all\u2019Albo nel paese di residenza',
  'Specializzazione in Psicoterapia (o in corso) per percorsi clinici; percorsi di sostegno e benessere anche senza specializzazione',
  'Esperienza di almeno 2-3 anni in setting clinico o di sostegno',
  'Ottima padronanza dell\u2019italiano (madrelingua o equivalente)',
  'Attrezzatura minima: connessione stabile, ambiente riservato e rispetto della privacy delle sedute',
];

const FAQS = [
  [
    'Chi cercate?',
    'Psicologi e psicoterapeuti iscritti nel loro paese di residenza, italofoni, motivati a lavorare online con italiani in Italia e all\u2019estero.',
  ],
  [
    'Che modello economico proponete?',
    'Trasparente e da concordare insieme: lavoriamo in regime di libera professione, con un accordo chiaro su tariffe e condizioni prima di iniziare.',
  ],
  [
    'Devo avere un sito o un mio studio?',
    'No: la piattaforma mette a disposizione tutto (prenotazioni, pagamenti, videochiamate, privacy). Tu porti la professionalità, noi l\u2019infrastruttura e i pazienti.',
  ],
  [
    'Vivo all\u2019estero ma sono iscritto all\u2019Albo italiano: posso candidarmi?',
    'Sì: verifichiamo insieme quali pazienti puoi seguire dal tuo paese in base ai requisiti locali. La trasparenza sui titoli è parte del nostro metodo.',
  ],
];

export default function LavoraConNoi() {
  return (
    <>
      <Seo
        path="/lavora-con-noi"
        title="Lavora con noi | Entra nell'équipe di Adatto x Te"
        description="Psicologi e psicoterapeuti in Italia e all'estero: entra nell'équipe di Adatto x Te. Piattaforma pronta, 43 paesi raggiunti, autonomia piena. Candidati ora."
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
        <p style={{ color: '#286a8f', fontWeight: 700, marginBottom: 4 }}>
          Entra nell'équipe in crescita
        </p>
        <h1 style={{ marginTop: 0 }}>Lavora con noi</h1>
        <p style={{ maxWidth: 760 }}>
          Adatto x Te è una piattaforma di psicologia online che raggiunge italiani in 43 paesi, dalla
          Svizzera agli Stati Uniti. Cerchiamo colleghi psicologi e psicoterapeuti — in Italia e
          all'estero — che vogliano unirsi a un progetto concreto, con un'infrastruttura già pronta e
          una domanda reale da seguire.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 16, margin: '28px 0' }}>
          {PERCHE.map((p) => (
            <div key={p.title} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '18px 16px' }}>
              <div style={{ fontSize: 26 }}>{p.icon}</div>
              <h3 style={{ fontSize: 16, margin: '10px 0 6px' }}>{p.title}</h3>
              <p className="muted small" style={{ margin: 0 }}>{p.text}</p>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 22 }}>Chi cerchiamo</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, margin: '12px 0 8px' }}>
          {PROFILI.map((p) => (
            <div key={p.titolo} style={{ background: '#f0f7fb', border: '1px solid #cfe6f2', borderRadius: 12, padding: '16px 18px' }}>
              <h3 style={{ fontSize: 15.5, margin: '0 0 6px' }}>{p.titolo}</h3>
              <p className="muted small" style={{ margin: 0 }}>{p.testo}</p>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 22, marginTop: 28 }}>Cerchiamo colleghi in tutti i paesi dove siamo presenti</h2>
        <p style={{ maxWidth: 760 }} className="muted small">
          Clicca sul tuo paese per aprire la pagina dedicata alla comunità italiana locale e candidarti
          con il profilo giusto per quello mercato.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10, margin: '14px 0 8px' }}>
          {paesi.map((p) => (
            <Link
              key={p.slug}
              to={`/italiani-all-estero/${p.slug}`}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 10, background: '#fff', textDecoration: 'none', color: 'inherit' }}
            >
              <span style={{ fontSize: 20 }}>{p.bandiera}</span>
              <span>
                <span style={{ fontWeight: 600, display: 'block', fontSize: 14 }}>{p.nome}</span>
                <span className="muted small">italiani in {p.nome}</span>
              </span>
            </Link>
          ))}
        </div>
        <p style={{ maxWidth: 760 }} className="muted small">
          {`Candidarsi per ${paesi.length} mercati non costa nulla in più: una sola candidatura, e valutiamo insieme dove puoi operare in base ai tuoi titoli e alla tua residenza.`}
        </p>

        <h2 style={{ fontSize: 22 }}>Requisiti generali</h2>
        <ul style={{ lineHeight: 1.7, maxWidth: 760 }}>
          {REQUISITI.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>

        <h2 style={{ fontSize: 22 }}>Come candidarsi</h2>
        <p style={{ maxWidth: 720 }} className="muted small">
          Lascia nome, email e due righe su di te (paese di residenza, albo di appartenenza, esperienza):
          ti rispondiamo personalmente entro pochi giorni per un primo colloquio conoscitivo, senza impegno.
        </p>
        <div style={{ maxWidth: 640, margin: '6px 0 8px' }}>
          <InlineMessageForm
            alwaysOpen
            role="psicologo"
            subject="Candidatura — Lavora con noi"
            placeholder="Paese di residenza, albo di appartenenza, specializzazione ed esperienza (due righe bastano)"
          />
        </div>
        <p style={{ maxWidth: 720 }} className="muted small">
          Vuoi prima conoscere come lavoriamo? Dai un'occhiata alla pagina{' '}
          <Link to="/equipe" style={{ color: '#286a8f', fontWeight: 600 }}>Équipe clinica</Link>{' '}
          e alla{' '}
          <Link to="/struttura" style={{ color: '#286a8f', fontWeight: 600 }}>struttura della piattaforma</Link>.
        </p>

        <div style={{ background: '#f0f7fb', border: '1px solid #cfe6f2', borderRadius: 12, padding: '18px 20px', marginTop: 24, maxWidth: 760 }}>
          <h3 style={{ fontSize: 16, margin: '0 0 6px' }}>Domande frequenti</h3>
          {FAQS.map(([q, a]) => (
            <details key={q} style={{ marginTop: 10 }}>
              <summary style={{ fontWeight: 600, cursor: 'pointer' }}>{q}</summary>
              <p className="muted" style={{ margin: '8px 0 0' }}>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </>
  );
}
