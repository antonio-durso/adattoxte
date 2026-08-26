import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import Logo from './Logo';

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
        </div>
        <div className="footer-links">
          <Link to="/terapeuti">{t('nav.therapists')}</Link>
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
    </footer>
  );
}
