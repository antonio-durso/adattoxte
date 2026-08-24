import { useEffect, useState } from 'react';
import api from '../api';

function emptyForm() {
  return {
    name: '',
    email: '',
    password: '',
    bio: '',
    specialties: [],
    priceIndividual: 45,
    priceCouple: 50,
    license: '',
    experienceYears: 0,
    photoUrl: '',
    verified: false,
  };
}

const cardStyle = {
  border: '1px solid var(--border, #e5e7eb)',
  borderRadius: 12,
  padding: '14px 16px',
  background: '#fff',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
  gap: 10,
  marginBottom: 24,
};

const fieldRow = { display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 };

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [therapists, setTherapists] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [editing, setEditing] = useState(null); // null | 'new' | terapeuta
  const [form, setForm] = useState(emptyForm());
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function loadAll() {
    try {
      const [ov, th, sp] = await Promise.all([
        api.get('/admin/overview'),
        api.get('/admin/therapists'),
        api.get('/admin/specialties'),
      ]);
      setOverview(ov.data.overview);
      setTherapists(th.data.therapists);
      setSpecialties(sp.data.specialties);
      setError('');
    } catch {
      setError('Impossibile caricare i dati. Riprova.');
      return;
    }
    try {
      const bk = await api.get('/admin/bookings');
      setBookings(bk.data.bookings || []);
    } catch {
      setBookings([]);
    }
  }

  async function setBookingStatus(bookingId, status) {
    try {
      await api.patch(`/admin/bookings/${bookingId}/status`, { status });
      await loadAll();
    } catch (err) {
      setError(err.response?.data?.error || 'Errore durante l\'aggiornamento');
    }
  }

  const statusLabel = (s) =>
    ({ pending: 'In attesa', confirmed: 'Confermata', completed: 'Completata', cancelled: 'Annullata' }[s] || s);

  const statusColor = (s) =>
    ({ pending: '#d97706', confirmed: '#166534', completed: '#1d4ed8', cancelled: '#b91c1c' }[s] || '#6b7280');

  function formatDateTime(b) {
    try {
      const d = new Date(b.date + 'T00:00:00');
      return `${d.toLocaleDateString('it-IT')} · ${b.start_time || ''}`;
    } catch {
      return `${b.date} · ${b.start_time || ''}`;
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  function startNew() {
    setForm(emptyForm());
    setEditing('new');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function startEdit(t) {
    setForm({
      name: t.name,
      email: t.email,
      password: '',
      bio: t.bio || '',
      specialties: t.specialties || [],
      priceIndividual: t.priceIndividual || 45,
      priceCouple: t.priceCouple || 50,
      license: t.license || '',
      experienceYears: t.experienceYears || 0,
      photoUrl: t.photoUrl || '',
      verified: !!t.verified,
    });
    setEditing(t);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function toggleSpecialty(s) {
    setForm((f) => ({
      ...f,
      specialties: f.specialties.includes(s)
        ? f.specialties.filter((x) => x !== s)
        : [...f.specialties, s],
    }));
  }

  function setField(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (editing === 'new') {
        await api.post('/admin/therapists', form);
      } else {
        const payload = { ...form };
        if (!payload.password) delete payload.password;
        await api.put(`/admin/therapists/${editing.id}`, payload);
      }
      setEditing(null);
      setForm(emptyForm());
      await loadAll();
    } catch (err) {
      setError(err.response?.data?.error || 'Errore durante il salvataggio');
    } finally {
      setBusy(false);
    }
  }

  async function remove(t) {
    if (!window.confirm(`Eliminare il terapeuta "${t.name}"? L'operazione non è reversibile.`)) return;
    try {
      await api.delete(`/admin/therapists/${t.id}`);
      await loadAll();
    } catch (err) {
      setError(err.response?.data?.error || "Errore durante l'eliminazione");
    }
  }

  const statCards = overview
    ? [
        { label: 'Pazienti', value: overview.patients, target: 'bookings' },
        { label: 'Terapeuti', value: overview.therapists, target: 'therapists' },
        { label: 'Prenotazioni totali', value: overview.bookingsTotal, target: 'bookings' },
        { label: 'In attesa', value: overview.bookingsPending, target: 'bookings' },
        { label: 'Confermate', value: overview.bookingsConfirmed, target: 'bookings' },
        { label: 'Completate', value: overview.bookingsCompleted, target: 'bookings' },
      ]
    : [];

  function scrollToSection(target) {
    const id = target === 'therapists' ? 'sezione-terapeuti' : 'sezione-prenotazioni';
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="container section">
      <h1>Area Admin</h1>
      <p className="muted">Gestisci i terapeuti della piattaforma: aggiungi, modifica o elimina i profili.</p>

      {error && <p className="error-text">{error}</p>}

      {statCards.length > 0 && (
        <div style={gridStyle}>
          {statCards.map((s) => (
            <button
              key={s.label}
              onClick={() => scrollToSection(s.target)}
              style={{
                ...cardStyle,
                cursor: 'pointer',
                textAlign: 'left',
                border: '1px solid var(--border, #e5e7eb)',
                background: '#fff',
              }}
              title="Tocca per vedere i dettagli"
            >
              <div className="stat-label">{s.label}</div>
              <div style={{ fontSize: 26, fontWeight: 700 }}>{s.value}</div>
              <div className="muted small">Tocca per i dettagli ↓</div>
            </button>
          ))}
        </div>
      )}

      {editing && (
        <form className="card form-card" onSubmit={save} style={{ maxWidth: 720, marginBottom: 28 }}>
          <h2 style={{ marginTop: 0 }}>{editing === 'new' ? 'Nuovo terapeuta' : `Modifica: ${editing.name}`}</h2>

          <div style={fieldRow}>
            <label className="label" htmlFor="adt-name">Nome completo *</label>
            <input id="adt-name" value={form.name} onChange={(e) => setField('name', e.target.value)} required minLength={2} />
          </div>

          <div style={fieldRow}>
            <label className="label" htmlFor="adt-email">Email *</label>
            <input id="adt-email" type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} required />
          </div>

          <div style={fieldRow}>
            <label className="label" htmlFor="adt-password">
              Password {editing === 'new' ? '*' : '(lascia vuoto per non cambiarla)'}
            </label>
            <input
              id="adt-password"
              type="password"
              value={form.password}
              onChange={(e) => setField('password', e.target.value)}
              minLength={editing === 'new' ? 8 : 0}
              required={editing === 'new'}
              placeholder={editing === 'new' ? 'Minimo 8 caratteri' : ''}
            />
          </div>

          <div style={fieldRow}>
            <label className="label" htmlFor="adt-bio">Bio / presentazione</label>
            <textarea id="adt-bio" rows={3} value={form.bio} onChange={(e) => setField('bio', e.target.value)} />
          </div>

          <div style={fieldRow}>
            <span className="label">Specializzazioni</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {specialties.map((s) => (
                <label key={s} className="chip-select" style={{ cursor: 'pointer', border: form.specialties.includes(s) ? '1.5px solid var(--primary, #4f46e5)' : '1.5px solid var(--border, #e5e7eb)', borderRadius: 999, padding: '6px 12px' }}>
                  <input type="checkbox" checked={form.specialties.includes(s)} onChange={() => toggleSpecialty(s)} style={{ marginRight: 4 }} />
                  {s}
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={fieldRow}>
              <label className="label" htmlFor="adt-pi">Prezzo seduta individuale (€)</label>
              <input id="adt-pi" type="number" min={0} value={form.priceIndividual} onChange={(e) => setField('priceIndividual', Number(e.target.value))} />
            </div>
            <div style={fieldRow}>
              <label className="label" htmlFor="adt-pc">Prezzo seduta di coppia (€)</label>
              <input id="adt-pc" type="number" min={0} value={form.priceCouple} onChange={(e) => setField('priceCouple', Number(e.target.value))} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={fieldRow}>
              <label className="label" htmlFor="adt-lic">Numero iscrizione albo</label>
              <input id="adt-lic" value={form.license} onChange={(e) => setField('license', e.target.value)} />
            </div>
            <div style={fieldRow}>
              <label className="label" htmlFor="adt-years">Anni di esperienza</label>
              <input id="adt-years" type="number" min={0} value={form.experienceYears} onChange={(e) => setField('experienceYears', Number(e.target.value))} />
            </div>
          </div>

          <div style={fieldRow}>
            <label className="label" htmlFor="adt-photo">URL foto profilo (opzionale)</label>
            <input id="adt-photo" value={form.photoUrl} onChange={(e) => setField('photoUrl', e.target.value)} placeholder="https://..." />
          </div>

          <label className="checkbox" style={{ marginBottom: 18 }}>
            <input type="checkbox" checked={form.verified} onChange={(e) => setField('verified', e.target.checked)} />
            Profilo verificato (credenziali controllate)
          </label>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn btn-primary" type="submit" disabled={busy}>
              {busy ? 'Salvataggio…' : 'Salva terapeuta'}
            </button>
            <button className="btn btn-outline" type="button" onClick={() => { setEditing(null); setForm(emptyForm()); }}>
              Annulla
            </button>
          </div>
        </form>
      )}

      <div id="sezione-terapeuti" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, scrollMarginTop: 16 }}>
        <h2 style={{ margin: 0 }}>Terapeuti ({therapists.length})</h2>
        {!editing && (
          <button className="btn btn-primary btn-sm" onClick={startNew}>
            + Nuovo terapeuta
          </button>
        )}
      </div>

      {therapists.length === 0 && <p className="muted">Nessun terapeuta presente.</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {therapists.map((t) => (
          <div key={t.id} style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <div>
                <strong>{t.name}</strong>{' '}
                {t.verified ? <span className="badge" style={{ background: '#dcfce7', color: '#166534' }}>Verificato</span> : null}
                <div className="muted small">{t.email}</div>
                <div className="muted small">
                  {(t.specialties || []).join(', ') || 'Nessuna specializzazione'} · {t.priceIndividual} € / {t.priceCouple} €
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-outline btn-sm" onClick={() => startEdit(t)}>Modifica</button>
                <button className="btn btn-outline btn-sm" onClick={() => remove(t)} style={{ color: '#b91c1c' }}>Elimina</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 id="sezione-prenotazioni" style={{ margin: '28px 0 12px', scrollMarginTop: 16 }}>Prenotazioni ({bookings.length})</h2>
      {bookings.length === 0 && <p className="muted">Nessuna prenotazione ancora. Quando un paziente prenota, la vedrai qui.</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {bookings.map((b) => (
          <div key={b.id} style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <div>
                <strong>{b.patient_name}</strong> → <strong>{b.therapist_name}</strong>
                <div className="muted small">{formatDateTime(b)} · {b.price ?? b.priceIndividual ?? ''} €</div>
                <span className="badge" style={{ background: '#fef3c7', color: statusColor(b.status) }}>
                  {statusLabel(b.status)}
                </span>
              </div>
              {b.status !== 'cancelled' && b.status !== 'completed' && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {b.status === 'pending' && (
                    <button className="btn btn-primary btn-sm" onClick={() => setBookingStatus(b.id, 'confirmed')}>Conferma</button>
                  )}
                  {b.status === 'confirmed' && (
                    <button className="btn btn-outline btn-sm" onClick={() => setBookingStatus(b.id, 'completed')}>Completa</button>
                  )}
                  <button className="btn btn-outline btn-sm" style={{ color: '#b91c1c' }} onClick={() => setBookingStatus(b.id, 'cancelled')}>
                    Annulla
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
