import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';

/**
 * Pagina di pagamento con popup PayPal (Smart Buttons): il paziente rimane
 * sul sito, clicca il pulsante PayPal, paga nella finestra PayPal (carta di
 * credito o saldo PayPal) e al termine la finestra si chiude: la conferma
 * appare qui, dentro la piattaforma. Il backend crea l'ordine e, dopo
 * l'approvazione, cattura l'addebito (fondi sul conto PayPal Business).
 * Senza credenziali PayPal configurate mostra la modalità demo.
 */

export default function Checkout() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [demo, setDemo] = useState(false);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

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
          return;
        }

        if (cancelled) return;
        setBooking(pay.data.booking);
        setLoading(false);
        await renderPayPalButtons(pay.data.clientId, pay.data.orderId);
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
  }, [bookingId]);

  async function renderPayPalButtons(clientId, orderId) {
    if (window.paypal) {
      await mountButtons(clientId, orderId);
      return;
    }
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(
      clientId
    )}&components=buttons&currency=EUR&intent=capture`;
    script.onload = () => mountButtons(clientId, orderId);
    script.onerror = () => setError('Impossibile caricare il pagamento PayPal. Riprova.');
    document.body.appendChild(script);
  }

  async function mountButtons(clientId, orderId) {
    try {
      await window.paypal.Buttons({
        style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal' },
        createOrder: () => orderId,
        onApprove: async (data) => {
          try {
            const r = await api.post('/payments/capture', { orderId: data.orderID });
            setSuccess({ paid: !!r.data.paid, demo: false });
          } catch (e) {
            setError(e.response?.data?.error || 'Errore nella conferma del pagamento');
          }
        },
        onCancel: () => setError('Pagamento annullato. Nessun addebito effettuato.'),
        onError: () => setError('Errore durante il pagamento. Riprova.'),
      }).render('#paypal-button-container');
    } catch (e) {
      setError('Impossibile avviare il pagamento PayPal. Riprova.');
    }
  }

  if (loading) {
    return (
      <div className="container section">
        <p className="muted">Preparazione del pagamento…</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container section" style={{ maxWidth: 560, margin: '0 auto' }}>
        <div className="card success-card">
          <h2>Pagamento confermato 🎉</h2>
          {booking && (
            <p>
              <strong>
                {booking.type === 'couple' ? 'Seduta di coppia' : 'Seduta individuale'}
              </strong>{' '}
              · {new Date(booking.date + 'T00:00:00').toLocaleDateString('it-IT')} alle{' '}
              {booking.startTime} · {booking.price} €
            </p>
          )}
          <p className="ok-text">
            {success.demo
              ? 'Pagamento demo confermato. La seduta è registrata come pagata.'
              : 'Pagamento effettuato con successo. La seduta è registrata come pagata e trovi il link alla videochiamata nella tua area personale.'}
          </p>
          <div className="row-gap">
            <button className="btn btn-primary" onClick={() => navigate('/area-paziente')}>
              Vai alla mia area
            </button>
            <Link to="/terapeuti" className="btn btn-outline">
              Prenota un’altra seduta
            </Link>
          </div>
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
          <button className="btn btn-primary" onClick={() => navigate('/area-paziente')}>
            Vai alla mia area
          </button>
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

        {error && (
          <>
            <p className="error-text">{error}</p>
            <button className="btn btn-outline" onClick={() => window.location.reload()}>
              Riprova
            </button>
          </>
        )}

        <div id="paypal-button-container" style={{ marginTop: 8 }}></div>

        <p className="muted small" style={{ marginTop: 12 }}>
          Pagamento sicuro processato da PayPal: puoi pagare con carta di credito o con il tuo
          account PayPal. I dati della carta non passano mai dai nostri server e i fondi vengono
          accreditati sul conto PayPal della piattaforma.
        </p>
      </div>
    </div>
  );
}
