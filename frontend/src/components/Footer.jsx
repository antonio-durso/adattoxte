import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import Logo from './Logo';

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <Logo />
          <p>{t('footer.tagline')}</p>
        </div>
        <div className="footer-links">
          <Link to="/terapeuti">{t('nav.therapists')}</Link>
          <Link to="/psicologo-concorsi-pubblici">Psicologo concorsi</Link>
          <Link to="/psicologo-sport">Psicologo sport</Link>
          <Link to="/psicologia-giuridica">Psicologia giuridica</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/cookie">Cookie</Link>
          <Link to="/termini">Termini</Link>
        </div>
      </div>
      <div className="container" style={{ borderTop: '1px solid rgba(255,255,255,.12)', marginTop: 22, paddingTop: 12 }}>
        <p className="muted small" style={{ margin: 0, fontSize: 12 }}>
          ⚕️ Adatto x Te non è un servizio di emergenza. In caso di pericolo chiama il <strong>112</strong> o il <strong>118</strong> (24h), o il <strong>1522</strong> (anti-violenza, gratuito). Le sedute online non sostituiscono il rapporto con il proprio medico.
        </p>
      </div>
    </footer>
  );
}
