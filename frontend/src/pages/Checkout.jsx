import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';

/**
 * Pagina di pagamento: crea l'ordine PayPal e reindirizza il paziente alla
 * pagina sicura di PayPal, dove potrà pagare con carta di credito (anche
 * senza conto PayPal) oppure col suo saldo PayPal. I fondi vengono accreditati
 * sul conto PayPal Business della piattaforma. Dopo il pagamento PayPal
 * riporta automaticamente il paziente su /area-paziente?paid=1&token=...
 * dove il backend cattura l'addebito e segna la seduta come pagata.
 * Senza credenziali PayPal configurate mostra la modalità demo.
 */

export default function Checkout() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [demo, setDemo] = useState(false);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');
  const [approvalUrl, setApprovalUrl] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const pay = await api.post('/payments/checkout', { bookingId });

        if (pay.data.demo) {
          if (cancelled) return;
          setDemo(true);
          setBooking(pay.data.bookingId ? { id: pay.data.bookingId } : null);
          setLoading(false);
          setTimeout(() => navigate('/area-paziente?paid=1'), 1500);
          return;
        }

        if (cancelled) return;
        setBooking(pay.data.booking);
        setApprovalUrl(pay.data.approvalUrl);
        setLoading(false);

        // Reindirizzamento automatico alla pagina sicura di PayPal
        if (pay.data.approvalUrl) {
          window.location.href = pay.data.approvalUrl;
        } else {
          setError('Link di pagamento non disponibile. Riprova.');
        }
      } catch (e) {
        if (!cancelled) {
          setLoading(false);
          setError(
            e.response?.data?.error === 'Prenotazione già pagata'
              ? 'Questa prenotazione risulta già pagata.'
              : e.response?.data?.error || 'Errore nella creazione del pagamento'
          );
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [bookingId, navigate]);

  if (loading) {
    return (
      <div className="container section">
        <p className="muted">Preparazione del pagamento…</p>
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="container section" style={{ maxWidth: 560, margin: '0 auto' }}>
        <div className="card" style={{ padding: 20 }}>
          <p className="error-text">{error}</p>
          <Link to="/area-paziente" className="btn btn-primary">
            Torna alla mia area
          </Link>
        </div>
      </div>
    );
  }

  if (demo) {
    return (
      <div className="container section" style={{ maxWidth: 560, margin: '0 auto' }}>
        <div className="card success-card">
          <h2>Pagamento demo 🎉</h2>
          <p className="ok-text">Pagamento demo confermato. La seduta è registrata come pagata.</p>
          <p className="muted">Ti stiamo reindirizzando alla tua area personale…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container section" style={{ maxWidth: 560, margin: '0 auto' }}>
      <div className="card" style={{ padding: 22 }}>
        <h2>💳 Pagamento sicuro</h2>
        {booking && (
          <p className="muted" style={{ marginBottom: 16 }}>
            {booking.type === 'couple' ? 'Seduta di coppia' : 'Seduta individuale'} ·{' '}
            {new Date(booking.date + 'T00:00:00').toLocaleDateString('it-IT')} alle {booking.startTime} ·{' '}
            <strong>{booking.price} €</strong>
          </p>
        )}
        <p>
          Stai per essere reindirizzato alla pagina sicura di PayPal, dove potrai pagare con la
          carta di credito o con il tuo account PayPal.
        </p>
        {error && <p className="error-text">{error}</p>}
        {approvalUrl && (
          <a href={approvalUrl} className="btn btn-primary btn-block btn-lg" style={{ textAlign: 'center', textDecoration: 'none' }}>
            Vai al pagamento su PayPal
          </a>
        )}
      </div>
    </div>
  );
}
