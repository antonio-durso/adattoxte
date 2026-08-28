import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

/**
 * Pagina 404 — mostrata per qualsiasi URL sconosciuto (rotta catch-all).
 * noindex: Google non indicizza le pagine inesistenti (anti soft-404).
 */
export default function NotFound() {
  return (
    <div className="container section" style={{ textAlign: 'center', padding: '70px 20px' }}>
      <Seo title="Pagina non trovata" description="La pagina che cerchi non esiste." path="/404" noindex />
      <div className="price" style={{ fontSize: 64, lineHeight: 1.1 }}>
        404
      </div>
      <h1>Pagina non trovata</h1>
      <p style={{ maxWidth: 460, margin: '0 auto 24px' }}>
        La pagina che cerchi non esiste o è stata spostata. Torna alla home oppure guarda i terapeuti
        disponibili.
      </p>
      <p>
        <Link to="/" className="btn btn-primary" style={{ marginRight: 10 }}>
          Torna alla home
        </Link>
        <Link to="/terapeuti" className="btn btn-outline">
          Vedi i terapeuti
        </Link>
      </p>
    </div>
  );
}
