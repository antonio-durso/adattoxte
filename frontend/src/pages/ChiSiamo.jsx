import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

const cardStyle = {
  background: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: 14,
  padding: '24px 22px',
  boxShadow: '0 4px 16px rgba(0,0,0,.05)',
  display: 'flex',
  gap: 16,
  alignItems: 'flex-start',
};

const avatarStyle = (bg) => ({
  width: 56,
  height: 56,
  borderRadius: '50%',
  background: bg,
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 800,
  fontSize: 18,
  flexShrink: 0,
});

export default function ChiSiamo() {
  return (
    <main className="container" style={{ paddingTop: 40, paddingBottom: 48 }}>
      <Seo
        title="Chi siamo"
        description="Adatto x Te è la piattaforma di psicologia online che rende la terapia accessibile: sedute in videochiamata da 45€, terapeuti iscritti all'Albo, recensioni verificate."
        path="/chi-siamo"
      />
      <h1 style={{ textAlign: 'center' }}>Chi siamo</h1>
      <p className="section-sub" style={{ maxWidth: 640, textAlign: 'center', margin: '0 auto 26px' }}>
        Adatto x Te è la piattaforma di psicologia online che rende la terapia accessibile:
        sedute in videochiamata da 45€, senza abbonamenti e senza vincoli, con terapeuti
        iscritti all'Albo e recensioni verificate.
      </p>

      <h2 style={{ textAlign: 'center', marginBottom: 18 }}>La direzione</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18, maxWidth: 860, margin: '0 auto' }}>
        <div className="card" style={cardStyle}>
          <div style={avatarStyle('#1a3d6d')}>AD</div>
          <div>
            <h3 style={{ margin: '0 0 4px', fontSize: 17 }}>Dott. Antonio D'Urso</h3>
            <p style={{ margin: '0 0 8px', fontSize: 13, color: '#475569', fontWeight: 700 }}>Fondatore e Direttore</p>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: '#334155' }}>
              Psicologo iscritto all'Albo degli Psicologi della Campania (n. 5408) con 13 anni
              di esperienza, fondatore e direttore clinico di Adatto x Te. Coordina l'équipe dei
              terapeuti, la selezione dei professionisti e la qualità dei percorsi clinici della
              piattaforma. Ha ideato il modello "online, accessibile, senza vincoli" per rendere
              la terapia davvero alla portata di tutti.
            </p>
          </div>
        </div>

        <div className="card" style={{ ...cardStyle, maxWidth: 640, margin: '0 auto' }}>
          <div style={avatarStyle('#0e7490')}>AD</div>
          <div>
            <h3 style={{ margin: '0 0 4px', fontSize: 17 }}>Aree di intervento</h3>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: '#334155' }}>
              Psicologia clinica (aree dell'ansia e dell'umore), psicologia forense e
              giuridica, psicologia del lavoro. La sua attività abbraccia molteplici aree
              del disagio psicologico, con esperienza trasversale tra clinica e ambiti applicativi.
            </p>
          </div>
        </div>
      </div>

      <h2 style={{ textAlign: 'center', margin: '34px 0 18px' }}>L'équipe</h2>
      <div className="card" style={{ maxWidth: 860, margin: '0 auto', padding: '22px 24px' }}>
        <p style={{ margin: '0 0 10px', fontSize: 14, lineHeight: 1.6, color: '#334155' }}>
          Dietro Adatto x Te c'è un'équipe di <strong>psicologi e psicoterapeuti selezionati</strong>
          tra professionisti iscritti all'Albo con comprovata esperienza.
        </p>
        <p style={{ margin: '0 0 10px', fontSize: 14, lineHeight: 1.6, color: '#334155' }}>
          Per garantire la <strong>massima riservatezza</strong>, il catalogo è anonimo: il nome del
          terapeuta viene mostrato dopo la prenotazione. Le recensioni sono le valutazioni lasciate
          dai pazienti dopo le sedute completate.
        </p>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: '#334155' }}>
          <strong>Politica editoriale</strong>: i contenuti del blog sono scritti da psicologi
          iscritti all'Albo e revisionati dall'équipe; riflettono le buone pratiche cliniche
          e non sostituiscono in alcun modo un consulto professionale.
        </p>
      </div>

      <p style={{ textAlign: 'center', marginTop: 30 }}>
        <Link className="btn btn-primary" to="/terapeuti">Scopri come funziona</Link>
      </p>
    </main>
  );
}
