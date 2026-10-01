/**
 * Incrocio — BLOCCO 4: disturbo x citta, dietro il GATE.
 *
 * La pagina esiste sempre e funziona per chi ci arriva (prenotazione).
 * Ma il `noindex`/`index` NON lo decide questa pagina: lo decide il backend,
 * in base al contenuto reale (professionisti con la citta dichiarata).
 * Sotto soglia: noindex,follow. Sopra: index,follow.
 *
 * Nota tecnica onesta: il meta robots e' impostato lato client. E' meno robusto
 * di un header server-side. La mitigazione pratica e' che queste pagine NON
 * stanno in sitemap e NON sono linkate finche' non superano il gate — quindi
 * Google non ha motivo di trovarle.
 */
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import Seo from '../components/Seo';

function bella(slug) {
  const s = String(slug || '').replace(/-/g, ' ').trim();
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
}

function useJsonLd(dati) {
  useEffect(() => {
    if (!dati) return undefined;
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.text = JSON.stringify(dati);
    document.head.appendChild(s);
    return () => { try { document.head.removeChild(s); } catch (e) { /* niente */ } };
  }, [dati]);
  return null;
}

export default function Incrocio() {
  const { disturbo, citta } = useParams();
  const [d, setD] = useState(null);

  useEffect(() => {
    setD(null);
    api.get(`/therapists/incrocio/${disturbo}/${citta}`)
      .then((r) => setD(r.data))
      .catch(() => setD({ professionisti: [], totale: 0, indicizzabile: false }));
  }, [disturbo, citta]);

  const dNome = bella(disturbo);
  const cNome = bella(citta);
  const lista = (d && d.professionisti) || [];
  const indicizzabile = !!(d && d.indicizzabile);
  const titolo = `Psicologi online per ${dNome.toLowerCase()} a ${cNome}`;

  useJsonLd(indicizzabile && lista.length ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: titolo,
    numberOfItems: lista.length,
    itemListElement: lista.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://www.adattoxte.com/professionisti/${p.publicSlug}`,
      name: p.name
    }))
  } : null);

  return (
    <div className="container section">
      <Seo
        title={`${titolo} | Adatto x Te`}
        description={`Psicologi e psicoterapeuti iscritti all’Albo per ${dNome.toLowerCase()} a ${cNome}. Prima seduta gratuita di 15 minuti, online.`}
        path={`/psicologo-online/${disturbo}/${citta}`}
        noindex={!indicizzabile}
      />

      <h1 style={{ marginTop: 0 }}>{titolo}</h1>
      <p className="muted">
        Professionisti iscritti all’Albo che si occupano di {dNome.toLowerCase()} e seguono
        pazienti a {cNome}. Prima seduta gratuita di 15 minuti, sedute online.
      </p>

      {d === null && <p className="muted">Caricamento…</p>}

      {d !== null && lista.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: 20 }}>{lista.length === 1 ? '1 professionista disponibile' : `${lista.length} professionisti disponibili`}</h2>
          {lista.map((p) => (
            <div key={p.id} className="card" style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                {p.photoUrl && (
                  <img src={p.photoUrl} alt={p.name} width="72" height="72"
                    style={{ borderRadius: 10, objectFit: 'cover' }} />
                )}
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 4px' }}>
                    <Link to={`/professionisti/${p.publicSlug}`}>{p.name}</Link>
                  </h3>
                  <p className="muted" style={{ margin: 0, fontSize: 14 }}>
                    {[p.experienceYears ? p.experienceYears + ' anni di esperienza' : '',
                      p.languages && p.languages.length ? p.languages.join(', ') : ''].filter(Boolean).join(' · ')}
                  </p>
                  {p.specialties && p.specialties.length > 0 && (
                    <p style={{ margin: '6px 0 0', fontSize: 14 }}>{p.specialties.slice(0, 5).join(' · ')}</p>
                  )}
                  {p.priceIndividual ? (
                    <p style={{ margin: '6px 0 0', fontSize: 14 }}><strong>{p.priceIndividual} €</strong> a seduta</p>
                  ) : null}
                  {/* Porta sempre alla pagina di prenotazione */}
                  <p style={{ margin: '10px 0 0' }}>
                    <Link className="btn btn-primary" to={`/terapeuti/${p.id}`}
                      style={{ fontSize: 14, padding: '6px 12px' }}>Prenota con {p.name.split(' ').slice(-1)[0]}</Link>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {d !== null && lista.length === 0 && (
        <div className="card" style={{ marginTop: 24 }}>
          <p style={{ marginTop: 0 }}>
            Al momento non c’è ancora un professionista pubblicato che dichiari
            {' '}{cNome} tra le sue città e si occupi di {dNome.toLowerCase()}.
          </p>
          <p className="muted" style={{ fontSize: 14 }}>
            Puoi comunque vedere tutti i professionisti sulla pagina di{' '}
            <Link to={`/psicologo-online/${disturbo}`}>{dNome.toLowerCase()}</Link>{' '}
            oppure chi lavora online per <Link to={`/psicologo-online/${citta}`}>{cNome}</Link>.
          </p>
          <Link className="btn btn-primary" to="/terapeuti">Vedi tutti i professionisti</Link>
        </div>
      )}

      <p className="muted" style={{ fontSize: 13, marginTop: 32 }}>
        Vedi anche: <Link to={`/psicologo-online/${disturbo}`}>psicologi online per {dNome.toLowerCase()}</Link>
        {' · '}
        <Link to={`/psicologo-online/${citta}`}>psicologi online a {cNome}</Link>
      </p>
    </div>
  );
}
