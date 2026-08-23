import { useEffect, useState } from 'react';
import api from '../api';

/**
 * Programma referral "invita un amico" (BP cap. 6.2):
 * entrambi ricevono 10€ di credito dopo la prima seduta pagata dell'invitato.
 */
export default function ReferralCard() {
  const [data, setData] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api
      .get('/referral')
      .then((r) => setData(r.data))
      .catch(() => {});
  }, []);

  if (!data) return null;

  async function copy() {
    try {
      await navigator.clipboard.writeText(data.link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard non disponibile: mostra il link per copiarlo a mano
      window.prompt('Copia il tuo link di invito:', data.link);
    }
  }

  return (
    <div className="card referral-card">
      <h3>🎁 Invita un amico, entrambi ricevete 10 €</h3>
      <p className="muted small">
        Chi si registra con il tuo codice riceve <strong>10 € di credito</strong> sulla prima seduta. Quando
        completa la prima seduta pagata, anche tu ricevi <strong>10 € di credito</strong>.
      </p>
      <div className="referral-code">{data.code}</div>
      <div className="row-gap">
        <button className="btn btn-primary btn-sm" onClick={copy}>
          {copied ? '✓ Copiato!' : 'Copia link invito'}
        </button>
      </div>
      <p className="muted small">
        Credito disponibile: <strong>{data.credit} €</strong>
        {data.credit > 0 && ' — verrà usato automaticamente alla prossima prenotazione.'}
      </p>
      {data.referrals.length > 0 && (
        <>
          <p className="muted small">I tuoi inviti:</p>
          <ul className="referral-list">
            {data.referrals.map((r, i) => (
              <li key={i}>
                {r.name} — {r.status === 'rewarded' ? '✅ premiato (10 € accreditati)' : '⏳ in attesa della prima seduta pagata'}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
