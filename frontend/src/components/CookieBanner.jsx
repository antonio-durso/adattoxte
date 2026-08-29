import { useState } from 'react';

export default function CookieBanner() {
  const [visible, setVisible] = useState(() => !localStorage.getItem('adt_cookie_consent'));

  function choose(value) {
    localStorage.setItem('adt_cookie_consent', value);
    setVisible(false);
    // Se l'utente accetta ORA, inizializza subito analytics e pixel
    // (le funzioni globali sono definite in index.html e sono idempotenti)
    if (value === 'accepted') {
      try {
        if (typeof window.initAnalytics === 'function') window.initAnalytics();
        if (typeof window.initPixel === 'function') window.initPixel();
      } catch (e) { /* non deve mai bloccare la UI */ }
    }
  }

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-label="Preferenze cookie">
      <p>
        Utilizziamo cookie tecnici per il funzionamento della piattaforma e, solo con il tuo consenso, cookie di analisi.
        Leggi la nostra <a href="/cookie">informativa cookie</a>.
      </p>
      <div className="cookie-actions">
        <button className="btn btn-outline btn-sm" onClick={() => choose('refused')}>
          Rifiuta
        </button>
        <button className="btn btn-primary btn-sm" onClick={() => choose('accepted')}>
          Accetta
        </button>
      </div>
    </div>
  );
}
