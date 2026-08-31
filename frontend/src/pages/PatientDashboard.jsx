import { Fragment, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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

function daysUntil(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr + 'T00:00:00');
  return Math.round((d - today) / 86400000);
}

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
  const [searchParams] = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState(''); // 'ok' | 'ko' | ''
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [room, setRoom] = useState(null);
  const [chatPeer, setChatPeer] = useState(null);
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [diaryLoading, setDiaryLoading] = useState(true);
  const [diaryFormOpen, setDiaryFormOpen] = useState(false);
  const [diaryEdit, setDiaryEdit] = useState(null);
  const [diaryTitle, setDiaryTitle] = useState('');
  const [diaryContent, setDiaryContent] = useState('');
  const [diaryMood, setDiaryMood] = useState('');
  const [diaryBusy, setDiaryBusy] = useState(false);
  const [diaryMsg, setDiaryMsg] = useState('');
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

  // Al ritorno da PayPal (?paid=1&token=...), conferma l'addebito e segna la seduta pagata
  useEffect(() => {
    const paid = searchParams.get('paid');
    const token = searchParams.get('token');
    if (paid === '1' && token) {
      api
        .post('/payments/capture', { orderId: token })
        .then((r) => setPaymentStatus(r.data.paid ? 'ok' : 'ko'))
        .catch(() => setPaymentStatus('ko'));
    } else if (paid === '1') {
      setPaymentStatus('ok');
    }
  }, [searchParams]);

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

  // Diario personale
  useEffect(() => {
    api
      .get('/diary')
      .then((r) => setDiaryEntries(r.data.entries || []))
      .catch(() => {})
      .finally(() => setDiaryLoading(false));
  }, []);

  function saveDiary() {
    setDiaryBusy(true);
    setDiaryMsg('');
    const payload = { title: diaryTitle, content: diaryContent, mood: diaryMood };
    const req = diaryEdit ? api.patch('/diary/' + diaryEdit, payload) : api.post('/diary', payload);
    req
      .then((r) => {
        const saved = r.data.entry;
        setDiaryEntries((prev) => (diaryEdit ? prev.map((x) => (x.id === saved.id ? saved : x)) : [saved, ...prev]));
        setDiaryFormOpen(false);
        setDiaryEdit(null);
        setDiaryTitle('');
        setDiaryContent('');
        setDiaryMood('');
      })
      .catch(() => setDiaryMsg('Errore durante il salvataggio'))
      .finally(() => setDiaryBusy(false));
  }

  function startEditDiary(e) {
    setDiaryEdit(e.id);
    setDiaryTitle(e.title || '');
    setDiaryContent(e.content);
    setDiaryMood(e.mood || '');
    setDiaryFormOpen(true);
    setDiaryMsg('');
  }

  function deleteDiary(id) {
    if (!window.confirm('Eliminare questa voce del diario?')) return;
    api
      .delete('/diary/' + id)
      .then(() => setDiaryEntries((prev) => prev.filter((x) => x.id !== id)))
      .catch(() => setDiaryMsg('Errore durante l\'eliminazione'));
  }

  const upcoming = bookings
    .filter((b) => b.status === 'pending' || b.status === 'confirmed')
    .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime));
  const past = bookings.filter((b) => b.status === 'completed' || b.status === 'cancelled');
  const unratedCompleted = past.filter((b) => b.status === 'completed' && !b.myRating);
  const nextSession = upcoming[0];

  return (
    <div className="container section">
      <h1>La mia area</h1>

      {/* E5: numeri di emergenza sempre visibili nell'area paziente */}
      <div className="card" style={{ marginBottom: 20, padding: '12px 16px', background: '#fff7ed', border: '2px solid #f97316' }}>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: '#431407' }}>
          <strong>⚕️ Questo servizio non è un servizio di emergenza.</strong> Se hai pensieri di farti del male o
          stai vivendo una situazione di pericolo, chiama subito{' '}
          <a href="tel:112" style={{ color: '#b91c1c', fontWeight: 700 }}>112</a> /{' '}
          <a href="tel:118" style={{ color: '#b91c1c', fontWeight: 700 }}>118</a> (24h) ·{' '}
          <a href="tel:1522" style={{ color: '#b91c1c', fontWeight: 700 }}>1522</a> anti-violenza (24h) ·{' '}
          <a href="tel:0223272327" style={{ color: '#b91c1c', fontWeight: 700 }}>02 2327 2327</a> Telefono Amico
          (9-24) · oppure rivolgiti al Pronto Soccorso più vicino.
        </p>
      </div>

      {paymentStatus === 'ok' && (
        <div className="card" style={{ marginBottom: 20, padding: 16, background: '#ecfdf5', border: '2px solid #10b981' }}>
          <p style={{ margin: 0 }} className="ok-text">✅ Pagamento confermato. La tua seduta è registrata come pagata.</p>
        </div>
      )}
      {paymentStatus === 'ko' && (
        <div className="card" style={{ marginBottom: 20, padding: 16, background: '#fffbeb', border: '2px solid #f59e0b' }}>
          <p style={{ margin: 0 }}>⚠️ Il pagamento risulta ancora in corso. Se vedi l’addebito su PayPal, ricarica tra poco; altrimenti usa “Paga ora” sulla prenotazione.</p>
        </div>
      )}
      {searchParams.get('paid') === '0' && (
        <div className="card" style={{ marginBottom: 20, padding: 16, background: '#f8fafc', border: '2px solid #cbd5e1' }}>
          <p style={{ margin: 0 }} className="muted">Pagamento annullato: nessun addebito. Puoi pagare quando vuoi dalla tua prenotazione.</p>
        </div>
      )}

      {error && <p className="error-text">{error}</p>}
      {loading && <p className="muted">Caricamento…</p>}

      <ReferralCard />

      {!loading && nextSession && (
        <div className="card" style={{ marginBottom: 20, padding: 16, borderLeft: '4px solid #48A8D8' }}>
          <p className="muted small" style={{ margin: 0, letterSpacing: 1 }}>📅 PROSSIMA SEDUTA</p>
          <p style={{ margin: '6px 0 0' }}>
            <strong>{nextSession.therapistName}</strong> · {new Date(nextSession.date + 'T00:00:00').toLocaleDateString('it-IT')} · {nextSession.startTime}
          </p>
          <p className="muted small" style={{ margin: '4px 0 0' }}>
            {daysUntil(nextSession.date) === 0
              ? 'Oggi! Preparati e collega la videochiamata al momento della seduta.'
              : daysUntil(nextSession.date) === 1
                ? 'Domani: ti aspettiamo.'
                : `Tra ${daysUntil(nextSession.date)} giorni.`}
          </p>
        </div>
      )}

      {!loading && unratedCompleted.length > 0 && (
        <div className="card" style={{ marginBottom: 20, padding: 18, background: '#eef2ff', border: '2px solid #4f46e5' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <h3 style={{ margin: 0 }}>Come è andata la seduta? ⭐</h3>
              <p className="muted small" style={{ margin: '4px 0 0' }}>
                La tua valutazione aiuta altri pazienti e i nostri terapeuti a migliorare. Bastano 30 secondi.
              </p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => {
                const b = unratedCompleted[0];
                setRatingFor(b.id);
                setRatingScore(0);
                setRatingComment('');
                setRatingMsg('');
                setTimeout(() => document.getElementById('rating-' + b.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
              }}
            >
              ★ Valuta ora
            </button>
          </div>
        </div>
      )}

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
              {!b.paid && (b.status === 'pending' || b.status === 'confirmed') && (
                <Link to={`/pagamento/${b.id}`} className="btn btn-primary btn-sm">
                  💳 Paga ora
                </Link>
              )}
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
                <div id={'rating-' + b.id} className="card" style={{ marginTop: 10, background: '#f8fafc' }}>
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
                  <p className="muted small" style={{ marginTop: 10, marginBottom: 0 }}>
                    Vuoi aiutare altri pazienti a scegliere con fiducia?{' '}
                    <a href="https://it.trustpilot.com/evaluate/adattoxte.com" target="_blank" rel="noopener noreferrer">
                      Lascia una recensione pubblica su Trustpilot
                    </a>
                    .
                  </p>
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

      <h2>Diario</h2>
      <div className="card" style={{ marginBottom: 12 }}>
        <p className="muted small" style={{ marginBottom: 10 }}>
          Il tuo diario personale — privato, solo tu puoi leggerlo. Traccia pensieri, emozioni e progressi tra una seduta e l'altra.
        </p>
        {!diaryFormOpen ? (
          <button
            className="btn btn-primary btn-sm"
            onClick={() => { setDiaryFormOpen(true); setDiaryEdit(null); setDiaryTitle(''); setDiaryContent(''); setDiaryMood(''); setDiaryMsg(''); }}
          >
            + Nuova voce
          </button>
        ) : (
          <div>
            <input
              value={diaryTitle}
              onChange={(e) => setDiaryTitle(e.target.value)}
              placeholder="Titolo (facoltativo)"
              style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb', marginBottom: 8 }}
            />
            <textarea
              rows={4}
              value={diaryContent}
              onChange={(e) => setDiaryContent(e.target.value)}
              placeholder="Come ti senti oggi?…"
              style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb', marginBottom: 8 }}
            />
            <select
              value={diaryMood}
              onChange={(e) => setDiaryMood(e.target.value)}
              style={{ padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
            >
              <option value="">Come ti senti?</option>
              <option value="🟢">🟢 Bene</option>
              <option value="🟡">🟡 Così così</option>
              <option value="🟠">🟠 Ansioso/a</option>
              <option value="🔴">🔴 Giù</option>
            </select>
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button className="btn btn-primary btn-sm" disabled={diaryBusy || !diaryContent.trim()} onClick={saveDiary}>
                {diaryBusy ? 'Salvataggio…' : diaryEdit ? 'Salva modifiche' : 'Salva'}
              </button>
              <button className="btn btn-outline btn-sm" onClick={() => { setDiaryFormOpen(false); setDiaryEdit(null); }}>Annulla</button>
            </div>
            {diaryMsg && <p className={diaryMsg.startsWith('Errore') ? 'error-text' : 'muted small'} style={{ marginTop: 8 }}>{diaryMsg}</p>}
          </div>
        )}
      </div>
      <div className="booking-list">
        {diaryLoading && <p className="muted">Caricamento…</p>}
        {!diaryLoading && diaryEntries.length === 0 && (
          <p className="muted">Il diario è vuoto: scrivi la tua prima voce.</p>
        )}
        {diaryEntries.map((e) => (
          <div key={e.id} className="card booking-item" style={{ marginBottom: 10 }}>
            <div className="booking-main">
              <h3 style={{ margin: 0 }}>{e.mood ? e.mood + ' ' : ''}{e.title || 'Senza titolo'}</h3>
              <p className="muted small" style={{ margin: '4px 0 8px' }}>
                {new Date(e.created_at.replace(' ', 'T') + 'Z').toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{e.content}</p>
            </div>
            <div className="booking-actions">
              <button className="btn btn-outline btn-sm" onClick={() => startEditDiary(e)}>Modifica</button>
              <button className="btn btn-outline btn-sm" onClick={() => deleteDiary(e.id)} aria-label="Elimina voce">🗑</button>
            </div>
          </div>
        ))}
      </div>

      {room && <VideoRoom roomName={room} onClose={() => setRoom(null)} />}
    </div>
  );
}
