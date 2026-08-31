import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import Reveal from '../components/Reveal';

/**
 * Pagina /equipe — l'équipe clinica di Adatto x Te.
 * Nessun nome di terapeuta: la piattaforma è anonima fino alla prenotazione.
 * Direzione clinica: Dott. Antonio D'Urso.
 * Struttura ispirata alle piattaforme nazionali/internazionali di psicologia online.
 */
const AREAS = [
  { icon: '🧠', title: 'Ansia e stress', text: 'Gestione di ansia, attacchi di panico, stress lavorativo e iperattivazione: percorsi brevi e mirati con tecniche evidence-based.' },
  { icon: '💙', title: 'Depressione e umore', text: 'Sostegno nei momenti di difficoltà emotiva, calo dell\u2019umore e perdita di motivazione, con un accompagnamento strutturato.' },
  { icon: '💑', title: 'Terapia di coppia', text: 'Conflitti, comunicazione, crisi e riorganizzazione della relazione: percorsi per la coppia con sedute dedicate.' },
  { icon: '🏃', title: 'Psicologia dello sport', text: 'Prestazione, gestione della pressione, infortuni e ritorno alla competizione per atleti e sportivi di ogni livello.' },
  { icon: '📚', title: 'Preparazione ai concorsi', text: 'Gestione dell\u2019ansia da esame e da concorso, metodo di studio e performance: un supporto specifico per chi si prepara a prove selettive.' },
  { icon: '⚖️', title: 'Psicologia giuridica', text: 'Sostegno in ambito legale e forense: separazioni, affidamenti e percorsi di valutazione, con la massima riservatezza.' },
];

const VALUES = [
  { icon: '🛡️', title: 'Selezione rigorosa', text: 'Ogni professionista dell\u2019équipe è iscritto all\u2019Albo degli Psicologi, con esperienza documentata e formazione continua.' },
  { icon: '🎓', title: 'Supervisione clinica', text: 'La direzione clinica coordina e supervisiona l\u2019équipe, garantendo qualità e coerenza dei percorsi.' },
  { icon: '🔒', title: 'Riservatezza totale', text: 'Dati sanitari protetti ai sensi del GDPR (art. 9): sedute in videochiamata sicura e messaggi protetti tra le sedute.' },
  { icon: '💻', title: 'Online, ovunque', text: 'Sedute da casa, senza spostamenti: la stessa qualità di uno studio, in videochiamata sicura direttamente dal browser.' },
];

export default function Equipe() {
  return (
    <>
      <Seo
        title="L'équipe clinica di Adatto x Te | Direzione: Dott. Antonio D'Urso"
        description="Un'équipe di psicologi e psicoterapeuti specializzati in ansia, depressione, terapia di coppia, psicologia dello sport e concorsi. Direzione clinica: Dott. Antonio D'Urso, psicologo iscritto all'Albo. Prima seduta gratuita."
        path="/equipe"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Antonio D\'Urso',
            jobTitle: 'Psicologo, Direzione clinica di Adatto x Te',
            worksFor: { '@type': 'Organization', name: 'Adatto x Te', url: 'https://www.adattoxte.com/' },
            description: 'Psicologo iscritto all\'Albo degli Psicologi, fondatore e direttore clinico della piattaforma di psicologia online Adatto x Te.',
          },
        ]}
      />
      <div className="container section">
        <p className="muted small" style={{ marginBottom: 4 }}>
          <Link to="/">Home</Link> · Équipe clinica
        </p>
        <h1 style={{ textAlign: 'center' }}>L'équipe clinica di Adatto x Te</h1>
        <p className="section-sub" style={{ maxWidth: 700, textAlign: 'center', margin: '0 auto' }}>
          Dietro Adatto x Te c'è un'équipe di psicologi e psicoterapeuti specializzati,
          coordinata dalla direzione clinica. Per la massima riservatezza, i professionisti
          restano anonimi fino alla prenotazione: scegli l'area di cui hai bisogno e il
          percorso viene costruito su misura per te.
        </p>
      </div>

      <section className="container section">
        <Reveal>
          <div className="card" style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center', padding: '26px 24px' }}>
            <div style={{ fontSize: 44, marginBottom: 8 }}>🧑‍⚕️</div>
            <h2 style={{ margin: '0 0 6px' }}>Direzione clinica</h2>
            <p style={{ fontSize: 19, fontWeight: 700, margin: '0 0 10px', color: 'var(--primary, #4f46e5)' }}>
              Dott. Antonio D'Urso
            </p>
            <p style={{ fontSize: 14, fontWeight: 600, margin: '0 0 10px' }}>
              Psicologo · iscritto all'Albo degli Psicologi
            </p>
            <p className="muted" style={{ maxWidth: 560, margin: '0 auto' }}>
              Fondatore di Adatto x Te e direttore clinico della piattaforma: coordina
              l'équipe, ne segue la selezione e la supervisione, e garantisce che ogni
              percorso sia condotto secondo le migliori prassi professionali e
              deontologiche.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="container section">
        <Reveal>
          <h2>Aree di intervento dell'équipe</h2>
          <p className="section-sub">Specializzazioni coperte dall'équipe clinica di Adatto x Te.</p>
        </Reveal>
        <div className="grid cards" style={{ marginTop: 16 }}>
          {AREAS.map((a) => (
            <Reveal key={a.title} delay={60}>
              <div className="card" style={{ height: '100%' }}>
                <div style={{ fontSize: 30 }}>{a.icon}</div>
                <h3 style={{ margin: '8px 0 6px' }}>{a.title}</h3>
                <p className="muted" style={{ margin: 0, fontSize: 14.5 }}>{a.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container section">
        <Reveal>
          <h2>Come lavora l'équipe</h2>
        </Reveal>
        <div className="grid cards" style={{ marginTop: 16 }}>
          {VALUES.map((v) => (
            <Reveal key={v.title} delay={60}>
              <div className="card" style={{ height: '100%' }}>
                <div style={{ fontSize: 30 }}>{v.icon}</div>
                <h3 style={{ margin: '8px 0 6px' }}>{v.title}</h3>
                <p className="muted" style={{ margin: 0, fontSize: 14.5 }}>{v.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container section" style={{ textAlign: 'center', paddingTop: 0 }}>
        <Reveal>
          <h2>Inizia oggi, in modo semplice</h2>
          <p className="section-sub">
            Prima seduta individuale gratuita (15 minuti conoscitivi) · poi 45€ a seduta
            individuale, 50€ di coppia, pacchetto 3 sedute con il 15% di sconto.
          </p>
          <Link to="/registrazione" className="btn btn-primary btn-lg">
            Inizia il tuo percorso
          </Link>
          <span className="muted" style={{ display: 'block', marginTop: 10 }}>
            Nessuna tessera · nessun impegno · videochiamata sicura
          </span>
        </Reveal>
      </section>
    </>
  );
}
