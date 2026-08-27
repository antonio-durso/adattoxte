import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api';
import { useI18n } from '../i18n';
import Seo from '../components/Seo';

const SPECIALTIES = [
  'psicologia dello sport',
  'preparazione concorsi pubblici',
  'psicologia giuridica',
  'terapia di coppia',
  'ansia e depressione',
];

// Matching guidato: cosa cerca il paziente -> specializzazione
const NEEDS = [
  { label: '😰 Ansia e stress', value: 'ansia e depressione' },
  { label: '💑 Coppia e relazioni', value: 'terapia di coppia' },
  { label: '🏃 Sport e prestazione', value: 'psicologia dello sport' },
  { label: '📚 Concorsi pubblici', value: 'preparazione concorsi pubblici' },
  { label: '⚖️ Psicologia giuridica', value: 'psicologia giuridica' },
];

export default function Therapists() {
  const { t, lang } = useI18n();
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [specialty, setSpecialty] = useState(searchParams.get('specialty') || '');
  const [reload, setReload] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError('');
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (specialty) params.set('specialty', specialty);
    api
      .get(`/therapists?${params.toString()}`)
      .then((r) => setTherapists(r.data.therapists))
      .catch(() => setError(t('common.error')))
      .finally(() => setLoading(false));
  }, [q, specialty, t, reload]);

  return (
    <div className="container section">
      <Seo
        title="Trova il tuo terapeuta"
        description="Trova lo psicologo giusto per te: ansia, depressione, terapia di coppia, psicologia dello sport, preparazione ai concorsi. Sedute online da 45€."
        path="/terapeuti"
      />
      <h1>{t('nav.therapists')}</h1>

      <div style={{ marginBottom: 18 }}>
        <p className="muted small" style={{ marginBottom: 8 }}>
          <strong>Di cosa hai bisogno?</strong> Tocca per trovare subito il professionista giusto:
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {NEEDS.map((n) => (
            <button
              key={n.value}
              onClick={() => {
                const v = specialty === n.value ? '' : n.value;
                setSpecialty(v);
                setSearchParams(v ? { specialty: v } : {}, { replace: true });
              }}
              style={{
                border: specialty === n.value ? '2px solid #4f46e5' : '1px solid #e5e7eb',
                background: specialty === n.value ? '#eef2ff' : '#fff',
                borderRadius: 999,
                padding: '8px 14px',
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              {t('need.' + n.value) || n.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filters">
        <input
          type="search"
          placeholder="Cerca per nome o specializzazione…"
          aria-label="Cerca per nome o specializzazione"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="search-input"
        />
        <select value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="search-input" aria-label="Filtra per specializzazione">
          <option value="">Tutte le specializzazioni</option>
          {SPECIALTIES.map((s) => (
            <option key={s} value={s}>
              {t('specialty.' + s) || s}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="grid cards" aria-busy="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <div className="card therapist-card skeleton" key={i} aria-hidden="true" style={{ minHeight: 357 }}>
              <div className="skeleton-bar" style={{ width: 48, height: 48, borderRadius: '50%', marginBottom: 10 }} />
              <div className="skeleton-bar" style={{ width: '70%', height: 16, marginBottom: 10 }} />
              <div className="skeleton-bar" style={{ width: '45%', height: 12, marginBottom: 12 }} />
              <div className="skeleton-bar" style={{ width: '100%', height: 12, marginBottom: 8 }} />
              <div className="skeleton-bar" style={{ width: '85%', height: 12, marginBottom: 12 }} />
              <div className="skeleton-bar" style={{ width: '40%', height: 12, marginBottom: 12 }} />
              <div className="skeleton-bar" style={{ width: '100%', height: 40, borderRadius: 8 }} />
            </div>
          ))}
        </div>
      )}
      {loading && specialty && (
        <div aria-hidden="true">
          <div style={{ margin: '18px 0 8px' }}>
            <div className="skeleton-bar" style={{ width: '60%', height: 20, marginBottom: 8 }} />
            <div className="skeleton-bar" style={{ width: '90%', height: 12 }} />
          </div>
          <div className="grid cards">
            {Array.from({ length: 3 }).map((_, i) => (
              <div className="card therapist-card skeleton" key={i} style={{ minHeight: 379 }}>
                <div className="skeleton-bar" style={{ width: 90, height: 22, marginBottom: 10 }} />
                <div className="skeleton-bar" style={{ width: 48, height: 48, borderRadius: '50%', marginBottom: 10 }} />
                <div className="skeleton-bar" style={{ width: '70%', height: 16, marginBottom: 10 }} />
                <div className="skeleton-bar" style={{ width: '100%', height: 12, marginBottom: 8 }} />
                <div className="skeleton-bar" style={{ width: '85%', height: 12, marginBottom: 12 }} />
                <div className="skeleton-bar" style={{ width: '100%', height: 40, borderRadius: 8 }} />
              </div>
            ))}
          </div>
        </div>
      )}
      {error && (
        <>
          <p className="error-text">{error}</p>
          <button className="btn btn-outline btn-sm" onClick={() => setReload((n) => n + 1)}>
            Riprova
          </button>
        </>
      )}
      {!loading && !error && therapists.length === 0 && <p className="muted">Nessun terapeuta trovato.</p>}

      {!loading && !error && therapists.length > 0 && specialty && (
        <div style={{ margin: '18px 0 8px' }}>
          <h2 style={{ margin: 0 }}>✅ Ti consigliamo questi professionisti</h2>
          <p className="muted">Abbiamo selezionato per te {therapists.length} profili in «{t('specialty.' + specialty) || specialty}». I primi 3 sono i nostri consigliati.</p>
        </div>
      )}

      {!loading && !error && therapists.length > 0 && specialty && (
        <div className="grid cards">
          {therapists.slice(0, 3).map((th) => (
            <Link to={`/terapeuti/${th.id}`} className="card therapist-card" key={th.id}
              style={{ border: '2px solid #4f46e5', boxShadow: '0 10px 24px rgba(79,70,229,.18)' }}>
              <span className="badge" style={{ background: '#4f46e5', color: '#fff', alignSelf: 'flex-start' }}>⭐ Consigliato</span>
              <div className="avatar">P</div>
              <h2 style={{ margin: 0 }}>{t('catalog.psychologist')}{th.specialties && th.specialties[0] ? ` · ${t('specialty.' + th.specialties[0]) || th.specialties[0]}` : ''}</h2>
              <div className="tags">
                {th.specialties.map((s) => (
                  <span className="tag" key={s}>
                    {t('specialty.' + s) || s}
                  </span>
                ))}
              </div>
              <p className="card-bio">{th.bio}</p>
              {th.ratingCount > 0 && (
                <div className="tags">
                  <span className="tag ok" style={{ fontWeight: 700 }}>★ {th.ratingAvg} ({th.ratingCount} recensioni)</span>
                </div>
              )}
              <div className="card-meta">
                <span>{lang === 'it' ? 'da' : 'from'} {th.priceIndividual} €/seduta</span>
                <span>{th.experienceYears} anni di esperienza</span>
              </div>
              <span className="btn btn-primary btn-block">{t('common.book')}</span>
            </Link>
          ))}
        </div>
      )}

      {!loading && !error && specialty && therapists.length > 3 && (
        <h2 style={{ margin: '26px 0 10px' }}>Altri professionisti disponibili</h2>
      )}

      <div className="grid cards">
        {(specialty ? therapists.slice(3) : therapists).map((th) => (
          <Link to={`/terapeuti/${th.id}`} className="card therapist-card" key={th.id}>
            <div className="avatar">P</div>
            <h2 style={{ margin: 0 }}>{t('catalog.psychologist')}{th.specialties && th.specialties[0] ? ` · ${t('specialty.' + th.specialties[0]) || th.specialties[0]}` : ''}</h2>
            <div className="tags">
              {th.specialties.map((s) => (
                <span className="tag" key={s}>
                  {s}
                </span>
              ))}
            </div>
            <p className="card-bio">{th.bio}</p>
            {th.ratingCount > 0 && (
              <div className="tags">
                <span className="tag ok" style={{ fontWeight: 700 }}>★ {th.ratingAvg} ({th.ratingCount} recensioni)</span>
              </div>
            )}
            <div className="card-meta">
              <span>da {th.priceIndividual} €/seduta</span>
              <span>{th.experienceYears} anni di esperienza</span>
            </div>
            <span className="btn btn-primary btn-block">{t('common.book')}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
