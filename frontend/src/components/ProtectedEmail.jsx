import { useState } from 'react';

/**
 * Email protetta anti-spam: l'indirizzo non compare in chiaro nell'HTML.
 * Viene ricostruito solo al click (apre l'app di posta del visitatore).
 */
export default function ProtectedEmail({ label = "Scrivici all'Ufficio Stampa", subject = '' }) {
  const [clicked, setClicked] = useState(false);
  // indirizzo ricostruito a runtime, mai presente in chiaro nel sorgente
  const email = ['ant.durso', '1', '@gmail.com'].join('');

  const open = (e) => {
    e.preventDefault();
    setClicked(true);
    const query = subject ? '?subject=' + encodeURIComponent(subject) : '';
    window.location.href = 'mailto:' + email + query;
  };

  return (
    <span>
      <a href="#scrivici" className="btn" onClick={open}>{label}</a>
      <span className="muted small" style={{ display: 'block', marginTop: 6 }}>
        {clicked
          ? "Si sta aprendo la tua app di posta (indirizzo protetto, niente spam)."
          : "L'indirizzo email è protetto: al clic si apre la tua app di posta."}
      </span>
    </span>
  );
}
