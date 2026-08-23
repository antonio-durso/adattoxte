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

  if (!peerId) return <p className="muted">Seleziona una conversazione.</p>;

  return (
    <div className="messaging">
      <div className="messaging-header">{peerName}</div>
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
