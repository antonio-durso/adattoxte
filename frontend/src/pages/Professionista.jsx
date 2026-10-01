/**
 * Professionista — BLOCCO 3: la scheda pubblica del professionista.
 *
 * Si posiziona sul NOME (nessuna concorrenza → giorni, non anni).
 * Esiste solo se il profilo e' pubblicato: la decisione sta nel backend (blocco 2).
 *
 * Nota sul markup: usiamo `Physician` + `jobTitle` e NON `medicalSpecialty:
 * "Psychiatric"` come fa Serenis — quello e' la specialita' dello psichiatra.
 * schema.org non ha un valore "Psychologist": meglio non dire niente che dire
 * una cosa sbagliata.
 */
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import Seo from '../components/Seo';

const ETICHETTE = { website: 'Sito', google: 'Google', trustpilot: 'Trustpilot', linkedin: 'LinkedIn' };

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

export default function Professionista() {
  const { slug } = useParams();
  const [p, setP] = useState(null);
  const [stato, setStato] = useState('carico');

  useEffect(() => {
    setStato('carico');
    api.get(`/therapists/public/${slug}`)
      .then((r) => { setP(r.data.profile); setStato('ok'); })
      .catch(() => { setP(null); setStato('assente'); });
  }, [slug]);

  const link = (p && p.sameAs) || {};
  const linkPieni = Object.keys(link).filter((k) => link[k]);
  const haRecensioni = !!(p && p.ratingCount > 0);

  useJsonLd(p && stato === 'ok' ? {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name: p.name,
    url: `https://www.adattoxte.com/professionisti/${p.publicSlug}`,
    ...(p.photoUrl ? { image: p.photoUrl } : {}),
    ...(p.license ? { identifier: p.license } : {}),
    ...(p.languages && p.languages.length ? { knowsLanguage: p.languages } : {}),
    ...(p.specialties && p.specialties.length ? { knowsAbout: p.specialties } : {}),
    ...(p.city ? { address: { '@type': 'PostalAddress', addressLocality: p.city, addressCountry: 'IT' } } : {}),
    ...(linkPieni.length ? { sameAs: linkPieni.map((k) => link[k]) } : {}),
    ...(haRecensioni ? {
      aggregateRating: { '@type': 'AggregateRating', ratingValue: p.ratingAvg, reviewCount: p.ratingCount }
    } : {})
  } : null);

  if (stato === 'assente') {
    return (
      <div className="container section">
        <Seo title="Profilo non disponibile" description="Questo profilo non è disponibile."
          path={`/professionisti/${slug}`} noindex />
        <h1>Profilo non disponibile</h1>
        <p className="muted">Questo profilo non esiste oppure non è più pubblicato.</p>
        <Link to="/terapeuti">Vedi i professionisti disponibili</Link>
      </div>
    );
  }

  if (stato === 'carico' || !p) {
    return (
      <div className="container section">
        <Seo title="Profilo" description="Scheda del professionista." path={`/professionisti/${slug}`} noindex />
        <p className="muted">Caricamento…</p>
      </div>
    );
  }

  const citta = p.city ? p.city.charAt(0).toUpperCase() + p.city.slice(1) : '';

  return (
    <div className="container section">
      <Seo
        title={`${p.name} — psicologo online${citta ? ' a ' + citta : ''}`}
        description={(p.bio || '').slice(0, 155)}
        path={`/professionisti/${p.publicSlug}`}
      />

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {p.photoUrl && (
          <img src={p.photoUrl} alt={p.name} width="140" height="140"
            style={{ borderRadius: 12, objectFit: 'cover' }} />
        )}
        <div style={{ flex: 1, minWidth: 260 }}>
          <h1 style={{ marginTop: 0, marginBottom: 4 }}>{p.name}</h1>
          <p className="muted" style={{ marginTop: 0 }}>
            {[p.role === 'therapist' ? 'Psicoterapeuta' : p.role, citta, p.experienceYears ? p.experienceYears + ' anni di esperienza' : '']
              .filter(Boolean).join(' · ')}
          </p>
          {haRecensioni && (
            <p><strong>{p.ratingAvg}</strong> su {p.ratingCount} recensioni</p>
          )}
          {p.license && <p className="muted" style={{ fontSize: 14 }}>Iscrizione all’Albo: {p.license}</p>}
        </div>
      </div>

      {p.bio && (
        <section style={{ marginTop: 28 }}>
          <h2 style={{ fontSize: 20 }}>Chi sono</h2>
          <p>{p.bio}</p>
        </section>
      )}

      {p.specialties && p.specialties.length > 0 && (
        <section style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: 20 }}>Di cosa mi occupo</h2>
          <ul>{p.specialties.map((s) => <li key={s}>{s}</li>)}</ul>
        </section>
      )}

      {p.languages && p.languages.length > 0 && (
        <section style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: 20 }}>Lingue</h2>
          <p>{p.languages.join(', ')}</p>
        </section>
      )}

      {(p.priceIndividual || p.priceCouple) && (
        <section style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: 20 }}>Tariffe</h2>
          <ul>
            {p.priceIndividual ? <li>Seduta individuale: {p.priceIndividual} €</li> : null}
            {p.priceCouple ? <li>Seduta di coppia: {p.priceCouple} €</li> : null}
          </ul>
          {/* Il passaggio diretto: la scheda pubblica porta al calendario DI QUESTO
              professionista, non all'elenco. Altrimenti il paziente deve ritrovarlo. */}
          {/* La scheda porta sempre alla pagina di prenotazione: è lì che si paga. */}
          <Link className="btn btn-primary" to={`/terapeuti/${p.id}`}>Prenota una seduta</Link>
        </section>
      )}

      {linkPieni.length > 0 && (
        <section style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: 20 }}>Dove trovarmi</h2>
          <ul>
            {linkPieni.map((k) => (
              <li key={k}>
                <a href={link[k]} rel="me noopener" target="_blank">{ETICHETTE[k] || k}</a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="muted" style={{ fontSize: 13, marginTop: 32 }}>
        Questa scheda è pubblicata dal professionista. Adatto x Te mette in contatto
        pazienti e psicoterapeuti iscritti all’Albo.
      </p>
    </div>
  );
}
