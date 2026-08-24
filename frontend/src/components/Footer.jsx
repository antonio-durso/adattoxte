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
    </footer>
  );
}
