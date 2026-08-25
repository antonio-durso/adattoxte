import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../i18n';
import Logo from './Logo';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { t, lang, setLang } = useI18n();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/');
  }

  const areaLink =
    user?.role === 'therapist' ? '/area-terapeuta'
    : user?.role === 'patient' ? '/area-paziente'
    : user?.role === 'admin' ? '/area-admin'
    : null;

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          <Logo />
        </Link>
        {/* Tasto menu interattivo (mobile): rotondo, a freccia, apre/chiude il menu a tendina */}
        <button
          className="nav-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="main-menu"
          aria-label={menuOpen ? 'Chiudi menu' : 'Apri menu'}
        >
          <span aria-hidden="true" className={`nav-toggle-icon${menuOpen ? ' open' : ''}`}>▾</span>
        </button>
        <nav id="main-menu" className={menuOpen ? 'nav-links open' : 'nav-links'} onClick={() => setMenuOpen(false)}>
          <Link to="/terapeuti">{t('nav.therapists')}</Link>
          <Link to="/blog">{t('nav.blog')}</Link>
          <Link to="/risorse">{t('nav.risorse')}</Link>
          <Link to="/recensioni">{t('nav.reviews')}</Link>
          <Link to="/test">🧠 Test</Link>
          {areaLink && (
            <Link to={areaLink}>
              {user.role === 'therapist' ? t('nav.therapistArea') : user.role === 'patient' ? t('nav.patientArea') : t('nav.adminArea')}
            </Link>
          )}
          <Link to="/impostazioni">{t('nav.settings')}</Link>
          <button
            className="lang-toggle"
            onClick={() => setLang(lang === 'it' ? 'en' : 'it')}
            aria-label={`${t('common.language')}: ${lang === 'it' ? 'EN' : 'IT'}`}
            title={`${t('common.language')}: ${lang === 'it' ? 'EN' : 'IT'}`}
          >
            {lang === 'it' ? 'EN' : 'IT'} <span aria-hidden="true">▾</span>
          </button>
          {user ? (
            <button className="btn btn-outline btn-sm" onClick={handleLogout}>
              {t('nav.logout')}
            </button>
          ) : (
            <>
              <Link to="/accedi" className="btn btn-outline btn-sm">
                {t('nav.login')}
              </Link>
              <Link to="/registrazione" className="btn btn-primary btn-sm">
                {t('nav.register')}
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
