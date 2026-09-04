import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import InlineMessageForm from '../components/InlineMessageForm';

/**
 * Pagina /struttura — la "struttura" che fa funzionare la piattaforma,
 * in stile team delle piattaforme internazionali: ogni ruolo ha un compito
 * strutturato. Scelta onesta: nessun volto inventato e nessun dipendente
 * finto — ogni area è presidiata ogni giorno (alcune con partner e fornitori).
 */

const RUOLI = [
  {
    avatar: '🧑‍💼',
    colore: '#e8f0fe',
    ruolo: 'Direzione della piattaforma',
    dipartimento: 'Strategia e crescita',
    compiti: ['Scelte strategiche e obiettivi', 'Evoluzione del servizio e della qualità', 'Relazioni con i partner'],
  },
  {
    avatar: '🧑‍⚕️',
    colore: '#e6f7ef',
    ruolo: 'Coordinamento clinico',
    dipartimento: 'Qualità clinica',
    compiti: ['Supervisione dei percorsi', 'Qualità dell\u2019accoglienza e della presa in carico', 'Continuità delle cure tra colleghi'],
  },
  {
    avatar: '🧑‍🏫',
    colore: '#fff4e0',
    ruolo: 'Selezione e formazione',
    dipartimento: 'Risorse umane',
    compiti: ['Reclutamento di psicologi qualificati', 'Verifica di titoli e iscrizioni per paese', 'Formazione continua e supervisione di gruppo'],
  },
  {
    avatar: '🧑‍💻',
    colore: '#edf0f7',
    ruolo: 'Sviluppo della piattaforma',
    dipartimento: 'Tecnologia',
    compiti: ['Sito, area paziente e prenotazioni', 'Videochiamate e infrastruttura', 'Aggiornamenti, test e monitoraggio'],
  },
  {
    avatar: '🧑‍🎨',
    colore: '#fdeef4',
    ruolo: 'Design ed esperienza utente',
    dipartimento: 'Tecnologia',
    compiti: ['Interfacce semplici e accessibili', 'Percorsi di prenotazione chiari', 'Coerenza grafica su 43 paesi'],
  },
  {
    avatar: '🧑‍🔧',
    colore: '#f0f7fb',
    ruolo: 'Privacy e protezione dei dati',
    dipartimento: 'Compliance',
    compiti: ['Gestione del consenso informato', 'Sicurezza delle informazioni sanitarie', 'Diritti GDPR: export e cancellazione dati'],
  },
  {
    avatar: '🧑‍🤝‍🧑',
    colore: '#fef3e2',
    ruolo: 'Assistenza ai pazienti',
    dipartimento: 'Cura del cliente',
    compiti: ['Risposte su percorsi e tariffe', 'Supporto tecnico alle videochiamate', 'Gestione di emergenze e rinvii'],
  },
  {
    avatar: '🧑‍💳',
    colore: '#eefaf0',
    ruolo: 'Pagamenti e fatturazione',
    dipartimento: 'Amministrazione',
    compiti: ['Checkout sicuro e multi-valuta', 'Ricevute e gestione amministrativa', 'Conciliazione pagamenti-sedute'],
  },
  {
    avatar: '✍️',
    colore: '#fdf0f5',
    ruolo: 'Contenuti e comunicazione',
    dipartimento: 'Marketing',
    compiti: ['Articoli e guide del blog', 'Risorse per chi cerca aiuto', 'Newsletter e canali social'],
  },
  {
    avatar: '📈',
    colore: '#f3f0fd',
    ruolo: 'SEO e visibilità',
    dipartimento: 'Marketing',
    compiti: ['Pagine disturbi, città e paesi', 'Monitoraggio Google Search Console', 'Nuove opportunità di ricerca ogni mese'],
  },
  {
    avatar: '🌍',
    colore: '#e7f4fd',
    ruolo: 'Comunità italiana all\u2019estero',
    dipartimento: 'Marketing',
    compiti: ['Ascolto delle esigenze degli expat', 'Contenuti per Svizzera, Regno Unito e oltre', 'Rapporti con associazioni e comunità'],
  },
  {
    avatar: '🧾',
    colore: '#f6f2ea',
    ruolo: 'Amministrazione',
    dipartimento: 'Amministrazione',
    compiti: ['Contabilità e adempimenti', 'Gestione dei fornitori', 'Burocrazia in ordine, ogni mese'],
  },
];

export default function Struttura() {
  return (
    <>
      <Seo
        path="/struttura"
        title="La struttura di Adatto x Te | Chi c'è dietro la piattaforma"
        description="Ogni ruolo ha un compito: scopri la struttura che fa funzionare Adatto x Te, dalla privacy all'assistenza, dalla tecnologia ai contenuti. Vuoi entrare nel team? Lavora con noi."
      />
      <div className="container section">
        <p style={{ color: '#286a8f', fontWeight: 700, marginBottom: 4 }}>Dietro la piattaforma</p>
        <h1 style={{ marginTop: 0 }}>La struttura di Adatto x Te</h1>
        <p style={{ maxWidth: 760 }}>
          Una piattaforma di psicologia online non è solo un sito: è un insieme di ruoli che ogni
          giorno devono funzionare — tecnologia, privacy, assistenza, contenuti, qualità clinica.
          Ecco chi fa cosa. Ogni ruolo è presidiato ogni giorno; per alcune attività la piattaforma
          si appoggia a partner e fornitori specializzati, con standard verificati.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 14, margin: '26px 0' }}>
          {RUOLI.map((r) => (
            <div key={r.ruolo} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '16px', textAlign: 'center' }}>
              <div style={{ width: 58, height: 58, borderRadius: '50%', background: r.colore, border: '1px solid rgba(0,0,0,0.06)', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>
                {r.avatar}
              </div>
              <div style={{ fontWeight: 800, fontSize: 15, lineHeight: 1.25 }}>{r.ruolo}</div>
              <div className="muted small" style={{ marginBottom: 8 }}>{r.dipartimento}</div>
              <ul style={{ margin: 0, paddingLeft: 16, fontSize: 13.5, lineHeight: 1.55, textAlign: 'left' }}>
                {r.compiti.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              <div style={{ marginTop: 10, borderTop: '1px solid #eef2f7', paddingTop: 10 }}>
                <InlineMessageForm
                  subject={`Richiesta per l'ufficio: ${r.ruolo}`}
                  buttonLabel="Scrivi a questo ufficio"
                  placeholder={`Scrivi qui la tua richiesta per l'ufficio ${r.ruolo}…`}
                />
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: '#f0f7fb', border: '1px solid #cfe6f2', borderRadius: 12, padding: '18px 22px', maxWidth: 760 }}>
          <h2 style={{ fontSize: 18, margin: '0 0 6px' }}>La struttura cresce</h2>
          <p style={{ margin: 0 }}>
            Stiamo costruendo un team: psicologi, terapeuti e collaboratori che vogliano unirsi a un
            progetto concreto per gli italiani in Italia e in 43 paesi.{' '}
            <Link to="/lavora-con-noi" style={{ color: '#286a8f', fontWeight: 700 }}>
              Vai alla pagina Lavora con noi →
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
