/**
 * ProfiloProfessionistaForm — il professionista completa la propria scheda.
 *
 * Regola: la pubblicazione e' una SCELTA esplicita e richiede un profilo completo.
 * Finche' non e' completo, la scheda pubblica non si crea — quindi i profili
 * presenti solo nel database non finiscono mai online per inerzia.
 */
import { useEffect, useState } from 'react';
import api from '../api';

const AREE = [
  'Ansia', 'Depressione', 'Terapia di coppia', 'Disturbi alimentari',
  'Disturbi del sonno', 'Lutto', 'Trauma', 'Dipendenze',
  'Stress e burnout', 'Autostima', 'Età evolutiva', 'Adolescenti',
  'Psicologia dello sport', 'Preparazione concorsi', 'Psicologia giuridica'
];

const LINGUE = [
  ['it', 'Italiano'], ['en', 'Inglese'], ['fr', 'Francese'], ['es', 'Spagnolo'],
  ['de', 'Tedesco'], ['pt', 'Portoghese']
];

const LINK_ESTERNI = [
  ['website', 'Sito personale'],
  ['google', 'Google Business Profile'],
  ['trustpilot', 'Trustpilot'],
  ['linkedin', 'LinkedIn']
];

const VUOTO = {
  city: '',
  license: '',
  specialties: [],
  languages: ['it'],
  photoUrl: '',
  priceIndividual: 45,
  priceCouple: 50,
  experienceYears: 0,
  bio: '',
  sameAs: {},
  accettaRichieste: false
};

export default function ProfiloProfessionistaForm() {
  const [form, setForm] = useState(VUOTO);
  const [stato, setStato] = useState({ published: false, publicSlug: '', campiMancanti: [] });
  const [msg, setMsg] = useState('');
  const [errore, setErrore] = useState('');
  const [busy, setBusy] = useState(false);
  const [statoFoto, setStatoFoto] = useState('');

  useEffect(() => {
    api.get('/therapists/me')
      .then((r) => {
        const p = r.data.profile || {};
        setForm({
          city: p.city || '',
          license: p.license || '',
          specialties: p.specialties || [],
          languages: p.languages && p.languages.length ? p.languages : ['it'],
          photoUrl: p.photoUrl || '',
          priceIndividual: p.priceIndividual ?? 45,
          priceCouple: p.priceCouple ?? 50,
          experienceYears: p.experienceYears ?? 0,
          bio: p.bio || '',
          sameAs: p.sameAs || {},
          accettaRichieste: !!p.accettaRichieste
        });
        setStato({
          published: !!p.published,
          publicSlug: p.publicSlug || '',
          campiMancanti: p.campiMancanti || []
        });
      })
      .catch(() => setErrore('Non riesco a caricare il profilo.'));
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setLink = (k, v) => setForm((f) => ({ ...f, sameAs: { ...f.sameAs, [k]: v } }));
  const toggleIn = (k, v) => {
    const lista = form[k];
    set(k, lista.includes(v) ? lista.filter((x) => x !== v) : [...lista, v]);
  };

  // La foto viene ridimensionata QUI nel browser (max 500 px) prima di essere
  // inviata: quindi viaggiano poche decine di KB invece di megabyte.
  async function caricaFoto(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setStatoFoto('Preparo l’immagine...');
    try {
      const ridimensionata = await new Promise((resolve, reject) => {
        const lettore = new FileReader();
        lettore.onerror = () => reject(new Error('lettura'));
        lettore.onload = () => {
          const img = new Image();
          img.onerror = () => reject(new Error('immagine'));
          img.onload = () => {
            const lato = 500;
            const scala = Math.min(1, lato / Math.max(img.width, img.height));
            const c = document.createElement('canvas');
            c.width = Math.round(img.width * scala);
            c.height = Math.round(img.height * scala);
            c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
            resolve(c.toDataURL('image/jpeg', 0.82));
          };
          img.src = lettore.result;
        };
        lettore.readAsDataURL(file);
      });

      const r = await api.post('/therapists/me/photo', { data: ridimensionata });
      set('photoUrl', r.data.url);
      setStatoFoto('Foto caricata.');
    } catch (err) {
      setStatoFoto((err.response && err.response.data && err.response.data.error) || 'Non sono riuscito a caricare la foto.');
    }
  }

  async function salva(published) {
    setBusy(true); setMsg(''); setErrore('');
    try {
      const r = await api.put('/therapists/me', { ...form, published });
      setStato({
        published: !!r.data.published,
        publicSlug: r.data.publicSlug || stato.publicSlug,
        campiMancanti: r.data.campiMancanti || []
      });
      setMsg(published ? 'Profilo pubblicato.' : 'Profilo salvato.');
    } catch (e) {
      setErrore(e.response?.data?.error || 'Salvataggio non riuscito.');
    } finally {
      setBusy(false);
    }
  }

  const completo = stato.campiMancanti.length === 0;

  return (
    <section className="card" style={{ marginTop: 24 }}>
      <h2 style={{ marginTop: 0 }}>Il mio profilo</h2>
      <p className="muted" style={{ marginTop: 0, fontSize: 14 }}>
        Questi dati compongono la tua scheda pubblica. Il profilo va online
        <strong> solo quando lo pubblichi tu</strong> e solo se è completo.
      </p>

      {!completo && (
        <p style={{ background: '#fff6e5', border: '1px solid #f0c78a', padding: '10px 12px', borderRadius: 8, fontSize: 14 }}>
          Per pubblicare manca ancora: <strong>{stato.campiMancanti.join(', ')}</strong>
        </p>
      )}

      {stato.published && stato.publicSlug && (
        <p style={{ fontSize: 14 }}>
          La tua scheda è online su <code>/professionisti/{stato.publicSlug}</code>
        </p>
      )}

      <h3 style={{ fontSize: 16 }}>Dove ricevi</h3>
      <label>Città</label>
      <input type="text" value={form.city} onChange={(e) => set('city', e.target.value)} />

      <label>Numero di iscrizione all’Albo</label>
      <input type="text" value={form.license} onChange={(e) => set('license', e.target.value)} />

      <label>Anni di esperienza</label>
      <input type="number" min="0" value={form.experienceYears}
        onChange={(e) => set('experienceYears', e.target.value)} />

      <h3 style={{ fontSize: 16, marginTop: 20 }}>Di cosa ti occupi</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
        {AREE.map((a) => (
          <button key={a} type="button"
            className={form.specialties.includes(a) ? 'btn btn-primary' : 'btn'}
            style={{ fontSize: 13, padding: '6px 10px' }}
            onClick={() => toggleIn('specialties', a)}>
            {a}
          </button>
        ))}
      </div>

      <label>Lingue in cui lavori</label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
        {LINGUE.map(([cod, nome]) => (
          <button key={cod} type="button"
            className={form.languages.includes(cod) ? 'btn btn-primary' : 'btn'}
            style={{ fontSize: 13, padding: '6px 10px' }}
            onClick={() => toggleIn('languages', cod)}>
            {nome}
          </button>
        ))}
      </div>

      <h3 style={{ fontSize: 16, marginTop: 20 }}>Presentazione</h3>
      <label>Biografia (almeno 100 caratteri)</label>
      <textarea rows={6} value={form.bio} onChange={(e) => set('bio', e.target.value)} />
      <p className="muted" style={{ fontSize: 13 }}>{form.bio.length} caratteri</p>

      <label>Foto (indirizzo dell’immagine)</label>
      <input type="file" accept="image/*" onChange={caricaFoto} />
      {statoFoto && <p className="muted" style={{ fontSize: 13, margin: '6px 0' }}>{statoFoto}</p>}
      {form.photoUrl ? (
        <img src={form.photoUrl} alt="Anteprima" width="96" height="96"
          style={{ borderRadius: 10, objectFit: 'cover', display: 'block', margin: '8px 0' }} />
      ) : null}
      <label>…oppure incolla l’indirizzo di una foto già online</label>
      <input type="text" value={form.photoUrl} onChange={(e) => set('photoUrl', e.target.value)} />

      <h3 style={{ fontSize: 16, marginTop: 20 }}>Tariffe</h3>
      <label>Seduta individuale (€)</label>
      <input type="number" min="0" value={form.priceIndividual}
        onChange={(e) => set('priceIndividual', e.target.value)} />
      <label>Seduta di coppia (€)</label>
      <input type="number" min="0" value={form.priceCouple}
        onChange={(e) => set('priceCouple', e.target.value)} />

      <h3 style={{ fontSize: 16, marginTop: 20 }}>I tuoi profili esterni</h3>
      <p className="muted" style={{ marginTop: 0, fontSize: 13 }}>
        Colleghiamo la tua scheda ai profili che già hai: aiuta i motori di ricerca
        a capire che sei la stessa persona.
      </p>
      {LINK_ESTERNI.map(([k, etichetta]) => (
        <div key={k}>
          <label>{etichetta}</label>
          <input type="text" value={form.sameAs[k] || ''} onChange={(e) => setLink(k, e.target.value)} />
        </div>
      ))}

      {msg && <p style={{ color: '#1a7f37' }}>{msg}</p>}
      {errore && <p style={{ color: '#b00020' }}>{errore}</p>}


      <h3 style={{ fontSize: 16, marginTop: 20 }}>Prenotazioni</h3>
      <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        <input type="checkbox" checked={!!form.accettaRichieste}
          onChange={(e) => set('accettaRichieste', e.target.checked)} />
        <span>
          <strong>Accetto richieste di prenotazione.</strong> Se lo attivi, i pazienti
          possono prenotare e pagare le sedute. Se resta spento, la tua scheda è online
          e trovabile su Google, ma nessuno può ancora prenotarti.
        </span>
      </label>
      <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
        <button type="button" className="btn" disabled={busy} onClick={() => salva(undefined)}>
          {busy ? 'Salvo…' : 'Salva'}
        </button>
        <button type="button" className="btn btn-primary" disabled={busy || !completo}
          onClick={() => salva(true)}>
          {stato.published ? 'Ripubblica' : 'Pubblica il profilo'}
        </button>
        {stato.published && (
          <button type="button" className="btn" disabled={busy} onClick={() => salva(false)}>
            Metti offline
          </button>
        )}
      </div>
    </section>
  );
}
