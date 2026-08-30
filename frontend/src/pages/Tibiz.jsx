import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import Reveal from '../components/Reveal';

/**
 * Pagina /tibiz — il programma TBIZ – Research & Ideas for Business (TechnologyBIZ,
 * Regione Campania) e la selezione di Adatto x Te nella Call for Ideas 2023.
 * Dà credibilità al marchio nel footer e viene indicizzata nella sitemap.
 */
export default function Tibiz() {
  return (
    <>
      <Seo
        title="Adatto x Te e il programma TBIZ – Research & Ideas for Business"
        description="L'idea di Adatto x Te, nata dal Dott. Antonio D'Urso, è stata selezionata nell'ambito della TBIZ Call for Ideas, programma della Regione Campania, con business plan a cura dell'Ing. Francesco Pio Langella (AGILAE srl)."
        path="/tibiz"
      />
      <div className="container section">
        <p className="muted small" style={{ marginBottom: 4 }}>
          <Link to="/">Home</Link> · TBIZ – Research &amp; Ideas for Business
        </p>
        <div style={{ textAlign: 'center', margin: '10px 0 6px' }}>
          <img
            src="/images/tbiz-logo.png"
            alt="TBIZ – Research & Ideas for Business (TechnologyBIZ)"
            style={{ height: 150, width: 'auto', display: 'inline-block' }}
          />
        </div>
        <h1 style={{ textAlign: 'center' }}>Adatto x Te e il programma TBIZ</h1>
        <p className="section-sub" style={{ maxWidth: 680, textAlign: 'center', margin: '0 auto' }}>
          L'idea di Adatto x Te è stata selezionata nell'ambito della TBIZ Call for Ideas,
          programma di open innovation della Regione Campania dedicato alla nascita e
          all'accelerazione di imprese innovative.
        </p>
      </div>

      <section className="container section">
        <Reveal>
          <h2>Cos'è TBIZ – Research &amp; Ideas for Business</h2>
          <p>
            TBIZ (TechnologyBIZ) è un programma della <strong>Regione Campania</strong> promosso
            attraverso la piattaforma di Open Innovation regionale, nell'ambito del POR Campania
            FSE 2014–2020 (Avviso "Misure di rafforzamento dell'ecosistema innovativo della
            Regione Campania", D.D. 329/2019).
          </p>
          <p>
            Attraverso la <strong>TBIZ Call for Ideas</strong>, il programma seleziona idee di
            impresa innovative e le accompagna in un percorso di <strong>business acceleration</strong>:
            laboratori didattici con docenti universitari (gestione d'impresa, implicazioni
            giuridiche delle tecnologie abilitanti, comunicazione aziendale, open innovation),
            attività di mentoring e coaching per perfezionare l'idea di impresa e la redazione
            del business plan.
          </p>
          <p>
            Il progetto è realizzato dall'ATS TBIZ con capofila l'Associazione Oggi Lavoro
            (CUP B89J19000760007).
          </p>
        </Reveal>
      </section>

      <section className="container section">
        <Reveal>
          <h2>La selezione di Adatto x Te</h2>
          <p>
            L'idea di <strong>Adatto x Te</strong> — piattaforma italiana di psicologia online,
            nata da un'idea del <strong>Dott. Antonio D'Urso</strong> — è stata presentata alla
            TBIZ Call for Ideas ed è stata <strong>selezionata</strong> (candidatura accettata
            dal programma nel 2023).
          </p>
          <p>
            Nell'ambito del percorso, il <strong>business plan della startup</strong> è stato
            realizzato dall'<strong>Ing. Francesco Pio Langella</strong>, Business Analyst di
            <strong> AGILAE srl</strong> (Lean Innovation &amp; Strategy Advisory, Napoli),
            con analisi di mercato e della concorrenza, modello di business, fattibilità
            tecnologica, analisi dei rischi e previsioni economico-finanziarie.
          </p>
          <p>
            Oggi Adatto x Te è online con sedute individuali e di coppia, prima seduta gratuita,
            videochiamate sicure e un catalogo di professionisti verificati in tutta Italia.
          </p>
        </Reveal>
      </section>

      <section className="container section">
        <Reveal>
          <h2>Percorso e riconoscimenti</h2>
          <p className="section-sub" style={{ maxWidth: 680 }}>
            Le tappe del percorso di Adatto x Te nell'ambito del programma TBIZ, con riferimenti
            ufficiali al progetto (CUP B89J19000760007, capofila Associazione Oggi Lavoro).
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 720 }}>
            <div style={{ borderLeft: '3px solid #286a8f', paddingLeft: 16 }}>
              <strong>2023 — Selezione alla TBIZ Call for Ideas</strong>
              <p style={{ margin: '4px 0 0', color: 'var(--text-secondary, #475569)' }}>
                La candidatura di Adatto x Te viene accettata dal programma TBIZ (TechnologyBIZ),
                programma di open innovation della Regione Campania, capofila Associazione Oggi Lavoro.
              </p>
            </div>
            <div style={{ borderLeft: '3px solid #286a8f', paddingLeft: 16 }}>
              <strong>Ottobre 2023 — Percorso di business acceleration</strong>
              <p style={{ margin: '4px 0 0', color: 'var(--text-secondary, #475569)' }}>
                Laboratori didattici a Napoli (gestione d'impresa, comunicazione aziendale, open
                innovation) e redazione del business plan della startup.
              </p>
            </div>
            <div style={{ borderLeft: '3px solid #286a8f', paddingLeft: 16 }}>
              <strong>2 ottobre 2023 — Consegna del business plan definitivo</strong>
              <p style={{ margin: '4px 0 0', color: 'var(--text-secondary, #475569)' }}>
                Il business plan di Adatto x Te, realizzato per il percorso TBIZ, copre analisi di
                mercato e della concorrenza, modello di business, fattibilità tecnologica, analisi
                dei rischi e previsioni economico-finanziarie.
              </p>
            </div>
            <div style={{ borderLeft: '3px solid #286a8f', paddingLeft: 16 }}>
              <strong>Dicembre 2023 – gennaio 2024 — Chiusura del percorso</strong>
              <p style={{ margin: '4px 0 0', color: 'var(--text-secondary, #475569)' }}>
                Comunicazioni ufficiali della segreteria organizzativa e rimborso spese di
                partecipazione ai laboratori.
              </p>
            </div>
            <div style={{ borderLeft: '3px solid #9ca3af', paddingLeft: 16, opacity: 0.85 }}>
              <strong>Attestato di partecipazione — in corso di rilascio</strong>
              <p style={{ margin: '4px 0 0', color: 'var(--text-secondary, #475569)' }}>
                Il documento ufficiale di partecipazione sarà pubblicato qui appena disponibile.
              </p>
            </div>
          </div>
          <p className="muted small" style={{ marginTop: 18 }}>
            Documentazione conservata dal titolare e disponibile su richiesta.
          </p>
        </Reveal>
      </section>

      <section className="container section">
        <Reveal>
          <h2>Fonti ufficiali</h2>
          <ul style={{ lineHeight: 2 }}>
            <li>
              <a href="https://openinnovation.regione.campania.it" target="_blank" rel="noopener noreferrer">
                Open Innovation Campania — Regione Campania
              </a>
            </li>
            <li>
              <a href="https://www.campaniacompetitiva.it/tbiz-2019-al-via-la-call-for-ideas/" target="_blank" rel="noopener noreferrer">
                Campania Competitiva — TBIZ, la Call for Ideas
              </a>
            </li>
            <li>
              <a href="https://www.agilae.it" target="_blank" rel="noopener noreferrer">
                AGILAE srl — Lean Innovation &amp; Strategy Advisory
              </a>
            </li>
          </ul>
        </Reveal>
      </section>

      <section className="container section" style={{ textAlign: 'center', paddingTop: 0 }}>
        <Link to="/registrazione" className="btn btn-primary btn-lg">
          Inizia il tuo percorso
        </Link>
        <span className="muted" style={{ display: 'block', marginTop: 10 }}>
          Prima seduta individuale gratuita · 45€ a seduta
        </span>
      </section>
    </>
  );
}
