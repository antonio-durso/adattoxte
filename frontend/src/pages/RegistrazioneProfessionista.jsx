/**
 * RegistrazioneProfessionista — porta d'ingresso dedicata ai professionisti.
 *
 * Struttura ripresa da MioDottore (/registrazione-medico): wizard a passi che
 * parte minimale (specializzazione + nome + cognome) e chiede il resto dopo.
 * Differenza voluta: questa pagina è INDICIZZABILE (niente noindex), perché è
 * la porta da cui devono arrivare i professionisti dalla ricerca.
 */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../i18n';
import Seo from '../components/Seo';
import { track } from '../analytics';

const SPECIALIZZAZIONI = [
  'Psicoterapia individuale (adulti)',
  'Terapia di coppia',
  'Ansia e depressione',
  'Disturbi del comportamento alimentare',
  'Età evolutiva (bambini e adolescenti)',
  'Psicologia dello sport',
  'Preparazione concorsi pubblici',
  'Psicologia giuridica',
  'Dipendenze',
  'Lutto ed elaborazione del trauma',
  'Stress e burnout lavorativo',
  'Altro'
];

const FAQ = [
  [
    'Quanto costa iscriversi?',
    'L’iscrizione è gratuita per il panel fondatore: i primi professionisti entrano senza costi e restano gratuiti finché la piattaforma non porta loro pazienti.'
  ],
  [
    'Serve la specializzazione in psicoterapia?',
    'Per i percorsi clinici è richiesta la specializzazione in psicoterapia (o il percorso in corso). Per i percorsi di sostegno e benessere è sufficiente l’iscrizione all’Albo degli Psicologi.'
  ],
  [
    'Devo essere in Italia?',
    'No. La piattaforma segue pazienti italiani in 43 paesi: si lavora online, dai pazienti ovunque si trovino.'
  ],
  [
    'Cosa faccio dopo la registrazione?',
    'Accedi alla tua area riservata e completi il profilo: numero di iscrizione all’Albo, città, disturbi di cui ti occupi, lingue parlate e biografia. Da lì nasce la tua pagina pubblica.'
  ]
];

export default function RegistrazioneProfessionista() {
  const { register } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    specializzazione: '',
    nome: '',
    cognome: '',
    email: '',
    password: '',
    consent: false,
    healthConsent: false
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setError('');
  }

  function passaAlPasso2(e) {
    e.preventDefault();
    if (!form.specializzazione) return setError('Scegli la tua area principale.');
    if (form.nome.trim().length < 2) return setError('Inserisci il tuo nome.');
    if (form.cognome.trim().length < 2) return setError('Inserisci il tuo cognome.');
    setStep(2);
    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (err) {}
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.consent) {
      return setError('Devi accettare l’informativa privacy e i termini di servizio.');
    }
    if (!form.healthConsent) {
      return setError('Devi acconsentire al trattamento dei dati relativi alla salute (art. 9 GDPR).');
    }
    setBusy(true);
    try {
      const user = await register({
        name: `${form.nome.trim()} ${form.cognome.trim()}`,
        email: form.email,
        password: form.password,
        role: 'therapist',
        consent: form.consent,
        healthConsent: form.healthConsent
      });
      // L'area principale scelta qui viene ripresa quando si completa il profilo.
      try { sessionStorage.setItem('ax_area_principale', form.specializzazione); } catch (err) {}
      try { track('sign_up', { method: 'email', role: user.role }); } catch (err) {}
      navigate('/area-terapeuta');
    } catch (err) {
      setError(err.response?.data?.error || t('common.error'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container section">
      <Seo
        title="Registrazione psicologi e psicoterapeuti online"
        description="Iscriviti alla piattaforma di psicologia online per professionisti: profilo pubblico, agenda, videochiamate e pagamenti gestiti. Iscrizione gratuita per il panel fondatore."
        path="/registrazione-professionista"
      />

      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <h1 style={{ marginTop: 0 }}>Registrazione psicologi e psicoterapeuti</h1>
        <p className="muted">
          Entra nel panel fondatore di Adatto x Te. Iscrizione gratuita, nessun costo di
          ingresso: ti occupi della parte clinica, della piattaforma ci pensiamo noi.
        </p>

        <div className="card form-card" style={{ marginTop: 24 }}>
          <p className="muted" style={{ marginTop: 0, fontSize: 14 }}>
            Passo {step} di 2
          </p>

          {step === 1 && (
            <form onSubmit={passaAlPasso2}>
              <h2 style={{ fontSize: 20, marginTop: 0 }}>Chi sei</h2>

              <label>Area principale *</label>
              <select
                value={form.specializzazione}
                onChange={(e) => set('specializzazione', e.target.value)}
                required
              >
                <option value="">Scegli la tua area</option>
                {SPECIALIZZAZIONI.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <label>Nome *</label>
              <input
                type="text"
                value={form.nome}
                onChange={(e) => set('nome', e.target.value)}
                required
                minLength={2}
              />

              <label>Cognome *</label>
              <input
                type="text"
                value={form.cognome}
                onChange={(e) => set('cognome', e.target.value)}
                required
                minLength={2}
              />

              {error && <p style={{ color: '#b00020' }}>{error}</p>}

              <button type="submit" className="btn btn-primary" style={{ marginTop: 16 }}>
                Continua
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <h2 style={{ fontSize: 20, marginTop: 0 }}>Crea le credenziali</h2>
              <p className="muted" style={{ fontSize: 14 }}>
                {form.specializzazione} — {form.nome} {form.cognome}
              </p>

              <label>Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                required
              />

              <label>Password * (almeno 8 caratteri)</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => set('password', e.target.value)}
                required
                minLength={8}
              />

              <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginTop: 12 }}>
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(e) => set('consent', e.target.checked)}
                />
                <span>Accetto l’informativa privacy e i termini di servizio.</span>
              </label>

              <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <input
                  type="checkbox"
                  checked={form.healthConsent}
                  onChange={(e) => set('healthConsent', e.target.checked)}
                />
                <span>Acconsento al trattamento dei dati relativi alla salute (art. 9 GDPR).</span>
              </label>

              {error && <p style={{ color: '#b00020' }}>{error}</p>}

              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <button
                  type="button"
                  className="btn"
                  onClick={() => { setStep(1); setError(''); }}
                >
                  Indietro
                </button>
                <button type="submit" className="btn btn-primary" disabled={busy}>
                  {busy ? 'Creazione…' : 'Crea il mio account'}
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="muted" style={{ marginTop: 16, fontSize: 14 }}>
          Hai già un account? <Link to="/accedi">Accedi</Link>.
        </p>

        <section style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 22 }}>Cosa ti diamo</h2>
          <ul>
            <li>Una pagina profilo pubblica, indicizzata e collegata ai tuoi profili (sito, Google, Trustpilot).</li>
            <li>Agenda, videochiamate, pagamenti e fatture gestiti dalla piattaforma.</li>
            <li>Pazienti italiani in Italia e in 43 paesi, senza che tu debba fare marketing.</li>
            <li>Autonomia piena sulle sedute: prezzi, disponibilità e approccio li decidi tu.</li>
          </ul>

          <h2 style={{ fontSize: 22, marginTop: 28 }}>Requisiti</h2>
          <ul>
            <li>Iscrizione all’Albo degli Psicologi in Italia.</li>
            <li>Specializzazione in psicoterapia (o percorsi in corso) per i percorsi clinici.</li>
            <li>Connessione stabile e uno spazio riservato per le sedute online.</li>
          </ul>

          <h2 style={{ fontSize: 22, marginTop: 28 }}>Domande frequenti</h2>
          {FAQ.map(([q, a]) => (
            <div key={q} style={{ marginBottom: 16 }}>
              <p style={{ fontWeight: 600, marginBottom: 4 }}>{q}</p>
              <p className="muted" style={{ marginTop: 0 }}>{a}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
