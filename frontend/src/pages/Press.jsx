import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import Reveal from '../components/Reveal';
import Logo from '../components/Logo';

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
          Contatto stampa: <a href="mailto:ant.durso1@gmail.com">ant.durso1@gmail.com</a>
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
          <p>
            <a href="mailto:ant.durso1@gmail.com" className="btn">ant.durso1@gmail.com</a>
          </p>
          <p className="muted small">
            Sito: <a href="https://www.adattoxte.com">www.adattoxte.com</a> · Social: @adattoxte
          </p>
        </Reveal>
      </section>
    </>
  );
}
