import { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

function Stars({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 6, fontSize: 26 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange && onChange(n)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 26,
            cursor: 'pointer',
            color: n <= (value || 0) ? '#f59e0b' : '#d1d5db',
          }}
          aria-label={`${n} stelle`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function PatientDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [room, setRoom] = useState(null);
  const [chatPeer, setChatPeer] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [ratingFor, setRatingFor] = useState(null);
  const [ratingScore, setRatingScore] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [ratingBusy, setRatingBusy] = useState(false);
  const [ratingMsg, setRatingMsg] = useState('');

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

  async function submitRating(bookingId) {
    if (ratingScore < 1) return;
    setRatingBusy(true);
    setRatingMsg('');
    try {
      await api.post('/ratings', { booking_id: bookingId, score: ratingScore, comment: ratingComment });
      setRatingFor(null);
      setRatingScore(0);
      setRatingComment('');
      setRatingMsg('Grazie! La tua valutazione è stata pubblicata.');
      load();
    } catch (e) {
      setRatingMsg(e.response?.data?.error || 'Errore durante l’invio della valutazione');
    } finally {
      setRatingBusy(false);
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
                {b.packageSessions === 3 && <span className="tag">🎁 Pacchetto 3 sedute</span>}
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
              <Link to={`/ricevuta/${b.id}`} className="btn btn-outline btn-sm">
                🧾 Ricevuta
              </Link>
            </div>
          </div>
        ))}
      </div>

      {past.length > 0 && (
        <>
          <h2>Storico</h2>
          <div className="booking-list">
            {past.map((b) => (
              <Fragment key={b.id}>
              <div className="card booking-item">
                <div className="booking-main">
                  <h3>{b.therapistName}</h3>
                  <p>{new Date(b.date + 'T00:00:00').toLocaleDateString('it-IT')} · {b.startTime} · {b.type === 'couple' ? 'coppia' : 'individuale'} · {b.price} €</p>
                  <div className="tags">
                    <span className={'tag status-' + b.status}>{STATUS_LABEL[b.status]}</span>
                {b.packageSessions === 3 && <span className="tag">🎁 Pacchetto 3 sedute</span>}
                    {b.myRating ? <span className="tag ok">Valutata ★ {b.myRating}</span> : null}
                  </div>
                </div>
                <div className="booking-actions">
                  {b.status === 'completed' && (
                    b.myRating ? (
                      <span className="muted small">Grazie per la valutazione</span>
                    ) : (
                      <button className="btn btn-primary btn-sm" onClick={() => { setRatingFor(b.id); setRatingScore(0); setRatingComment(''); setRatingMsg(''); }}>
                        ★ Valuta la seduta
                      </button>
                    )
                  )}
                  <Link to={`/ricevuta/${b.id}`} className="btn btn-outline btn-sm">
                    🧾 Ricevuta
                  </Link>
                </div>
              </div>
              {ratingFor === b.id && (
                <div className="card" style={{ marginTop: 10, background: '#f8fafc' }}>
                  <h4>Come è andata la seduta?</h4>
                  <Stars value={ratingScore} onChange={setRatingScore} />
                  <textarea
                    rows={3}
                    placeholder="Lascia un commento (facoltativo)…"
                    value={ratingComment}
                    onChange={(e) => setRatingComment(e.target.value)}
                    style={{ width: '100%', marginTop: 10, padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                  />
                  {ratingMsg && <p className={ratingMsg.startsWith('Grazie') ? 'muted small' : 'error-text'}>{ratingMsg}</p>}
                  <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                    <button className="btn btn-primary btn-sm" disabled={ratingBusy || ratingScore < 1} onClick={() => submitRating(b.id)}>
                      {ratingBusy ? 'Invio…' : 'Pubblica valutazione'}
                    </button>
                    <button className="btn btn-outline btn-sm" onClick={() => setRatingFor(null)}>Annulla</button>
                  </div>
                </div>
              )}
              </Fragment>
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
