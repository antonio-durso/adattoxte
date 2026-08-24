import { useState } from 'react';
import { Link } from 'react-router-dom';

const GUIDE = [
  {
    title: '🪑 Guida alla prima seduta',
    body: (
      <>
        <p>La prima seduta è un incontro di conoscenza: il terapeuta ti chiederà cosa ti porta, da quanto tempo stai così e cosa vorresti ottenere. Non devi preparare nulla di speciale, ma aiuta avere in mente:</p>
        <ul>
          <li>le situazioni che ti pesano di più in questo periodo;</li>
          <li>da quanto tempo le senti;</li>
          <li>cosa hai già provato per stare meglio.</li>
        </ul>
        <p>È normale sentirsi in imbarazzo: il terapeuta è lì per ascoltarti senza giudizio. Puoi anche fare domande su di lui/lei e sul suo metodo: è un tuo diritto.</p>
      </>
    ),
  },
  {
    title: '🌬️ Tecniche di respirazione per l’ansia',
    body: (
      <>
        <p>La respirazione lenta attiva il sistema nervoso parasimpatico, quello che "spegne" l'allarme. Prova questo esercizio quando senti l'ansia salire:</p>
        <ul>
          <li><strong>Respirazione 4-6</strong>: inspira dal naso per 4 secondi, espira dalla bocca per 6. Ripeti per 2-3 minuti.</li>
          <li><strong>Respirazione a scatola</strong>: inspira 4 secondi, trattieni 4, espira 4, pausa 4. Ripeti 5 volte.</li>
          <li><strong>Espirazione allungata</strong>: raddoppia sempre il tempo dell'espirazione rispetto all'inspirazione.</li>
        </ul>
        <p>Allenati 5 minuti al giorno: funziona meglio se la pratichi anche quando stai bene.</p>
      </>
    ),
  },
  {
    title: '📓 Diario delle emozioni',
    body: (
      <>
        <p>Scrivere le emozioni aiuta a capirle e a ridurne l'intensità. Ogni sera, 5 minuti, rispondi a queste domande:</p>
        <ul>
          <li>Qual è stata l'emozione più forte oggi? Dove l'ho sentita nel corpo?</li>
          <li>Cosa l'ha scatenata? C'era un pensiero ricorrente?</li>
          <li>Cosa ho fatto che mi ha aiutato? Cosa avrei potuto fare?</li>
        </ul>
        <p>Non serve un diario speciale: un quaderno qualunque va benissimo. La costanza conta più della forma.</p>
      </>
    ),
  },
  {
    title: '📹 Come prepararsi alla videochiamata',
    body: (
      <>
        <p>Le sedute online funzionano benissimo se l'ambiente è adatto:</p>
        <ul>
          <li>scegli uno spazio <strong>tranquillo e privato</strong> dove non sarai interrotto;</li>
          <li>usa <strong>Chrome o Safari</strong> aggiornati e una connessione stabile;</li>
          <li>controlla microfono e fotocamera qualche minuto prima;</li>
          <li>tieni il telefono o computer su un supporto stabile, all'altezza degli occhi;</li>
          <li>indossa cuffie con microfono se possibile: si sente meglio in entrambe le direzioni.</li>
        </ul>
        <p>Se perdi la connessione, non preoccuparti: rientra nella stessa stanza video con il codice della tua seduta.</p>
      </>
    ),
  },
];

export default function Risorse() {
  const [open, setOpen] = useState(0);

  return (
    <div className="container section" style={{ maxWidth: 760, margin: '0 auto' }}>
      <h1>Risorse gratuite</h1>
      <p className="muted">
        Guide pratiche scritte dai nostri terapeuti per iniziare il tuo percorso con più consapevolezza.
        In aggiornamento continuo.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {GUIDE.map((g, i) => (
          <div key={i} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <button
              onClick={() => setOpen(open === i ? -1 : i)}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                padding: '14px 16px',
                fontSize: 16,
                fontWeight: 700,
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              {g.title}
              <span style={{ color: '#64748b' }}>{open === i ? '−' : '+'}</span>
            </button>
            {open === i && <div style={{ padding: '4px 16px 16px', lineHeight: 1.6 }}>{g.body}</div>}
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: 28 }}>
        <p className="muted">Queste guide aiutano, ma non sostituiscono un percorso con un professionista.</p>
        <Link to="/terapeuti" className="btn btn-primary">Trova il tuo terapeuta</Link>
      </div>
    </div>
  );
}
