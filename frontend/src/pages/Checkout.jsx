import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';

/**
 * Pagina di pagamento: il paziente inserisce i dati della carta di credito
 * nei campi sicuri PayPal (Advanced Card Processing). I fondi vengono
 * accreditati sul conto PayPal Business del titolare della piattaforma.
 * Senza credenziali PayPal configurate mostra la modalità demo.
 */

function loadPayPalScript(clientId) {
  return new Promise((resolve, reject) => {
    if (window.paypal && window.__paypalClientId === clientId) return resolve(window.paypal);
    const old = document.getElementById('paypal-js');
    if (old) old.remove();
    const script = document.createElement('script');
    script.id = 'paypal-js';
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(
      clientId
    )}&components=card-fields&currency=EUR&intent=capture`;
    script.onload = () => {
      window.__paypalClientId = clientId;
      resolve(window.paypal);
    };
    script.onerror = () => reject(new Error('Impossibile caricare il modulo di pagamento'));
    document.body.appendChild(script);
  });
}

const fieldStyle = {
  height: 44,
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  background: '#fff',
  padding: '10px 12px',
  boxSizing: 'border-box',
  marginBottom: 14,
};

export default function Checkout() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [demo, setDemo] = useState(false);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');
  const [paying, setPaying] = useState(false);
  const [cardFields, setCardFields] = useState(null);

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
        setLoading(false);

        const paypal = await loadPayPalScript(pay.data.clientId);
        if (cancelled) return;

        const fields = await paypal.CardFields({
          createOrder: () => pay.data.orderId,
          onApprove: async (data) => {
            setPaying(true);
            setError('');
            try {
              const r = await api.post('/payments/capture', { orderId: data.orderID });
              if (r.data.paid) {
                navigate('/area-paziente?paid=1');
              } else {
                setError('Pagamento non completato. Riprova.');
                setPaying(false);
              }
            } catch (e) {
              setError(e.response?.data?.error || 'Errore nella conferma del pagamento');
              setPaying(false);
            }
          },
          onError: (err) => {
            setError(err?.message || 'Errore nel pagamento. Riprova.');
            setPaying(false);
          },
        });

        if (cancelled) return;
        setCardFields(fields);

        fields.NameField().render('#card-name');
        fields.NumberField().render('#card-number');
        fields.ExpiryField().render('#card-expiry');
        fields.CVVField().render('#card-cvv');

        fields.on('submit', () => {
          setPaying(true);
          setError('');
        });
        fields.on('error', (errors) => {
          const msg = Array.isArray(errors) ? errors.map((e) => e?.message).filter(Boolean).join(' ') : null;
          setError(msg || 'Controlla i dati della carta inseriti.');
          setPaying(false);
        });
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
        <h2>💳 Pagamento con carta</h2>
        {booking && (
          <p className="muted" style={{ marginBottom: 16 }}>
            {booking.type === 'couple' ? 'Seduta di coppia' : 'Seduta individuale'} ·{' '}
            {new Date(booking.date + 'T00:00:00').toLocaleDateString('it-IT')} alle {booking.startTime} ·{' '}
            <strong>{booking.price} €</strong>
          </p>
        )}

        {error && <p className="error-text">{error}</p>}

        <div>
          <p className="label">Titolare della carta</p>
          <div id="card-name" style={fieldStyle}></div>
          <p className="label">Numero carta</p>
          <div id="card-number" style={fieldStyle}></div>
          <div style={{ display: 'flex', gap: 14 }}>
            <div style={{ flex: 1 }}>
              <p className="label">Scadenza</p>
              <div id="card-expiry" style={fieldStyle}></div>
            </div>
            <div style={{ flex: 1 }}>
              <p className="label">CVC</p>
              <div id="card-cvv" style={fieldStyle}></div>
            </div>
          </div>
        </div>

        <button
          className="btn btn-primary btn-block btn-lg"
          disabled={paying || !cardFields}
          onClick={() => cardFields && cardFields.submit()}
        >
          {paying ? 'Pagamento in corso…' : `Paga ${booking ? booking.price : ''} €`}
        </button>

        <p className="muted small" style={{ marginTop: 12 }}>
          Pagamento sicuro processato da PayPal. I dati della carta non passano mai dai nostri server e i fondi
          vengono accreditati sul conto PayPal della piattaforma.
        </p>
      </div>
    </div>
  );
}
