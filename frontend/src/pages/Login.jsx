import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../i18n';
import api from '../api';
import Seo from '../components/Seo';

export default function Login() {
  const { login } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();

  const [email, setEmail] = useState(params.get('email') || '');
  const [password, setPassword] = useState(params.get('pw') || '');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // "Sveglia" il server appena la pagina di login si apre (Render free si addormenta)
  useEffect(() => {
    api.get('/health').catch(() => {});
  }, []);

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
      const status = err.response?.status;
      if (!err.response || status === 502 || status === 503 || status === 504) {
        setError('Il server sta riattivandosi: attendi qualche secondo e premi di nuovo Accedi.');
      } else {
        setError(err.response?.data?.error || t('common.error'));
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container section auth-page">
      <Seo title="Accedi" description="Accedi alla tua area personale Adatto x Te." path="/accedi" />
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
