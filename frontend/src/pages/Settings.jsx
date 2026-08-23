import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const ALL_SPECIALTIES = [
  'psicologia dello sport',
  'preparazione concorsi pubblici',
  'psicologia giuridica',
  'terapia di coppia',
  'ansia e depressione',
];

export default function Settings() {
  const { user, refresh, logout } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', bio: '' });
  const [profile, setProfile] = useState(null);
  const [specialties, setSpecialties] = useState([]);
  const [priceIndividual, setPriceIndividual] = useState(45);
  const [priceCouple, setPriceCouple] = useState(50);
  const [license, setLicense] = useState('');
  const [experienceYears, setExperienceYears] = useState(0);
  const [languages, setLanguages] = useState('it');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm({ name: user.name, bio: user.bio || '' });
    const p = user.therapistProfile;
    if (p) {
      setProfile(p);
      setSpecialties(JSON.parse(p.specialties || '[]'));
      setPriceIndividual(p.price_individual);
      setPriceCouple(p.price_couple);
      setLicense(p.license || '');
      setExperienceYears(p.experience_years || 0);
      setLanguages((JSON.parse(p.languages || '["it"]') || ['it']).join(', '));
    }
  }, [user]);

  function toggleSpecialty(s) {
    setSpecialties((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  }

  async function handleSave(e) {
    e.preventDefault();
    setBusy(true);
    setMessage('');
    setError('');
    try {
      const payload = { name: form.name, bio: form.bio };
      if (user.role === 'therapist') {
        payload.specialties = specialties;
        payload.priceIndividual = Number(priceIndividual);
        payload.priceCouple = Number(priceCouple);
        payload.license = license;
        payload.experienceYears = Number(experienceYears);
        payload.languages = languages.split(',').map((l) => l.trim().toLowerCase()).filter(Boolean);
      }
      await api.patch('/me', payload);
      await refresh();
      setMessage('Profilo aggiornato con successo.');
    } catch (err) {
      setError(err.response?.data?.error || 'Errore durante il salvataggio');
    } finally {
      setBusy(false);
    }
  }

  async function handleExport() {
    try {
      const r = await api.get('/me/data');
      const blob = new Blob([JSON.stringify(r.data, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `adattoxte-dati-${user.email}.json`;
      a.click();
      setMessage('Export dei tuoi dati avviato (diritto alla portabilità, art. 20 GDPR).');
    } catch {
      setError('Export non riuscito');
    }
  }

  async function handleDelete() {
    if (!window.confirm('Vuoi davvero eliminare il tuo account e tutti i tuoi dati? Questa azione è irreversibile.')) return;
    try {
      await api.delete('/me');
      logout();
      navigate('/');
    } catch {
      setError('Cancellazione non riuscita');
    }
  }

  if (!user) return null;

  return (
    <div className="container section">
      <h1>Impostazioni</h1>

      {message && <p className="ok-text">{message}</p>}
      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSave} className="card form-card">
        <h2>Profilo</h2>
        <label className="field">
          <span>Nome e cognome</span>
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required minLength={2} />
        </label>
        <label className="field">
          <span>Presentazione / bio</span>
          <textarea rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} maxLength={2000} />
        </label>

        {user.role === 'therapist' && (
          <>
            <h2>Profilo professionale</h2>
            <p className="muted small">Le specializzazioni e i prezzi sono visibili ai pazienti.</p>
            <div className="field">
              <span>Specializzazioni</span>
              <div className="checkbox-group">
                {ALL_SPECIALTIES.map((s) => (
                  <label className="chip-select" key={s}>
                    <input type="checkbox" checked={specialties.includes(s)} onChange={() => toggleSpecialty(s)} />
                    {s}
                  </label>
                ))}
              </div>
            </div>
            <div className="row-2">
              <label className="field">
                <span>Prezzo seduta individuale (€)</span>
                <input type="number" min={1} value={priceIndividual} onChange={(e) => setPriceIndividual(e.target.value)} />
              </label>
              <label className="field">
                <span>Prezzo seduta di coppia (€)</span>
                <input type="number" min={1} value={priceCouple} onChange={(e) => setPriceCouple(e.target.value)} />
              </label>
            </div>
            <div className="row-2">
              <label className="field">
                <span>Numero iscrizione all’albo</span>
                <input type="text" value={license} onChange={(e) => setLicense(e.target.value)} placeholder="es. A-12345" />
              </label>
              <label className="field">
                <span>Anni di esperienza</span>
                <input type="number" min={0} value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} />
              </label>
            </div>
            <label className="field">
              <span>Lingue parlate (separate da virgola)</span>
              <input type="text" value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="it, en" />
            </label>
          </>
        )}

        <button className="btn btn-primary" disabled={busy}>{busy ? 'Salvataggio…' : 'Salva modifiche'}</button>
      </form>

      <div className="card form-card">
        <h2>I tuoi dati e la privacy</h2>
        <p className="muted small">
          Ai sensi del Regolamento UE 2016/679 (GDPR) hai il diritto di ottenere una copia dei tuoi dati (art. 20) e di chiederne la cancellazione (art. 17).
        </p>
        <div className="row-gap">
          <button className="btn btn-outline" onClick={handleExport}>Esporta i miei dati (JSON)</button>
          <button className="btn btn-danger" onClick={handleDelete}>Cancella account e dati</button>
        </div>
      </div>
    </div>
  );
}
