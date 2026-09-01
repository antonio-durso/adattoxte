// ============================================================================
// TrustStrip.jsx — Striscia di fiducia per la homepage di Adatto x Te
// ----------------------------------------------------------------------------
// Cosa fa: mostra sotto l'hero i badge di credibilità ESTERNI (Trustpilot,
// Google, GDPR, albo, online, prima seduta gratuita). Complementa
// ReviewsStrip.jsx (che mostra le recensioni INTERNE della piattaforma).
// Autonoma: nessuna modifica a i18n.jsx richiesta (dizionario locale IT/EN).
//
// INTEGRAZIONE:
// 1. Copia questo file in frontend/src/components/TrustStrip.jsx
// 2. In frontend/src/pages/Home.jsx:
//      import TrustStrip from '../components/TrustStrip';
//    E inserisci <TrustStrip /> subito DOPO la chiusura della sezione hero
//    (dopo `</section>` che contiene <HeroComic />, prima della sezione
//    servizi), mantenendo lo stesso livello di indentazione.
// 3. Build: vite build && node scripts/prerender.js (il componente è
//    statico e prerender-friendly, nessun fetch lato client).
//
// NOTA: usa solo classi/inline style già presenti nel progetto
// (.container, .section, .card, .muted, .btn). Nessun CSS nuovo.
// ============================================================================

import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';

const TRUSTPILOT_URL = 'https://it.trustpilot.com/review/adattoxte.com';
const GOOGLE_URL = 'https://share.google/U98x9MWWluFoa91xy';

const COPY = {
  it: {
    label: 'Scelto con fiducia',
    badges: [
      { icon: '★', title: 'Trustpilot 4,3/5', sub: 'Recensioni verificate', href: TRUSTPILOT_URL, external: true },
      { icon: '★', title: 'Google 5,0/5', sub: 'Valutazione dei pazienti', href: GOOGLE_URL, external: true },
      { icon: '🛡️', title: 'GDPR compliant', sub: 'Dati protetti, export e delete', href: '/privacy', external: false },
      { icon: '🎓', title: 'Iscritti all\'albo', sub: 'Psicologi e psicoterapeuti qualificati', href: '/terapeuti', external: false },
      { icon: '💻', title: '100% online', sub: 'Videochiamata sicura nel browser', href: '/#come-funziona', external: false },
      { icon: '🎁', title: 'Prima seduta gratuita', sub: '15 minuti conoscitivi', href: '/registrazione', external: false },
    ],
  },
  en: {
    label: 'Trusted by our community',
    badges: [
      { icon: '★', title: 'Trustpilot 4.3/5', sub: 'Verified reviews', href: TRUSTPILOT_URL, external: true },
      { icon: '★', title: 'Google 5.0/5', sub: 'Patient ratings', href: GOOGLE_URL, external: true },
      { icon: '🛡️', title: 'GDPR compliant', sub: 'Protected data, export & delete', href: '/privacy', external: false },
      { icon: '🎓', title: 'Licensed', sub: 'Qualified psychologists & psychotherapists', href: '/terapeuti', external: false },
      { icon: '💻', title: '100% online', sub: 'Secure video call in your browser', href: '/#come-funziona', external: false },
      { icon: '🎁', title: 'Free first session', sub: '15-minute intro', href: '/registrazione', external: false },
    ],
  },
};

export default function TrustStrip() {
  const { lang } = useI18n();
  const c = COPY[lang === 'en' ? 'en' : 'it'];

  const Badge = ({ b }) => {
    const inner = (
      <>
        <span style={{ fontSize: 22, display: 'block', marginBottom: 4 }}>{b.icon}</span>
        <strong style={{ display: 'block', fontSize: 13, color: '#0f172a' }}>{b.title}</strong>
        <span className="muted" style={{ fontSize: 11 }}>{b.sub}</span>
      </>
    );
    const style = {
      display: 'block',
      textDecoration: 'none',
      textAlign: 'center',
      padding: '14px 10px',
      borderRadius: 12,
      border: '1px solid #e2e8f0',
      background: '#fff',
      transition: 'box-shadow .15s ease, transform .15s ease',
      minHeight: 96,
    };
    return b.external ? (
      <a href={b.href} target="_blank" rel="noopener noreferrer" style={style}>
        {inner}
      </a>
    ) : (
      <Link to={b.href} style={style}>
        {inner}
      </Link>
    );
  };

  return (
    <section className="container section" style={{ paddingTop: 0 }}>
      <p className="muted" style={{ textAlign: 'center', margin: '0 0 12px', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
        {c.label}
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 12,
        }}
      >
        {c.badges.map((b) => (
          <Badge key={b.title} b={b} />
        ))}
      </div>
    </section>
  );
}
