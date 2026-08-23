import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../i18n';

export default function Login() {
  const { login } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const user = await login(email, password);
      const from = location.state?.from;
      if (from) navigate(from);
      else if (user.role === 'admin') navigate('/area-admin');
      else navigate(user.role === 'therapist' ? '/area-terapeuta' : '/area-paziente');
    } catch (err) {
      setError(err.response?.data?.error || t('common.error'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container section auth-page">
      <div className="card form-card">
        <h1>Accedi</h1>
        <p className="muted">Bentornato! Inserisci le tue credenziali.</p>

        <form onSubmit={handleSubmit}>
          <label className="field">
            <span>Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label className="field">
            <span>Password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>

          {error && <p className="error-text">{error}</p>}

          <button className="btn btn-primary btn-block btn-lg" disabled={busy}>
            {busy ? 'Accesso in corso…' : 'Accedi'}
          </button>
        </form>

        <p className="muted small">
          Non hai un account? <Link to="/registrazione">Registrati</Link>
        </p>
      </div>
    </div>
  );
}
