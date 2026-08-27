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
          </p>
        </div>
        <div className="footer-links">
          <Link to="/terapeuti">{t('nav.therapists')}</Link>
          <Link to="/chi-siamo">Chi siamo</Link>
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
    </footer>
  );
}
