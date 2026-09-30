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
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: "Antonio D'Urso",
            honorificPrefix: 'Dott.',
            jobTitle: 'Psicologo, fondatore e direttore clinico di Adatto x Te',
            url: 'https://www.adattoxte.com/chi-siamo',
            worksFor: {
              '@type': 'Organization',
              name: 'Adatto x Te',
              url: 'https://www.adattoxte.com',
            },
            // La credenziale che regge tutto l'E-E-A-T del sito: numero d'albo
            // verificabile. Stesse credenziali in BlogArticle.jsx e nelle landing.
            hasCredential: [
              {
                '@type': 'EducationalOccupationalCredential',
                credentialCategory: 'Abilitazione all\'esercizio della professione di psicologo',
                name: "Iscrizione all'Albo degli Psicologi della Campania n. 5408",
                identifier: '5408',
                recognizedBy: {
                  '@type': 'Organization',
                  name: 'Ordine degli Psicologi della Campania',
                },
              },
            ],
            knowsAbout: [
              'Psicologia clinica',
              "Disturbi d'ansia",
              "Disturbi dell'umore",
              'Psicologia forense e giuridica',
              'Psicologia del lavoro',
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            name: 'Chi siamo — Adatto x Te',
            url: 'https://www.adattoxte.com/chi-siamo',
            about: {
              '@type': 'Person',
              name: "Antonio D'Urso",
            },
          },
        ]}
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
              Psicologo iscritto all'Albo degli Psicologi della Campania n. 5408, con 13 anni
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

      <h2 style={{ textAlign: 'center', margin: '34px 0 18px' }}>Credenziali e metodo editoriale</h2>
      <div className="card" style={{ maxWidth: 860, margin: '0 auto', padding: '22px 24px' }}>
        <p style={{ margin: '0 0 10px', fontSize: 14, lineHeight: 1.6, color: '#334155' }}>
          Il direttore clinico della piattaforma è il <strong>Dott. Antonio D&apos;Urso</strong>,
          psicologo iscritto all&apos;<strong>Albo degli Psicologi della Campania n. 5408</strong>.
          Il numero di iscrizione è verificabile presso l&apos;Ordine degli Psicologi della Campania:
          è la credenziale che risponde di tutti i contenuti pubblicati su questo sito.
        </p>
        <p style={{ margin: '0 0 10px', fontSize: 14, lineHeight: 1.6, color: '#334155' }}>
          <strong>Chi scrive.</strong> Gli articoli e le guide del sito sono scritti da psicologi e
          psicoterapeuti iscritti all&apos;Albo. Ogni pagina riporta in fondo la firma dell&apos;autore
          e la data dell&apos;ultima revisione.
        </p>
        <p style={{ margin: '0 0 10px', fontSize: 14, lineHeight: 1.6, color: '#334155' }}>
          <strong>Come vengono rivisti i contenuti.</strong> Ogni testo viene riletto dall&apos;équipe
          clinica prima della pubblicazione e aggiornato quando cambiano le conoscenze o il quadro
          delle raccomandazioni. Non pubblichiamo contenuti generati automaticamente senza revisione
          di un professionista.
        </p>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: '#334155' }}>
          <strong>Come selezioniamo i terapeuti.</strong> Verifichiamo l&apos;iscrizione all&apos;Albo,
          il titolo di specializzazione e l&apos;esperienza clinica dichiarata prima di inserire un
          professionista in piattaforma. Le recensioni visibili sono le valutazioni lasciate dai
          pazienti dopo le sedute completate.
        </p>
      </div>

      <p style={{ textAlign: 'center', marginTop: 30 }}>
        <Link className="btn btn-primary" to="/terapeuti">Scopri come funziona</Link>
      </p>
    </main>
  );
}
