import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import Seo from '../components/Seo';

function Stars({ score, size = 20 }) {
  return (
    <span style={{ color: '#f59e0b', fontSize: size, letterSpacing: 2 }} aria-label={`${score} stelle su 5`}>
      {'★'.repeat(score)}
      <span style={{ color: '#d1d5db' }}>{'★'.repeat(5 - score)}</span>
    </span>
  );
}

function formatDate(iso) {
  try {
    return new Date(iso + (iso.includes('T') ? '' : 'Z')).toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return iso;
  }
}

export default function Recensioni() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/ratings')
      .then((r) => setData(r.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const maxDist = data?.distribution?.length ? Math.max(...data.distribution.map((d) => d.count)) : 1;

  return (
    <div className="container section">
      <Seo
        title="Recensioni dei pazienti"
        description="Recensioni dei pazienti sulla piattaforma Adatto x Te: media delle valutazioni, distribuzione delle stelle e opinioni sui nostri psicologi online."
        path="/recensioni"
      />

      <h1>Recensioni dei pazienti</h1>
      <p className="muted">
        Ogni valutazione arriva da una seduta completata sulla piattaforma. La tua opinione conta: dopo ogni seduta puoi lasciare la tua.
      </p>

      {/* Recensioni esterne verificate */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, margin: '24px 0' }}>
        {/* Scheda "Trustpilot" RIMOSSA il 20/09/2026: era un elemento grafico che rimanda al
            profilo Trustpilot e porta i visitatori lì. Sul piano attuale l'unico elemento
            Trustpilot ammesso sul sito è il TrustBox ufficiale di Review Collector, quindi
            qui non va rimesso nessun badge né link finché il piano non cambia.
            La scheda Google resta: per Google non esiste una restrizione equivalente. */}
        <a href="https://share.google/U98x9MWWluFoa91xy" target="_blank" rel="noopener noreferrer" className="card" style={{ display: 'block', padding: 20, textDecoration: 'none', color: 'inherit' }}>
          <div style={{ fontSize: 22 }}>📍</div>
          <h3 style={{ margin: '8px 0 4px' }}>Google</h3>
          <p className="muted small" style={{ margin: '6px 0 0' }}>Leggi le recensioni sulla nostra scheda Google →</p>
        </a>
      </div>

      {/* Blocco "Lascia una recensione su Trustpilot" RIMOSSO del tutto il 20/09/2026.
          Storia, per non rifare gli stessi passi:
          1) 10/09/2026 — Trustpilot segnala "un widget non ufficiale che non è incluso nel
             tuo piano". Il widget era scritto a mano e inizializzato con una chiamata
             manuale a window.Trustpilot.loadFromElement, che non fa parte dello snippet
             ufficiale: rimosso il 19/09/2026 (commit 38d6263) insieme allo script di
             bootstrap caricato su tutte le pagine e alle voci nella CSP.
          2) 20/09/2026 — Trustpilot rileva un SECONDO elemento grafico che rimanda al
             profilo: era il badge "Recensioni su Trustpilot" nella striscia della home e
             questa scheda. Ci hanno detto che sul piano attuale qualunque branding o link
             Trustpilot NON è consentito, a meno che non sia il TrustBox ufficiale di
             Review Collector. Quindi via anche il link di testo che era rimasto qui.
          Per riavere un elemento Trustpilot servono un piano che includa i TrustBox e il
          codice generato da Trustpilot Business -> "Condividi e promuovi", incollato senza
          modifiche. Non ricostruirlo a mano e non rimettere link al profilo. */}
      <p className="muted" style={{ marginTop: 28 }}>
        Questa pagina raccoglie le recensioni lasciate dai pazienti sulla piattaforma, dopo una seduta completata.
      </p>

      {loading && <p className="muted">Caricamento…</p>}

      {data && data.total > 0 && (
        <>
          {/* Riepilogo */}
          <div className="card" style={{ padding: 24, marginBottom: 24 }}>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1 }}>{data.avg || '—'}</div>
                <Stars score={Math.round(data.avg || 0)} size={22} />
                <p className="muted small" style={{ margin: '6px 0 0' }}>
                  {data.total} recensioni verificate
                </p>
              </div>
              <div style={{ flex: 1, minWidth: 240 }}>
                {[5, 4, 3, 2, 1].map((s) => {
                  const c = data.distribution.find((d) => d.score === s)?.count || 0;
                  const pct = Math.round((c / maxDist) * 100);
                  return (
                    <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <span style={{ width: 24, fontWeight: 700 }}>{s}★</span>
                      <div style={{ flex: 1, background: '#f1f5f9', borderRadius: 999, height: 10, overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, background: '#f59e0b', height: '100%', borderRadius: 999 }} />
                      </div>
                      <span className="muted small" style={{ width: 40, textAlign: 'right' }}>{c}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Breakdown per terapeuta */}
          {data.therapists.length > 0 && (
            <>
              <h2>I nostri professionisti valutati</h2>
              <div className="grid cards" style={{ marginBottom: 24 }}>
                {data.therapists.map((t) => (
                  <div className="card" key={t.id} style={{ padding: 16 }}>
                    <div className="avatar">P</div>
                    <h3 style={{ margin: '10px 0 4px', fontSize: 17 }}>{t.label}</h3>
                    <p className="muted small" style={{ margin: 0 }}>
                      ★ {t.avg} · {t.count} recensioni
                    </p>
                    <Link to="/terapeuti" className="btn btn-outline btn-sm" style={{ marginTop: 12 }}>
                      Prenota una seduta
                    </Link>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Elenco recensioni */}
          <h2>Ultime recensioni</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {data.ratings.map((r) => (
              <div className="card" key={r.id} style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                  <Stars score={r.score} />
                  <span className="muted small">{r.therapistLabel} · {formatDate(r.createdAt)}</span>
                </div>
                {r.comment && <p style={{ marginTop: 8 }}>{r.comment}</p>}
                <p className="muted small" style={{ marginTop: 4 }}>— paziente verificato</p>
              </div>
            ))}
          </div>
        </>
      )}

      {!loading && data && data.total === 0 && (
        <p className="muted">Non ci sono ancora recensioni. Sii il primo a lasciarne una dopo la tua seduta!</p>
      )}

      {/* Slot pronti per widget esterni (Trustpilot / Google Business) — si attivano
          quando i profili esterni esisteranno. Nessun contenuto finto. */}
      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <p className="muted">Vuoi vivere questa esperienza?</p>
        <Link to="/terapeuti" className="btn btn-primary btn-lg">
          Trova il tuo terapeuta
        </Link>
      </div>
    </div>
  );
}
