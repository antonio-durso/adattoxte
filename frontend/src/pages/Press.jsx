import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import Reveal from '../components/Reveal';
import Logo from '../components/Logo';
import ContactForm from '../components/ContactForm';

/**
 * Pagina /ufficio-stampa — press room corporate.
 * Logo al posto di foto personali; dati verificabili; interviste a titolo gratuito.
 */
export default function Press() {
  const facts = [
    { value: '45€', label: 'a seduta, prima seduta conoscitiva gratuita' },
    { value: '43', label: 'paesi raggiunti per gli italiani all’estero' },
    { value: '4,3/5', label: 'Trustpilot · 8 recensioni verificate' },
    { value: '5,0/5', label: 'recensioni Google' },
  ];
  return (
    <>
      <Seo
        title="Ufficio Stampa — Adatto x Te"
        description="Materiali e contatti per la stampa: dati verificabili, angoli editoriali e interviste a titolo gratuito con il fondatore di Adatto x Te."
        path="/ufficio-stampa"
        noindex
      />
      <div className="container section" style={{ textAlign: 'center' }}>
        <p className="muted small" style={{ marginBottom: 4 }}>
          <Link to="/">Home</Link> · Ufficio stampa
        </p>
        <div style={{ margin: '18px 0 10px' }}>
          <Logo size="lg" />
        </div>
        <h1>Ufficio Stampa</h1>
        <p className="section-sub" style={{ maxWidth: 680, margin: '0 auto' }}>
          Materiali, dati e riferimenti per giornalisti e media. Adatto x Te è la piattaforma
          italiana di psicologia online che offre sedute in videochiamata a partire da 45€,
          con un servizio dedicato agli italiani all’estero in 43 paesi.
        </p>
        <p className="muted small" style={{ marginTop: 12 }}>
          <p className="muted small" style={{ marginTop: 12 }}>
            Per la stampa: usare il modulo di contatto in fondo alla pagina.
          </p>
        </p>
      </div>

      <section className="container section">
        <Reveal>
          <h2>Numeri chiave</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginTop: 16 }}>
            {facts.map((f) => (
              <div key={f.label} className="card" style={{ textAlign: 'center', padding: 20 }}>
                <div style={{ fontSize: 34, fontWeight: 800, color: 'var(--accent, #E8590C)' }}>{f.value}</div>
                <div className="muted small" style={{ marginTop: 6 }}>{f.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="container section">
        <Reveal>
          <h2>La piattaforma in sintesi</h2>
          <p>
            Adatto x Te collega pazienti e terapeuti qualificati in videochiamata, senza abbonamenti:
            seduta individuale a <strong>45€</strong> (50 minuti), seduta di coppia a <strong>50€</strong>,
            prima seduta individuale <strong>gratuita</strong> (15 minuti conoscitivi) e pacchetto di 3 sedute
            con <strong>-15%</strong>. Le sedute sono disponibili in <strong>italiano e inglese</strong>,
            da qualsiasi dispositivo, in qualsiasi paese.
          </p>
          <p>
            Specializzazioni: ansia e depressione, terapia di coppia, psicologia dello sport, preparazione
            ai concorsi pubblici (incluse le forze dell’ordine), psicologia giuridica (CTU/CTP) e supporto
            per italiani all’estero.
          </p>
        </Reveal>
      </section>

      <section className="container section">
        <Reveal>
          <h2>Angoli per i media</h2>
          <ul>
            <li>
              <strong>Salute mentale degli italiani all’estero</strong>: oltre 5 milioni di italiani vivono
              fuori dall’Italia; la terapia nella propria lingua e la continuità del percorso (anche in caso
              di rientro) sono il cuore del servizio, attivo in 43 paesi.
            </li>
            <li>
              <strong>Innovazione dal Mezzogiorno</strong>: la piattaforma è nata nell’ambito di{' '}
              <Link to="/tibiz">TBIZ – Research &amp; Ideas for Business</Link>, il programma di open innovation
              della Regione Campania (POR Campania FSE).
            </li>
            <li>
              <strong>Accessibilità economica della terapia</strong>: a partire da 45€ a seduta, senza
              abbonamenti, quando il mercato si muove tra 49€ e 60€.
            </li>
          </ul>
        </Reveal>
      </section>

      <section className="container section">
        <Reveal>
          <h2>Interviste</h2>
          <p>
            Il fondatore è disponibile per interviste in <strong>videochiamata o via email</strong>, a titolo
            <strong> completamente gratuito</strong>: nessun compenso, nessun contenuto sponsorizzato.
            Le interviste si svolgono in italiano o in inglese.
          </p>
        </Reveal>
      </section>

      <section className="container section">
        <Reveal>
          <h2>Comunicati stampa</h2>
          <ul>
            <li>
              <strong>28/08/2026 — Lancio di Adatto x Te</strong>: la piattaforma di psicologia online
              debutta sul dominio adattoxte.com con sedute a 45€ e prima seduta conoscitiva gratuita.
            </li>
            <li>
              <strong>31/08/2026 — Recensioni verificate</strong>: la piattaforma raggiunge la valutazione
              Trustpilot 4,3/5 ("Eccellente") e Google 5,0/5, con recensioni da sedute completate.
            </li>
            <li>
              <strong>01/09/2026 — Psicologia online in 43 paesi</strong>: sedute in italiano e inglese
              per gli italiani all'estero, con continuità del percorso anche in caso di rientro.
            </li>
            <li>
              <strong>02/09/2026 — Apertura dell'Ufficio Stampa</strong>: attivata la sala stampa con
              kit media e contatti dedicati per giornalisti e media.
            </li>
          </ul>
          <p className="muted small">
            <p className="muted small">
              Per ricevere i comunicati stampa integrali, usare il modulo di contatto qui sotto.
            </p>
          </p>
        </Reveal>
      </section>

      <section className="container section">
        <Reveal>
          <h2>Kit media</h2>
          <p>
            Il kit media completo (dati, materiali, domande frequenti) è disponibile su richiesta via email.
            Logo e materiali grafici della piattaforma sono utilizzabili citando la fonte.
          </p>
        </Reveal>
      </section>

      <section className="container section" style={{ textAlign: 'center' }}>
        <Reveal>
          <h2>Contatti stampa</h2>
          <p className="muted" style={{ maxWidth: 560, margin: '0 auto 14px' }}>
            Per richieste di interviste, materiali o comunicazioni con la redazione,
            compila il modulo: seleziona "Giornalista", inserisci la tua email e i tuoi dati.
          </p>
          <ContactForm />
          <p className="muted small">
            Sito: <a href="https://www.adattoxte.com">www.adattoxte.com</a> · Social: @adattoxte
          </p>
        </Reveal>
      </section>
    </>
  );
}
