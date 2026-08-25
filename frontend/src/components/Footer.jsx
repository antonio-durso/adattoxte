import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import Logo from './Logo';

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <div style={{ transform: 'scale(1.15)', transformOrigin: 'left center' }}>
            <Logo />
          </div>
          <p>{t('footer.tagline')}</p>
        </div>
        <div className="footer-links">
          <Link to="/terapeuti">{t('nav.therapists')}</Link>
          <Link to="/psicologo-concorsi-pubblici">Psicologo concorsi</Link>
          <Link to="/psicologo-sport">Psicologo sport</Link>
          <Link to="/psicologia-giuridica">Psicologia giuridica</Link>
          <Link to="/cookie">Cookie</Link>
        </div>
        {/* Nota emergenza interattiva + Trasparenza (design stile siti importanti) */}
        <div style={{ width: '100%', borderTop: '1px solid rgba(255,255,255,.15)', marginTop: 16, paddingTop: 14, background: 'rgba(255,255,255,.04)', borderRadius: 14, padding: 14 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: '1 1 220px' }}>
              <span aria-hidden="true" style={{ fontSize: 22 }}>⚕️</span>
              <span className="muted small" style={{ fontSize: 12, lineHeight: 1.5 }}>
                <strong>Non è un servizio di emergenza.</strong> In caso di pericolo chiama:
              </span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <a href="tel:112" style={{ background: '#dc2626', color: '#fff', borderRadius: 999, padding: '7px 14px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>📞 112</a>
              <a href="tel:118" style={{ background: '#15803d', color: '#fff', borderRadius: 999, padding: '7px 14px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>📞 118</a>
              <a href="tel:1522" style={{ background: '#db2777', color: '#fff', borderRadius: 999, padding: '7px 14px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>📞 1522</a>
            </div>
          </div>
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,.08)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
            <span className="muted small" style={{ fontSize: 12 }}>🔒 <strong>Trasparenza e sicurezza</strong></span>
            <span className="muted small" style={{ fontSize: 12, display: 'flex', gap: 14 }}>
              <Link to="/privacy" style={{ color: '#fff', textDecoration: 'underline' }}>{t('trust.privacy')}</Link>
              <Link to="/termini" style={{ color: '#fff', textDecoration: 'underline' }}>{t('trust.terms')}</Link>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
