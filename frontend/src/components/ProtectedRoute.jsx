import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="container center-page">
        <p className="muted">Caricamento…</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/accedi" replace />;

  if (role && user.role !== role) {
    const fallback = user.role === 'therapist' ? '/area-terapeuta' : user.role === 'patient' ? '/area-paziente' : '/';
    return <Navigate to={fallback} replace />;
  }

  return children;
}
