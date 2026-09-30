import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import Seo from '../components/Seo';

// Snippet UFFICIALE del TrustBox Review Collector, copiato parola per parola da
// Trustpilot Business > Condividi e promuovi > Widget per il sito web > Review Collector,
// il 20/09/2026. NON MODIFICARE: è codice di Trustpilot, non nostro.
// Lo script di bootstrap che lo disegna sta in index.html (head).
const REVIEW_COLLECTOR_HTML = `<!-- TrustBox widget - Review Collector --> <div class="trustpilot-widget" data-locale="it-IT" data-template-id="56278e9abfbbba0bdcd568bc" data-businessunit-id="6a8f57971ac50b6b4903b45a" data-style-height="52px" data-style-width="100%" data-token="3c3cc32d-2efe-4cd3-bac1-648bdf8bde1b"> <a href="https://it.trustpilot.com/review/adattoxte.com" target="_blank" rel="noopener">Trustpilot</a> </div> <!-- End TrustBox widget -->`;

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

  // Il bootstrap ufficiale (in index.html) disegna i TrustBox presenti nell'HTML quando la
  // pagina si carica. Navigando dentro il sito con React la pagina non si ricarica, quindi il
  // div del widget verrebbe montato DOPO il passaggio del bootstrap: in quel caso lo
  // inizializziamo con l'API di Trustpilot. Se il widget è già stato disegnato (c'è l'iframe)
  // non facciamo nulla. È l'unica riga che aggiungiamo al loro codice.
  const tpWidgetRef = useRef(null);
  useEffect(() => {
    const el = tpWidgetRef.current && tpWidgetRef.current.querySelector('.trustpilot-widget');
    if (!el || el.querySelector('iframe')) return;
    const tp = typeof window !== 'undefined' ? window.Trustpilot : null;
    if (tp && typeof tp.loadFromElement === 'function') tp.loadFromElement(el);
  }, []);

  const maxDist = data?.distribution?.length ? Math.max(...data.distribution.map((d) => d.count)) : 1;

  return (
    <div className="container section">
      <Seo
        title="Recensioni dei pazienti"
        description="Recensioni dei pazienti sulla piattaforma Adatto x Te: media delle valutazioni, distribuzione delle stelle e opinioni sui nostri psicologi online."
        path="/recensioni"
        // AggregateRating costruito SOLO dai dati reali della piattaforma
        // (api.get('/ratings') → data.avg e data.total), cioè gli stessi numeri
        // mostrati in questa pagina: è il requisito che chiede Google e il motivo
        // per cui il vecchio punteggio Trustpilot era stato rimosso da Home.jsx.
        // Stesso @id dell'organizzazione, così non nasce una seconda entità.
        jsonLd={
          data && data.total > 0 && data.avg
            ? {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                '@id': 'https://www.adattoxte.com/#organization',
                name: 'Adatto x Te',
                url: 'https://www.adattoxte.com/',
                aggregateRating: {
                  '@type': 'AggregateRating',
                  ratingValue: String(Number(data.avg).toFixed(1)),
                  reviewCount: data.total,
                  bestRating: 5,
                  worstRating: 1,
                },
              }
            : undefined
        }
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

      {/* TrustBox Review Collector — RIMESSO il 20/09/2026, snippet ufficiale intatto.
          Storia completa, per non rifare gli stessi passi:
          1) 10/09/2026 — installato il TrustBox con gli attributi copiati dall'account
             Business (commit 0df4332).
          2) 10/09/2026 — Trustpilot scrive "un widget non ufficiale che non è incluso nel
             tuo piano". Rimosso il 19/09/2026 (commit 38d6263).
          3) 20/09/2026 — Trustpilot conferma la rimozione ma rileva un SECONDO elemento
             grafico che rimanda al profilo (il badge nella home e la scheda che stava qui):
             rimossi con il commit af824a1. Nella stessa email però chiariscono che il
             TrustBox ufficiale di Review Collector È ammesso, ed è incluso anche nel piano
             gratuito.
          4) 20/09/2026 — snippet rigenerato dall'account e reinstallato qui sotto, IDENTICO
             all'originale tranne il data-token (che nel frattempo è cambiato: 0649d446... ->
             3c3cc32d...): è la spiegazione più probabile del "widget non riconosciuto".
          REGOLE, da non violare:
          - questo blocco non si modifica: è il codice di Trustpilot, parola per parola;
          - fuori dal TrustBox non si rimettono badge, schede o link al profilo: quelli sì
            che Trustpilot li contesta;
          - se un giorno il widget non si vede, controllare per primo che il data-token sia
            quello attuale dell'account. */}
      <div
        ref={tpWidgetRef}
        style={{ margin: '28px 0' }}
        dangerouslySetInnerHTML={{ __html: REVIEW_COLLECTOR_HTML }}
      />

      <p className="muted">
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
