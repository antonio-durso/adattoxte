import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container center-page">
        <p className="muted">Caricamento…</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/accedi" replace state={{ from: location.pathname }} />;

  if (role && user.role !== role) {
    const fallback = user.role === 'therapist' ? '/area-terapeuta' : user.role === 'patient' ? '/area-paziente' : '/area-admin';
    return <Navigate to={fallback} replace />;
  }

  return children;
}
