import { useEffect, useRef, useState } from 'react';
import api from '../api';

export default function Messaging({ peerId, peerName }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    if (!peerId) return;
    setLoading(true);
    api
      .get(`/messages/conversations/${peerId}`)
      .then((r) => setMessages(r.data.messages))
      .catch(() => setError('Impossibile caricare i messaggi'))
      .finally(() => setLoading(false));
  }, [peerId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function send(e) {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const r = await api.post('/messages', { recipientId: peerId, content: text });
      setMessages((m) => [...m, r.data.message]);
      setText('');
    } catch (err) {
      setError(err.response?.data?.error || 'Invio non riuscito');
    }
  }

  async function exportConversation() {
    try {
      const r = await api.get('/messages/export');
      const blob = new Blob([JSON.stringify(r.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'adattoxte-messaggi.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError('Esportazione non riuscita. Riprova.');
    }
  }

  async function deleteConversation() {
    if (!window.confirm('Vuoi eliminare questa conversazione? L\'operazione è definitiva (diritto all\'oblio, art. 17 GDPR).')) return;
    try {
      await api.delete(`/messages/conversations/${peerId}`);
      setMessages([]);
    } catch (e) {
      setError(e.response?.data?.error || 'Cancellazione non riuscita');
    }
  }

  if (!peerId) return <p className="muted">Seleziona una conversazione.</p>;

  return (
    <div className="messaging">
      <div className="messaging-header">
        <span>{peerName}</span>
        <span style={{ display: 'inline-flex', gap: 8 }}>
          <button className="btn btn-outline btn-sm" onClick={exportConversation} aria-label="Esporta i messaggi (art. 20 GDPR)">
            ⬇️ Esporta
          </button>
          <button className="btn btn-outline btn-sm" onClick={deleteConversation} aria-label="Elimina la conversazione (art. 17 GDPR)">
            🗑️ Elimina
          </button>
        </span>
      </div>
      <div className="messaging-body">
        {loading && <p className="muted">Caricamento…</p>}
        {error && <p className="error-text">{error}</p>}
        {!loading &&
          messages.map((m) => (
            <div key={m.id} className={m.senderId === peerId ? 'msg incoming' : 'msg outgoing'}>
              <div className="msg-bubble">{m.content}</div>
              <div className="msg-time">{new Date(m.createdAt).toLocaleString('it-IT')}</div>
            </div>
          ))}
        {!loading && messages.length === 0 && <p className="muted">Nessun messaggio. Inizia la conversazione!</p>}
        <div ref={endRef} />
      </div>
      <form className="messaging-input" onSubmit={send}>
        <input type="text" placeholder="Scrivi un messaggio…" value={text} onChange={(e) => setText(e.target.value)} maxLength={2000} />
        <button className="btn btn-primary" disabled={!text.trim()}>Invia</button>
      </form>
    </div>
  );
}
