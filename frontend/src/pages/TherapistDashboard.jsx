import { useEffect, useState } from 'react';
import api from '../api';
import Messaging from '../components/Messaging';
import VideoRoom from '../components/VideoRoom';

const STATUS_LABEL = {
  pending: 'In attesa di conferma',
  confirmed: 'Confermata',
  completed: 'Completata',
  cancelled: 'Annullata',
};

export default function TherapistDashboard() {
  const [sessions, setSessions] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chatPeer, setChatPeer] = useState(null);
  const [room, setRoom] = useState(null);

  function load() {
    api
      .get('/bookings/my-sessions')
      .then((r) => setSessions(r.data.bookings))
      .catch(() => setError('Impossibile caricare le sedute'))
      .finally(() => setLoading(false));
    api
      .get('/messages/conversations')
      .then((r) => setConversations(r.data.conversations))
      .catch(() => {});
    api
      .get('/therapists/earnings')
      .then((r) => setEarnings(r.data.earnings))
      .catch(() => {});
  }

  useEffect(load, []);

  async function setStatus(id, status) {
    try {
      await api.patch(`/bookings/${id}/status`, { status });
      load();
    } catch (e) {
      setError(e.response?.data?.error || 'Operazione non riuscita');
    }
  }

  const upcoming = sessions
    .filter((s) => s.status === 'pending' || s.status === 'confirmed')
    .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime));
  const past = sessions.filter((s) => s.status === 'completed' || s.status === 'cancelled');

  return (
    <div className="container section">
      <h1>La mia agenda</h1>
      {error && <p className="error-text">{error}</p>}
      {loading && <p className="muted">Caricamento…</p>}

      {earnings && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10, marginBottom: 24 }}>
          {[
            { label: 'Guadagnati (completate)', value: `${earnings.completed} €` },
            { label: 'Confermate', value: `${earnings.confirmed} €` },
            { label: 'In attesa', value: `${earnings.pending} €` },
            { label: 'Sedute completate', value: earnings.completedCount },
            { label: 'Prenotazioni totali', value: earnings.totalBookings },
          ].map((c) => (
            <div key={c.label} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: '12px 14px', background: '#fff' }}>
              <div className="stat-label">{c.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{c.value}</div>
            </div>
          ))}
        </div>
      )}

      <h2>Sedute in programma</h2>
      {!loading && upcoming.length === 0 && <p className="muted">Nessuna seduta in programma.</p>}
      <div className="booking-list">
        {upcoming.map((s) => (
          <div className="card booking-item" key={s.id}>
            <div className="booking-main">
              <h3>{s.patientName}</h3>
              <p>
                {new Date(s.date + 'T00:00:00').toLocaleDateString('it-IT')} · {s.startTime}–{s.endTime} ·{' '}
                {s.type === 'couple' ? 'coppia' : 'individuale'} · {s.price} €
              </p>
              <div className="tags">
                <span className={'tag status-' + s.status}>{STATUS_LABEL[s.status]}</span>
                {s.paid ? <span className="tag ok">Pagata</span> : <span className="tag">Da pagare</span>}
              </div>
            </div>
            <div className="booking-actions">
              {s.status === 'pending' && (
                <button className="btn btn-primary btn-sm" onClick={() => setStatus(s.id, 'confirmed')}>
                  Conferma
                </button>
              )}
              {s.status === 'confirmed' && (
                <>
                  {s.paid && (
                    <button className="btn btn-primary btn-sm" onClick={() => setRoom(s.roomName)}>
                      📹 Entra in sala
                    </button>
                  )}
                  <button className="btn btn-outline btn-sm" onClick={() => setStatus(s.id, 'completed')}>
                    Completa seduta
                  </button>
                </>
              )}
              {(s.status === 'pending' || s.status === 'confirmed') && (
                <button className="btn btn-outline btn-sm" onClick={() => setStatus(s.id, 'cancelled')}>
                  Annulla
                </button>
              )}
              <button className="btn btn-outline btn-sm" onClick={() => setChatPeer({ id: s.patientId, name: s.patientName })}>
                💬 Messaggi
              </button>
            </div>
          </div>
        ))}
      </div>

      {past.length > 0 && (
        <>
          <h2>Storico</h2>
          <div className="booking-list">
            {past.map((s) => (
              <div className="card booking-item" key={s.id}>
                <div className="booking-main">
                  <h3>{s.patientName}</h3>
                  <p>{new Date(s.date + 'T00:00:00').toLocaleDateString('it-IT')} · {s.startTime} · {s.type === 'couple' ? 'coppia' : 'individuale'} · {s.price} €</p>
                  <div className="tags">
                    <span className={'tag status-' + s.status}>{STATUS_LABEL[s.status]}</span>
                    {s.myRating ? <span className="tag ok">★ {s.myRating} dal paziente</span> : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <h2>Conversazioni</h2>
      <div className="conversation-list card">
        {conversations.length === 0 && <p className="muted">Nessuna conversazione attiva.</p>}
        {conversations.map((c) => (
          <button key={c.peerId} className="conversation-item" onClick={() => setChatPeer({ id: c.peerId, name: c.peerName })}>
            <strong>{c.peerName}</strong>
            <span className="muted small">{c.lastMessage}</span>
            {c.unread > 0 && <span className="badge">nuovo</span>}
          </button>
        ))}
      </div>

      <h2>Messaggi</h2>
      <div className="card">
        {chatPeer ? (
          <Messaging peerId={chatPeer.id} peerName={chatPeer.name} />
        ) : (
          <p className="muted">Seleziona una conversazione per rispondere.</p>
        )}
      </div>

      {room && <VideoRoom roomName={room} onClose={() => setRoom(null)} />}
    </div>
  );
}
