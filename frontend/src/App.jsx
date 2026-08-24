import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { I18nProvider } from './i18n';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Therapists from './pages/Therapists';
import TherapistDetail from './pages/TherapistDetail';
import Register from './pages/Register';
import Login from './pages/Login';
import PatientDashboard from './pages/PatientDashboard';
import TherapistDashboard from './pages/TherapistDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BlogList from './pages/BlogList';
import BlogArticle from './pages/BlogArticle';
import Receipt from './pages/Receipt';
import Risorse from './pages/Risorse';
import CheckIn from './pages/CheckIn';
import Settings from './pages/Settings';
import Privacy from './pages/Privacy';
import CookiePolicy from './pages/CookiePolicy';
import Terms from './pages/Terms';

export default function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/terapeuti" element={<Therapists />} />
              <Route path="/terapeuti/:id" element={<TherapistDetail />} />
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:slug" element={<BlogArticle />} />
              <Route path="/ricevuta/:id" element={<Receipt />} />
              <Route path="/risorse" element={<Risorse />} />
              <Route path="/test" element={<CheckIn />} />
              <Route path="/registrazione" element={<Register />} />
              <Route path="/accedi" element={<Login />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/cookie" element={<CookiePolicy />} />
              <Route path="/termini" element={<Terms />} />
              <Route
                path="/area-paziente"
                element={
                  <ProtectedRoute role="patient">
                    <PatientDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/area-terapeuta"
                element={
                  <ProtectedRoute role="therapist">
                    <TherapistDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/area-admin"
                element={
                  <ProtectedRoute role="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/impostazioni"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <CookieBanner />
        </BrowserRouter>
      </AuthProvider>
    </I18nProvider>
  );
}
