import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../i18n';

function nextDays(count = 7) {
  const days = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    days.push(d);
  }
  return days;
}

const fmt = (d) => d.toISOString().slice(0, 10);
const label = (d) =>
  d.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' });

export default function TherapistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useI18n();

  const [therapist, setTherapist] = useState(null);
  const [slots, setSlots] = useState([]);
  const [date, setDate] = useState(() => fmt(new Date()));
  const [selectedSlot, setSelectedSlot] = useState('');
  const [type, setType] = useState('individual');
  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [booking, setBooking] = useState(false);
  const [reviews, setReviews] = useState([]);

  const days = useMemo(nextDays, []);

  useEffect(() => {
    api
      .get(`/therapists/${id}`)
      .then((r) => setTherapist(r.data.therapist))
      .catch(() => setError(t('common.error')))
      .finally(() => setLoading(false));
    api
      .get(`/ratings/therapist/${id}`)
      .then((r) => setReviews(r.data.ratings || []))
      .catch(() => setReviews([]));
  }, [id, t]);

  useEffect(() => {
    if (!date) return;
    setLoadingSlots(true);
    setSelectedSlot('');
    api
      .get(`/therapists/${id}/availability?date=${date}`)
      .then((r) => setSlots(r.data.slots))
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [id, date]);

  const price = therapist ? (type === 'couple' ? therapist.priceCouple : therapist.priceIndividual) : 0;
  const availableSlots = slots.filter((s) => s.available);

  async function handleBook() {
    if (!user) {
      navigate('/accedi', { state: { from: `/terapeuti/${id}` } });
      return;
    }
    if (user.role !== 'patient') {
      setError('La prenotazione è riservata agli utenti paziente.');
      return;
    }
    if (!selectedSlot || !date) return;
    setBooking(true);
    setError('');
    try {
      const startTime = slots.find((s) => s.id === selectedSlot)?.startTime;
      const r = await api.post('/bookings', { therapistId: id, date, startTime, type });
      const created = r.data.booking;
      const pay = await api.post('/payments/checkout', { bookingId: created.id });
      setSuccess({
        booking: created,
        paid: pay.data.paid,
        demo: pay.data.demo,
      });
    } catch (e) {
      setError(e.response?.data?.error || t('common.error'));
    } finally {
      setBooking(false);
    }
  }

  if (loading) return <div className="container section"><p className="muted">{t('common.loading')}</p></div>;
  if (!therapist) return <div className="container section"><p className="error-text">{error || 'Terapeuta non trovato'}</p></div>;

  return (
    <div className="container section">
      <Link to="/terapeuti" className="back-link">← {t('common.back')}</Link>

      {success ? (
        <div className="card success-card">
          <h2>Prenotazione effettuata 🎉</h2>
          <p>
            <strong>{therapist.name}</strong> · {new Date(success.booking.date + 'T00:00:00').toLocaleDateString('it-IT')} alle{' '}
            {success.booking.startTime} · {success.booking.type === 'couple' ? 'seduta di coppia' : 'seduta individuale'} ·{' '}
            {success.booking.price} €
          </p>
          <p className={success.paid ? 'ok-text' : 'muted'}>
            {success.paid
              ? success.demo
                ? 'Pagamento demo confermato. La seduta è registrata come pagata.'
                : 'Pagamento confermato. La seduta è registrata come pagata.'
              : 'In attesa del pagamento.'}
          </p>
          <p className="muted">Sala video: {success.booking.roomName} — trovi il link nella tua area personale.</p>
          <div className="row-gap">
            <button className="btn btn-primary" onClick={() => navigate('/area-paziente')}>
              Vai alla mia area
            </button>
            <button className="btn btn-outline" onClick={() => { setSuccess(null); setSelectedSlot(''); }}>
              Prenota un’altra seduta
            </button>
          </div>
        </div>
      ) : (
        <div className="profile-layout">
          <div className="card profile-card">
            <div className="avatar avatar-lg">P</div>
            <h1>Psicologo{therapist.specialties && therapist.specialties[0] ? ` · ${therapist.specialties[0]}` : ''}</h1>
            {therapist.ratingCount > 0 && (
              <div className="tags">
                <span className="tag ok" style={{ fontWeight: 700, fontSize: 15 }}>
                  ★ {therapist.ratingAvg} · {therapist.ratingCount} recensioni
                </span>
              </div>
            )}
            <div className="tags">
              {therapist.specialties.map((s) => (
                <span className="tag" key={s}>{s}</span>
              ))}
            </div>
            {therapist.verified && <span className="badge">✓ Profilo verificato</span>}
            <p>{therapist.bio}</p>
            <ul className="facts">
              <li><strong>Esperienza:</strong> {therapist.experienceYears} anni</li>
              <li><strong>Iscrizione:</strong> {therapist.license || 'n.d.'}</li>
              <li><strong>Lingue:</strong> {(therapist.languages || []).join(', ')}</li>
            </ul>
          </div>

          <div className="card booking-card">
            <h2>{t('common.book')} una seduta</h2>
            <div className="type-toggle">
              <button className={type === 'individual' ? 'chip active' : 'chip'} onClick={() => setType('individual')}>
                {t('common.individual')} · {therapist.priceIndividual} €
              </button>
              <button className={type === 'couple' ? 'chip active' : 'chip'} onClick={() => setType('couple')}>
                {t('common.couple')} · {therapist.priceCouple} €
              </button>
            </div>

            <p className="label">Scegli il giorno</p>
            <div className="date-row">
              {days.map((d) => (
                <button
                  key={d.toISOString()}
                  className={date === fmt(d) ? 'date-chip active' : 'date-chip'}
                  onClick={() => setDate(fmt(d))}
                >
                  {label(d)}
                </button>
              ))}
            </div>

            <p className="label">Scegli l’orario</p>
            {loadingSlots ? (
              <p className="muted">{t('common.loading')}</p>
            ) : availableSlots.length === 0 ? (
              <p className="muted">Nessuno slot disponibile per questa data. Prova un altro giorno.</p>
            ) : (
              <div className="slot-grid">
                {availableSlots.map((s) => (
                  <button
                    key={s.id}
                    className={selectedSlot === s.id ? 'slot active' : 'slot'}
                    onClick={() => setSelectedSlot(s.id)}
                  >
                    {s.startTime}
                  </button>
                ))}
              </div>
            )}

            {error && <p className="error-text">{error}</p>}

            <div className="booking-summary">
              <span>Totale</span>
              <strong>{price} €</strong>
            </div>

            <button className="btn btn-primary btn-block btn-lg" onClick={handleBook} disabled={!selectedSlot || booking}>
              {booking ? 'Prenotazione in corso…' : user ? `Conferma e paga ${price} €` : 'Accedi per prenotare'}
            </button>
            {!user && (
              <p className="muted small">
                Hai già un account? <Link to="/accedi">Accedi</Link> · Non ce l’hai? <Link to="/registrazione">Registrati</Link>
              </p>
            )}
          </div>
        </div>
      )}

      {reviews.length > 0 && (
        <section className="container section" style={{ maxWidth: 760, margin: '0 auto' }}>
          <h2>Recensioni dei pazienti</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {reviews.map((r, i) => (
              <div key={i} className="card" style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>★ {r.score}</strong>
                  <span className="muted small">{new Date(r.created_at + 'Z').toLocaleDateString('it-IT')}</span>
                </div>
                {r.comment && <p style={{ marginTop: 8 }}>{r.comment}</p>}
                <p className="muted small" style={{ marginTop: 4 }}>— paziente verificato</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
