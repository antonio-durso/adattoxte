import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import Logo from './Logo';
import ContactForm from './ContactForm';

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <Link to="/" className="footer-logo" aria-label="Adatto x Te — torna alla home">
            <span style={{ display: 'inline-block', transform: 'scale(1.15)', transformOrigin: 'left center' }}>
              <Logo />
            </span>
          </Link>
          <p>{t('footer.tagline')}</p>
          <p style={{ marginTop: 10, display: 'flex', gap: 16, alignItems: 'center' }}>
            <a
              href="https://www.facebook.com/people/Adatto-x-Te/61593750877130/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#286a8f', fontWeight: 600, textDecoration: 'none' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#1877F2" d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.026 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.971H15.83c-1.491 0-1.956.93-1.956 1.886v2.264h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
              </svg>
              Facebook
            </a>
            <a
              href="https://www.instagram.com/adattoxte"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#286a8f', fontWeight: 600, textDecoration: 'none' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#E4405F" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              Instagram
            </a>
            <a
              href="https://www.linkedin.com/company/adattoxte"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#286a8f', fontWeight: 600, textDecoration: 'none' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#0A66C2" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
              </svg>
              LinkedIn
            </a>
            <a
              href="https://www.tiktok.com/@adattoxte"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#286a8f', fontWeight: 600, textDecoration: 'none' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#000" d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
              TikTok
            </a>
            <a
              href="https://share.google/U98x9MWWluFoa91xy"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#286a8f', fontWeight: 600, textDecoration: 'none' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 16 8 16s8-10.75 8-16c0-4.42-3.58-8-8-8zm0 11.5A3.5 3.5 0 1 1 12 4.5a3.5 3.5 0 0 1 0 7z" />
              </svg>
              Google Maps
            </a>
          </p>
        </div>
        <div className="footer-links">
          <Link to="/terapeuti">{t('nav.therapists')}</Link>
          <Link to="/prezzi">Prezzi</Link>
          <Link to="/aziende">Per le aziende</Link>
          <Link to="/chi-siamo">Chi siamo</Link>
          <Link to="/equipe">Équipe clinica</Link>
          <Link to="/psicologo-concorsi-pubblici">Psicologo concorsi</Link>
          <Link to="/psicologo-sport">Psicologo sport</Link>
          <Link to="/psicologia-giuridica">Psicologia giuridica</Link>
          <Link to="/psicologo-online/depressione">Psicologo online depressione</Link>
          <Link to="/psicologo-online/ansia">Psicologo online ansia</Link>
          <Link to="/psicologo-online/attacchi-di-panico">Psicologo online attacchi di panico</Link>
          <Link to="/psicologo-online/insonnia">Psicologo online insonnia</Link>
          <Link to="/psicologo-online/milano">Psicologo online Milano</Link>
          <Link to="/psicologo-online/roma">Psicologo online Roma</Link>
          <Link to="/cookie">Cookie</Link>
        </div>
        {/* Nota emergenza interattiva + Trasparenza (design stile siti importanti) */}
        <div style={{ width: '100%', borderTop: '1px solid var(--border)', marginTop: 16, paddingTop: 14, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14, padding: 14 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: '1 1 220px' }}>
              <span aria-hidden="true" style={{ fontSize: 22 }}>⚕️</span>
              <span style={{ fontSize: 12, lineHeight: 1.5, color: '#334155' }}>
                <strong style={{ color: '#0f172a' }}>Non è un servizio di emergenza.</strong> In caso di pericolo chiama:
              </span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <a href="tel:112" style={{ background: '#dc2626', color: '#fff', borderRadius: 999, padding: '7px 14px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>📞 112</a>
              <a href="tel:118" style={{ background: '#15803d', color: '#fff', borderRadius: 999, padding: '7px 14px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>📞 118</a>
              <a href="tel:1522" style={{ background: '#db2777', color: '#fff', borderRadius: 999, padding: '7px 14px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>📞 1522</a>
            </div>
          </div>
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #e2e8f0', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: '#0f172a', fontWeight: 700 }}>🔒 Trasparenza e sicurezza</span>
            <span style={{ fontSize: 12, display: 'flex', gap: 14 }}>
              <Link to="/privacy" style={{ color: '#286a8f', textDecoration: 'underline', fontWeight: 600 }}>{t('trust.privacy')}</Link>
              <Link to="/termini" style={{ color: '#286a8f', textDecoration: 'underline', fontWeight: 600 }}>{t('trust.terms')}</Link>
            </span>
          </div>
        </div>
      </div>
      {/* Modulo contatti: pazienti, psicologi, giornalisti, collaborazioni */}
      <section className="container section" id="contatti" style={{ paddingBottom: 8 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 8 }}>{t('contact.title')}</h2>
        <p className="section-sub" style={{ maxWidth: 560, textAlign: 'center', marginBottom: 18 }}>
          {t('contact.subtitle')}
        </p>
        <ContactForm />
      </section>
      {/* Metodi di pagamento accettati (fiducia, stile e-commerce) */}
      <div className="container" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 12, paddingTop: 14, paddingBottom: 16 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span aria-hidden="true">🔒</span> {t('footer.payments')}
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6 }}>
          <span title="PayPal" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 6, padding: '4px 8px', display: 'inline-flex', alignItems: 'center', fontSize: 12, fontStyle: 'italic', fontWeight: 700 }}>
            <span style={{ color: '#003087' }}>Pay</span>
            <span style={{ color: '#006ba6' }}>Pal</span>
          </span>
          <span title="Visa" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 6, padding: '4px 8px', fontSize: 12, fontStyle: 'italic', fontWeight: 800, color: '#1a1f71', letterSpacing: '0.5px' }}>VISA</span>
          <span title="Mastercard" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 6, padding: '4px 8px', display: 'inline-flex', alignItems: 'center' }}>
            <svg width="20" height="14" viewBox="0 0 36 24" aria-hidden="true">
              <circle cx="14" cy="12" r="10" fill="#EB001B" />
              <circle cx="22" cy="12" r="10" fill="#F79E1B" fillOpacity="0.9" />
            </svg>
          </span>
          <span title="American Express" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 6, padding: '4px 8px', fontSize: 10, fontWeight: 800, color: '#006FCF', letterSpacing: '0.5px' }}>AMEX</span>
          <span title="Maestro" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 6, padding: '4px 8px', display: 'inline-flex', alignItems: 'center' }}>
            <svg width="20" height="14" viewBox="0 0 36 24" aria-hidden="true">
              <circle cx="14" cy="12" r="10" fill="#0F2B7A" />
              <circle cx="22" cy="12" r="10" fill="#D9222A" />
            </svg>
          </span>
        </div>
        <span style={{ fontSize: 11, color: '#475569' }}>{t('footer.paymentsNote')}</span>
      </div>
      {/* Marchio TBIZ – Research & Ideas for Business (Regione Campania) */}
      <div className="container" style={{ paddingTop: 4, paddingBottom: 22, textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
            maxWidth: 680,
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 14,
            padding: '18px 22px',
          }}
        >
          <Link to="/tibiz" aria-label="TBIZ – Research & Ideas for Business — scopri il programma">
            <img
              src="/images/tbiz-logo.png"
              alt="TBIZ – Research & Ideas for Business (TechnologyBIZ)"
              className="tbiz-logo"
              style={{ height: 120, width: 'auto', display: 'block' }}
              loading="lazy"
            />
            <span className="tbiz-hint">Scopri il programma ↓</span>
          </Link>
          <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.55, color: '#334155' }}>{t('footer.tbizText')}</p>
          {/* Timbro legale (conformità GDPR) — stile notaio, valore di attestazione */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 14, marginTop: 6 }}>
            <Link to="/privacy" aria-label="Informativa privacy conforme al GDPR" title="Informativa privacy e cookie conforme al Regolamento UE 2016/679 (GDPR)">
              <span
                style={{
                  display: 'inline-flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 108,
                  height: 108,
                  borderRadius: '50%',
                  border: '3px double #475569',
                  color: '#475569',
                  transform: 'rotate(-6deg)',
                  opacity: 0.92,
                  textAlign: 'center',
                  padding: 8,
                  lineHeight: 1.25,
                  userSelect: 'none',
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: '0.5px' }}>✦</span>
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.5px' }}>CONFORME AL</span>
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.5px' }}>GDPR</span>
                <span style={{ fontSize: 8, fontWeight: 600, letterSpacing: '0.3px' }}>UE 2016/679</span>
                <span style={{ fontSize: 8, fontWeight: 600, letterSpacing: '0.3px' }}>AGG. 30/08/2026</span>
              </span>
            </Link>
            <span style={{ maxWidth: 300, fontSize: 11.5, lineHeight: 1.5, color: '#475569', textAlign: 'left' }}>
              Informativa privacy e cookie redatte in conformità al Regolamento UE 2016/679 (GDPR) e alla
              normativa di settore. <Link to="/privacy" style={{ color: '#286a8f', textDecoration: 'underline', fontWeight: 600 }}>Leggi la privacy policy</Link> ·{' '}
              <Link to="/cookie" style={{ color: '#286a8f', textDecoration: 'underline', fontWeight: 600 }}>cookie policy</Link> ·{' '}
              <Link to="/termini" style={{ color: '#286a8f', textDecoration: 'underline', fontWeight: 600 }}>termini</Link>.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
