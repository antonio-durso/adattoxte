import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../i18n';
import Logo from './Logo';

const IS_IOS = typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent);

export default function Navbar() {
  const { user, logout } = useAuth();
  const { t, lang, setLang } = useI18n();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallHelp, setShowInstallHelp] = useState(false);
  const closeBtnRef = useRef(null);

  // Cattura l'evento di installazione PWA del browser
  useEffect(() => {
    function onBeforeInstall(e) {
      e.preventDefault();
      setDeferredPrompt(e);
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall);
  }, []);

  // Accessibilità: focus sul pulsante Chiudi quando si apre il dialogo
  useEffect(() => {
    if (!showInstallHelp) return;
    const timer = setTimeout(() => closeBtnRef.current?.focus(), 60);
    return () => clearTimeout(timer);
  }, [showInstallHelp]);

  // Accessibilità: ESC chiude il dialogo
  useEffect(() => {
    if (!showInstallHelp) return;
    function onKey(e) {
      if (e.key === 'Escape') setShowInstallHelp(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [showInstallHelp]);

  async function handleInstall() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice.catch(() => null);
      setDeferredPrompt(null);
    } else {
      setShowInstallHelp(true);
    }
  }

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
        {/* Pulsante "Installa app" (PWA), sempre visibile, accanto al menu */}
        <button
          className="install-app-btn"
          onClick={handleInstall}
          aria-label={t('nav.install')}
          title={t('nav.install')}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v12" />
            <path d="M7 10l5 5 5-5" />
            <path d="M4 21h16" />
          </svg>
          {t('nav.install')}
        </button>
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
          <Link to="/equipe">{t('nav.equipe')}</Link>
          <Link to="/blog">{t('nav.blog')}</Link>
          <Link to="/risorse">{t('nav.risorse')}</Link>
          <Link to="/recensioni">{t('nav.reviews')}</Link>
          <Link to="/ufficio-stampa">Ufficio stampa</Link>
          <Link to="/prezzi">Prezzi</Link>
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

      {/* Dialogo aiuto installazione (quando il browser non offre il prompt) */}
      {showInstallHelp && (
        <div className="install-overlay" role="presentation" onClick={() => setShowInstallHelp(false)}>
          <div
            className="install-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="install-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="install-title">{t('install.title')}</h3>
            <p>{IS_IOS ? t('install.ios') : t('install.android')}</p>
            <button ref={closeBtnRef} className="btn btn-primary btn-sm" onClick={() => setShowInstallHelp(false)}>
              {t('install.close')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
