import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../i18n';
import Seo from '../components/Seo';
import { track } from '../analytics';

export default function Register() {
  const { register } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: searchParams.get('tipo') === 'terapeuta' ? 'therapist' : 'patient',
    consent: false,
    healthConsent: false,
    refCode: searchParams.get('ref') || '',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.consent) {
      setError('Devi accettare l’informativa privacy e i termini di servizio.');
      return;
    }
    if (!form.healthConsent) {
      setError('Devi acconsentire al trattamento dei dati relativi alla salute (art. 9 GDPR).');
      return;
    }
    setBusy(true);
    try {
      const user = await register(form);
      try { track('sign_up', { method: 'email', role: user.role }); } catch (e) {}
      navigate(user.role === 'therapist' ? '/area-terapeuta' : '/area-paziente');
    } catch (err) {
      setError(err.response?.data?.error || t('common.error'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container section auth-page">
      <Seo title="Registrati" description="Crea il tuo account su Adatto x Te per prenotare sedute o offrire i tuoi servizi." path="/registrazione" />
      <div className="card form-card">
        <h1>Registrati</h1>
        <p className="muted">Crea il tuo account per prenotare sedute o offrire i tuoi servizi.</p>

        <form onSubmit={handleSubmit}>
          <div className="role-toggle">
            <label className={form.role === 'patient' ? 'role-option active' : 'role-option'}>
              <input type="radio" name="role" checked={form.role === 'patient'} onChange={() => set('role', 'patient')} />
              <strong>Sono un paziente</strong>
              <span>Voglio prenotare sedute</span>
            </label>
            <label className={form.role === 'therapist' ? 'role-option active' : 'role-option'}>
              <input type="radio" name="role" checked={form.role === 'therapist'} onChange={() => set('role', 'therapist')} />
              <strong>Sono un professionista</strong>
              <span>Voglio offrire consulenze</span>
            </label>
          </div>

          <label className="field">
            <span>Nome e cognome</span>
            <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)} required minLength={2} />
          </label>
          <label className="field">
            <span>Email</span>
            <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} required />
          </label>
          <label className="field">
            <span>Password (minimo 8 caratteri)</span>
            <input type="password" value={form.password} onChange={(e) => set('password', e.target.value)} required minLength={8} />
          </label>
          <label className="field">
            <span>Codice invito (opzionale)</span>
            <input
              type="text"
              value={form.refCode}
              onChange={(e) => set('refCode', e.target.value.toUpperCase())}
              placeholder="es. A1B2C3D4 — ricevi 10 € di credito"
              maxLength={10}
            />
            {form.refCode && <span className="muted small">🎁 Con questo codice ricevi 10 € di credito sulla prima seduta!</span>}
          </label>

          <label className="checkbox">
            <input type="checkbox" checked={form.consent} onChange={(e) => set('consent', e.target.checked)} />
            <span>
              Accetto l’<Link to="/privacy">informativa privacy</Link> e i <Link to="/termini">termini di servizio</Link> (Reg. UE 2016/679).
            </span>
          </label>

          {/* Consenso dedicato ai dati di salute (art. 9 GDPR): separato dai termini,
              come richiesto per le categorie speciali di dati (test, sedute, note) */}
          <label className="checkbox">
            <input type="checkbox" checked={form.healthConsent} onChange={(e) => set('healthConsent', e.target.checked)} />
            <span>
              Acconsento <strong>esplicitamente</strong> al trattamento dei miei dati relativi alla salute
              (esiti dei test, contenuto delle sedute e delle comunicazioni) per la finalità di erogare il
              servizio richiesto, ai sensi dell'<Link to="/privacy">art. 9 del Reg. UE 2016/679</Link>.
            </span>
          </label>

          {error && <p className="error-text">{error}</p>}

          <button className="btn btn-primary btn-block btn-lg" disabled={busy}>
            {busy ? 'Registrazione in corso…' : 'Crea account'}
          </button>
        </form>

        <p className="muted small">
          Hai già un account? <Link to="/accedi">Accedi</Link>
        </p>
      </div>
    </div>
  );
}
