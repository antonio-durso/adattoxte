import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

// Striscia recensioni in home: media + conteggio reali da /api/ratings.
// Se l'endpoint non risponde, non mostra nulla (nessun dato inventato).
export default function ReviewsStrip() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api
      .get('/ratings')
      .then((r) => {
        if (r.data && r.data.total > 0) setData(r.data);
      })
      .catch(() => {});
  }, []);

  if (!data) return null;

  return (
    <section className="container section" style={{ textAlign: 'center' }}>
      <div
        className="card"
        style={{ padding: '28px 20px', border: '1px solid #f59e0b55', background: 'linear-gradient(135deg, #fff8ef, #fff)' }}
      >
        <div style={{ fontSize: 42, color: '#f59e0b' }}>★★★★★</div>
        <h2 style={{ margin: '10px 0 4px' }}>
          {data.avg} su 5 · {data.total} recensioni verificate
        </h2>
        <p className="muted" style={{ maxWidth: 520, margin: '0 auto' }}>
          Ogni valutazione arriva da una seduta completata sulla piattaforma. I nostri pazienti raccontano la loro esperienza.
        </p>
        <Link to="/recensioni" className="btn btn-outline" style={{ marginTop: 14 }}>
          Leggi le recensioni
        </Link>
      </div>
    </section>
  );
}
