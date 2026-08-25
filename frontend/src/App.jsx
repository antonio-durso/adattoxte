import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';
import { I18nProvider } from './i18n';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import ProtectedRoute from './components/ProtectedRoute';
// Home EAGER: la pagina principale si rende subito (LCP veloce); le altre restano lazy
import Home from './pages/Home';
const Therapists = lazy(() => import('./pages/Therapists'));
const TherapistDetail = lazy(() => import('./pages/TherapistDetail'));
const Register = lazy(() => import('./pages/Register'));
const Login = lazy(() => import('./pages/Login'));
const PatientDashboard = lazy(() => import('./pages/PatientDashboard'));
const TherapistDashboard = lazy(() => import('./pages/TherapistDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const BlogList = lazy(() => import('./pages/BlogList'));
const BlogArticle = lazy(() => import('./pages/BlogArticle'));
const Receipt = lazy(() => import('./pages/Receipt'));
const Risorse = lazy(() => import('./pages/Risorse'));
const Recensioni = lazy(() => import('./pages/Recensioni'));
const CheckIn = lazy(() => import('./pages/CheckIn'));
const NicheLanding = lazy(() => import('./pages/NicheLanding'));
const Settings = lazy(() => import('./pages/Settings'));
const Privacy = lazy(() => import('./pages/Privacy'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));
const Terms = lazy(() => import('./pages/Terms'));

function PageLoader() {
  return (
    <div style={{ padding: '60px 20px', textAlign: 'center' }} className="muted">
      Caricamento…
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <main>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/terapeuti" element={<Therapists />} />
                <Route path="/terapeuti/:id" element={<TherapistDetail />} />
                <Route path="/blog" element={<BlogList />} />
                <Route path="/blog/:slug" element={<BlogArticle />} />
                <Route path="/ricevuta/:id" element={<Receipt />} />
                <Route path="/risorse" element={<Risorse />} />
                <Route path="/recensioni" element={<Recensioni />} />
                <Route path="/test" element={<CheckIn />} />
                <Route path="/psicologo-concorsi-pubblici" element={<NicheLanding niche="concorsi" />} />
                <Route path="/psicologo-sport" element={<NicheLanding niche="sport" />} />
                <Route path="/psicologia-giuridica" element={<NicheLanding niche="giuridica" />} />
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
            </Suspense>
          </main>
          <Footer />
          <CookieBanner />
        </BrowserRouter>
      </AuthProvider>
    </I18nProvider>
  );
}
