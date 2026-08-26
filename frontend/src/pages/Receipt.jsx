import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api';

const STATUS_LABEL = {
  pending: 'In attesa di conferma',
  confirmed: 'Confermata',
  completed: 'Completata',
  cancelled: 'Annullata',
};

export default function Receipt() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/bookings/${id}`)
      .then((r) => setBooking(r.data.booking))
      .catch((e) => setError(e.response?.data?.error || 'Prenotazione non trovata'))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="container section" style={{ maxWidth: 640, margin: '0 auto' }}>
      {loading && <p className="muted">Caricamento…</p>}
      {error && <p className="error-text">{error}</p>}

      {booking && (
        <>
          <div className="card" style={{ padding: '26px 22px' }} id="ricevuta">
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <h1 style={{ margin: 0 }}>🧾 Ricevuta</h1>
              <p className="muted" style={{ margin: 0 }}>Adatto x Te — Psicologia online</p>
              <p className="muted small">Ricevuta n. {booking.id.slice(0, 8).toUpperCase()}</p>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
              <tbody>
                {[
                  ['Paziente', booking.patientName],
                  ['Terapeuta', booking.therapistName],
                  ['Data', new Date(booking.date + 'T00:00:00').toLocaleDateString('it-IT')],
                  ['Orario', `${booking.startTime}–${booking.endTime}`],
                  ['Tipo di seduta', booking.type === 'couple' ? 'Coppia' : 'Individuale'],
                  ['Stato', STATUS_LABEL[booking.status] || booking.status],
                  ['Pagamento', booking.paid ? 'Pagata' : 'Da pagare'],
                ].map(([k, v]) => (
                  <tr key={k} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '9px 6px', color: '#64748b', fontWeight: 600, width: '45%' }}>{k}</td>
                    <td style={{ padding: '9px 6px' }}>{v}</td>
                  </tr>
                ))}
                <tr>
                  <td style={{ padding: '12px 6px', fontWeight: 700 }}>Totale</td>
                  <td style={{ padding: '12px 6px', fontWeight: 800, fontSize: 18 }}>{booking.price} €</td>
                </tr>
              </tbody>
            </table>

            <p className="muted small" style={{ marginTop: 18, borderTop: '1px dashed #e2e8f0', paddingTop: 14 }}>
              Documento dimostrativo emesso in assenza di fatturazione elettronica.
              Per la fattura fiscale completa (Sistema di Interscambio) contattare l'assistenza.
              Adatto x Te — P.IVA da configurare · info@adattoxte.it
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => window.print()}>
              🖨️ Stampa / salva PDF
            </button>
            <Link to="/area-paziente" className="btn btn-outline">Torna alla mia area</Link>
          </div>
        </>
      )}
    </div>
  );
}
