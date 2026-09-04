import { useState } from 'react';
import axios from 'axios';

/**
 * InlineMessageForm — mini-form contatti compatto (nome + email + 2 righe di messaggio).
 * Invia a POST /api/contact (stesso endpoint del modulo contatti): i messaggi
 * arrivano tutti alla casella della piattaforma, con oggetto che identifica il ruolo.
 *
 * Props:
 *  - role:        'paziente' | 'psicologo' | 'giornalista' | 'altro' (default 'altro')
 *  - subject:     oggetto dell'email (default 'Messaggio dal sito')
 *  - buttonLabel: testo del pulsante che apre il form (se !alwaysOpen)
 *  - placeholder: testo guida del messaggio
 *  - alwaysOpen:  se true il form è sempre visibile (nessun toggle)
 */

const fieldStyle = {
  width: '100%',
  padding: '9px 11px',
  borderRadius: 8,
  border: '1px solid #cbd5e1',
  fontSize: 14,
  fontFamily: 'inherit',
  boxSizing: 'border-box',
  background: '#fff',
};

const buttonStyle = {
  background: '#286a8f',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  padding: '9px 14px',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
};

export default function InlineMessageForm({
  role = 'altro',
  subject,
  buttonLabel = 'Scrivi',
  placeholder = 'Scrivi qui il tuo messaggio…',
  alwaysOpen = false,
}) {
  const [open, setOpen] = useState(alwaysOpen);
  const [form, setForm] = useState({ name: '', email: '', message: '', __hp__: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | ok | error
  const [err, setErr] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (form.__hp__) return;
    setStatus('sending');
    setErr('');
    try {
      await axios.post('/api/contact', {
        name: form.name,
        email: form.email,
        role,
        subject: subject || 'Messaggio dal sito',
        message: form.message,
      });
      setStatus('ok');
      setForm({ name: '', email: '', message: '', __hp__: '' });
      setOpen(alwaysOpen);
    } catch (e2) {
      setStatus('error');
      setErr(
        (e2.response && e2.response.data && e2.response.data.error) ||
          'Errore di invio, riprova tra poco'
      );
    }
  };

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} style={{ ...buttonStyle, background: '#fff', color: '#286a8f', border: '1px solid #286a8f' }}>
        {buttonLabel}
      </button>
    );
  }

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 8 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8 }}>
        <input type="text" name="name" placeholder="Nome e cognome" aria-label="Nome e cognome" value={form.name} onChange={set('name')} required maxLength={120} style={fieldStyle} />
        <input type="email" name="email" placeholder="La tua email" aria-label="La tua email" value={form.email} onChange={set('email')} required maxLength={160} style={fieldStyle} />
      </div>
      <textarea
        name="message"
        placeholder={placeholder}
        aria-label="Messaggio"
        value={form.message}
        onChange={set('message')}
        required
        maxLength={2000}
        rows={2}
        style={{ ...fieldStyle, resize: 'vertical' }}
      />
      <input type="text" name="__hp__" value={form.__hp__} onChange={set('__hp__')} tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ display: 'none' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <button type="submit" disabled={status === 'sending'} style={buttonStyle}>
          {status === 'sending' ? 'Invio…' : 'Invia'}
        </button>
        {!alwaysOpen && (
          <button type="button" onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 13 }}>
            Annulla
          </button>
        )}
        {status === 'ok' && <span style={{ color: '#15803d', fontSize: 13 }}>Grazie! Ti rispondiamo al più presto.</span>}
        {status === 'error' && <span style={{ color: '#b91c1c', fontSize: 13 }}>{err}</span>}
      </div>
    </form>
  );
}
