import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
  const { t } = useI18n();
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [specialty, setSpecialty] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (specialty) params.set('specialty', specialty);
    api
      .get(`/therapists?${params.toString()}`)
      .then((r) => setTherapists(r.data.therapists))
      .catch(() => setError(t('common.error')))
      .finally(() => setLoading(false));
  }, [q, specialty, t]);

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
              onClick={() => setSpecialty(specialty === n.value ? '' : n.value)}
              style={{
                border: specialty === n.value ? '2px solid #4f46e5' : '1px solid #e5e7eb',
                background: specialty === n.value ? '#eef2ff' : '#fff',
                borderRadius: 999,
                padding: '8px 14px',
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              {n.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filters">
        <input
          type="search"
          placeholder="Cerca per nome o specializzazione…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="search-input"
        />
        <select value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="search-input">
          <option value="">Tutte le specializzazioni</option>
          {SPECIALTIES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="muted">{t('common.loading')}</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && !error && therapists.length === 0 && <p className="muted">Nessun terapeuta trovato.</p>}

      {!loading && !error && therapists.length > 0 && specialty && (
        <div style={{ margin: '18px 0 8px' }}>
          <h2 style={{ margin: 0 }}>✅ Ti consigliamo questi professionisti</h2>
          <p className="muted">Abbiamo selezionato per te {therapists.length} profili in «{specialty}». I primi 3 sono i nostri consigliati.</p>
        </div>
      )}

      {!loading && !error && therapists.length > 0 && specialty && (
        <div className="grid cards">
          {therapists.slice(0, 3).map((th) => (
            <Link to={`/terapeuti/${th.id}`} className="card therapist-card" key={th.id}
              style={{ border: '2px solid #4f46e5', boxShadow: '0 10px 24px rgba(79,70,229,.18)' }}>
              <span className="badge" style={{ background: '#4f46e5', color: '#fff', alignSelf: 'flex-start' }}>⭐ Consigliato</span>
              <div className="avatar">P</div>
              <h3>Psicologo{th.specialties && th.specialties[0] ? ` · ${th.specialties[0]}` : ''}</h3>
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
      )}

      {!loading && !error && specialty && therapists.length > 3 && (
        <h3 style={{ margin: '26px 0 10px' }}>Altri professionisti disponibili</h3>
      )}

      <div className="grid cards">
        {(specialty ? therapists.slice(3) : therapists).map((th) => (
          <Link to={`/terapeuti/${th.id}`} className="card therapist-card" key={th.id}>
            <div className="avatar">P</div>
            <h3>Psicologo{th.specialties && th.specialties[0] ? ` · ${th.specialties[0]}` : ''}</h3>
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
