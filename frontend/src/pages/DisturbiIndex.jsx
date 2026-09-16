import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import Reveal from '../components/Reveal';
import { disturbi } from '../content/disturbi';

/**
 * Pagina indice: elenca tutti i disturbi e le problematiche trattate, con il
 * link alla rispettiva landing. Serve a collegare fra loro le pagine
 * /psicologo-online/<disturbo>, che altrimenti restano raggiungibili solo dalla
 * sitemap: una pagina dichiarata ma senza link interni viene scoperta e
 * rivalutata meno spesso dai motori di ricerca.
 */
export default function DisturbiIndex() {
  const elenco = [...disturbi].sort((a, b) => a.nome.localeCompare(b.nome, 'it'));

  return (
    <>
      <Seo
        title="Disturbi e problematiche trattate"
        description="Elenco completo dei disturbi trattati dai nostri psicologi online: ansia, depressione, attacchi di panico, disturbi alimentari, dipendenze e molti altri."
        path="/disturbi"
      />
      <div className="container section">
        <p className="muted small" style={{ marginBottom: 4 }}>
          <Link to="/">Home</Link> · <Link to="/terapeuti">Terapeuti</Link> · Disturbi trattati
        </p>
        <h1>Disturbi e problematiche trattate</h1>
        <p className="section-sub" style={{ maxWidth: 640 }}>
          Non tutti i disagi hanno lo stesso nome, e non tutti hanno bisogno dello stesso percorso.
          Qui trovi l&apos;elenco completo delle problematiche di cui ci occupiamo: per ognuna c&apos;è
          una pagina con i segnali da riconoscere, come funziona il percorso e le domande più comuni.
        </p>
        <p style={{ maxWidth: 640 }}>
          Se non sai da dove cominciare, non è un problema: la prima seduta è gratuita e serve
          esattamente a capire di cosa hai bisogno, con un professionista iscritto all&apos;albo.
        </p>

        <Reveal>
          <div className="chip-row" style={{ marginTop: 18 }}>
            {elenco.map((d) => (
              <Link key={d.slug} to={`/psicologo-online/${d.slug}`} className="chip">
                {d.nome}
              </Link>
            ))}
          </div>
        </Reveal>

        <div className="row-gap" style={{ margin: '22px 0 0' }}>
          <Link to="/terapeuti" className="btn btn-primary btn-lg">Trova il tuo terapeuta</Link>
          <span className="muted">Prima seduta gratuita · sedute da 45 € in videochiamata</span>
        </div>
      </div>
    </>
  );
}
