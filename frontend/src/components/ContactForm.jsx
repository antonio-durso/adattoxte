import { useState } from 'react';
import axios from 'axios';
import { useI18n } from '../i18n';

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid #cbd5e1',
  fontSize: 14,
  fontFamily: 'inherit',
  boxSizing: 'border-box',
  background: '#fff',
};

export default function ContactForm() {
  const { t } = useI18n();
  const [form, setForm] = useState({
    name: '', email: '', role: 'altro', subject: '', message: '', __hp__: '',
  });
  const [status, setStatus] = useState('idle'); // idle | sending | ok | error
  const [err, setErr] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (form.__hp__) return; // honeypot anti-bot
    setStatus('sending');
    setErr('');
    try {
      await axios.post('/api/contact', form);
      setStatus('ok');
      setForm({ name: '', email: '', role: 'altro', subject: '', message: '', __hp__: '' });
    } catch (e2) {
      setStatus('error');
      setErr(
        (e2.response && e2.response.data && e2.response.data.error) ||
          'Errore di invio, riprova tra poco'
      );
    }
  };

  return (
    <form className="contact-form" onSubmit={submit} style={{ maxWidth: 560, margin: '0 auto', display: 'grid', gap: 10, textAlign: 'left' }}>
      <input type="text" name="name" placeholder={t('contact.name')} aria-label={t('contact.name')} value={form.name} onChange={set('name')} required maxLength={120} style={inputStyle} />
      <input type="email" name="email" placeholder={t('contact.email')} aria-label={t('contact.email')} value={form.email} onChange={set('email')} required maxLength={160} style={inputStyle} />
      <select name="role" value={form.role} onChange={set('role')} aria-label={t('contact.role')} style={inputStyle}>
        <option value="altro">{t('contact.roleOther')}</option>
        <option value="paziente">{t('contact.rolePatient')}</option>
        <option value="psicologo">{t('contact.rolePsy')}</option>
        <option value="giornalista">{t('contact.roleJournalist')}</option>
      </select>
      <input type="text" name="subject" placeholder={t('contact.subject')} aria-label={t('contact.subject')} value={form.subject} onChange={set('subject')} maxLength={200} style={inputStyle} />
      <textarea name="message" placeholder={t('contact.message')} aria-label={t('contact.message')} value={form.message} onChange={set('message')} required maxLength={5000} rows={5} style={{ ...inputStyle, resize: 'vertical' }} />
      {/* Honeypot anti-bot: invisibile agli utenti, i bot lo compilano */}
      <input type="text" name="__hp__" value={form.__hp__} onChange={set('__hp__')} tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ display: 'none' }} />
      <button type="submit" className="btn btn-primary" disabled={status === 'sending'} style={{ justifySelf: 'center', marginTop: 6 }}>
        {status === 'sending' ? t('contact.sending') : t('contact.send')}
      </button>
      {status === 'ok' && <p className="contact-status ok" style={{ textAlign: 'center', color: '#15803d', margin: 0 }}>{t('contact.ok')}</p>}
      {status === 'error' && <p className="contact-status err" style={{ textAlign: 'center', color: '#b91c1c', margin: 0 }}>{err}</p>}
    </form>
  );
}
