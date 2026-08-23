import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useI18n } from '../i18n';

const SPECIALTIES = [
  'psicologia dello sport',
  'preparazione concorsi pubblici',
  'psicologia giuridica',
  'terapia di coppia',
  'ansia e depressione',
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
      <h1>{t('nav.therapists')}</h1>
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

      <div className="grid cards">
        {therapists.map((th) => (
          <Link to={`/terapeuti/${th.id}`} className="card therapist-card" key={th.id}>
            <div className="avatar">{th.name.replace(/^(Dott\.?s?a?\.?)\s*/, '').charAt(0)}</div>
            <h3>{th.name}</h3>
            <div className="tags">
              {th.specialties.map((s) => (
                <span className="tag" key={s}>
                  {s}
                </span>
              ))}
            </div>
            <p className="card-bio">{th.bio}</p>
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
