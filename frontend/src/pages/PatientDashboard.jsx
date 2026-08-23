import { useEffect, useState } from 'react';
import api from '../api';
import Messaging from '../components/Messaging';
import VideoRoom from '../components/VideoRoom';
import ReferralCard from '../components/ReferralCard';

const STATUS_LABEL = {
  pending: 'In attesa di conferma',
  confirmed: 'Confermata',
  completed: 'Completata',
  cancelled: 'Annullata',
};

export default function PatientDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [room, setRoom] = useState(null);
  const [chatPeer, setChatPeer] = useState(null);
  const [busyId, setBusyId] = useState(null);

  function load() {
    api
      .get('/bookings/my')
      .then((r) => setBookings(r.data.bookings))
      .catch(() => setError('Impossibile caricare le prenotazioni'))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function cancel(id) {
    setBusyId(id);
    try {
      await api.patch(`/bookings/${id}/status`, { status: 'cancelled' });
      load();
    } catch (e) {
      setError(e.response?.data?.error || 'Errore durante l’annullamento');
    } finally {
      setBusyId(null);
    }
  }

  const upcoming = bookings
    .filter((b) => b.status === 'pending' || b.status === 'confirmed')
    .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime));
  const past = bookings.filter((b) => b.status === 'completed' || b.status === 'cancelled');

  return (
    <div className="container section">
      <h1>La mia area</h1>

      {error && <p className="error-text">{error}</p>}
      {loading && <p className="muted">Caricamento…</p>}

      <ReferralCard />

      {!loading && upcoming.length === 0 && <p className="muted">Non hai sedute in programma. <a href="/terapeuti">Trova il tuo terapeuta</a>.</p>}

      <div className="booking-list">
        {upcoming.map((b) => (
          <div className="card booking-item" key={b.id}>
            <div className="booking-main">
              <h3>{b.therapistName}</h3>
              <p>
                {new Date(b.date + 'T00:00:00').toLocaleDateString('it-IT')} · {b.startTime}–{b.endTime} ·{' '}
                {b.type === 'couple' ? 'seduta di coppia' : 'seduta individuale'} · {b.price} €
              </p>
              <div className="tags">
                <span className={'tag status-' + b.status}>{STATUS_LABEL[b.status]}</span>
                {b.paid ? <span className="tag ok">Pagata</span> : <span className="tag">Da pagare</span>}
              </div>
            </div>
            <div className="booking-actions">
              {b.status === 'confirmed' && b.paid && (
                <button className="btn btn-primary" onClick={() => setRoom(b.roomName)}>
                  📹 Entra nella videochiamata
                </button>
              )}
              {b.status === 'pending' && (
                <p className="muted small">In attesa che il terapeuta confermi la seduta.</p>
              )}
              {b.status !== 'completed' && b.status !== 'cancelled' && (
                <button className="btn btn-outline btn-sm" disabled={busyId === b.id} onClick={() => cancel(b.id)}>
                  Annulla
                </button>
              )}
              <button className="btn btn-outline btn-sm" onClick={() => setChatPeer({ id: b.therapistId, name: b.therapistName })}>
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
            {past.map((b) => (
              <div className="card booking-item" key={b.id}>
                <div className="booking-main">
                  <h3>{b.therapistName}</h3>
                  <p>{new Date(b.date + 'T00:00:00').toLocaleDateString('it-IT')} · {b.startTime} · {b.type === 'couple' ? 'coppia' : 'individuale'} · {b.price} €</p>
                  <div className="tags">
                    <span className={'tag status-' + b.status}>{STATUS_LABEL[b.status]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <h2>Messaggi</h2>
      <div className="card">
        {chatPeer ? (
          <Messaging peerId={chatPeer.id} peerName={chatPeer.name} />
        ) : (
          <p className="muted">Seleziona “Messaggi” su una prenotazione per scrivere al terapeuta.</p>
        )}
      </div>

      {room && <VideoRoom roomName={room} onClose={() => setRoom(null)} />}
    </div>
  );
}
