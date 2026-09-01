import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
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
const Checkout = lazy(() => import('./pages/Checkout'));
const TherapistDashboard = lazy(() => import('./pages/TherapistDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const BlogList = lazy(() => import('./pages/BlogList'));
const BlogArticle = lazy(() => import('./pages/BlogArticle'));
const Receipt = lazy(() => import('./pages/Receipt'));
const Risorse = lazy(() => import('./pages/Risorse'));
const Recensioni = lazy(() => import('./pages/Recensioni'));
const CheckIn = lazy(() => import('./pages/CheckIn'));
const NicheLanding = lazy(() => import('./pages/NicheLanding'));
const Estero = lazy(() => import('./pages/Estero'));
const PaeseLanding = lazy(() => import('./pages/PaeseLanding'));
const DisturboLanding = lazy(() => import('./pages/DisturboLanding'));
const Settings = lazy(() => import('./pages/Settings'));
const Privacy = lazy(() => import('./pages/Privacy'));
const ChiSiamo = lazy(() => import('./pages/ChiSiamo'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));
const Terms = lazy(() => import('./pages/Terms'));
const Prezzi = lazy(() => import('./pages/Prezzi'));
const Aziende = lazy(() => import('./pages/Aziende'));
const Tibiz = lazy(() => import('./pages/Tibiz'));
const Equipe = lazy(() => import('./pages/Equipe'));
const Press = lazy(() => import('./pages/Press'));
const NotFound = lazy(() => import('./pages/NotFound'));
import PortalInteractive from './components/PortalInteractive';

function PageLoader() {
  return (
    <div style={{ padding: '60px 20px', textAlign: 'center' }} className="muted">
      Caricamento…
    </div>
  );
}

// Scroll in cima a ogni cambio rotta: evita di atterrare a metà/fondo pagina
// quando si naviga da link in fondo (es. logo TBIZ nel footer)
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div className="portal-bg" aria-hidden="true">
            <svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="portalGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#48A8D8" />
                  <stop offset="50%" stopColor="#5fc9c9" />
                  <stop offset="100%" stopColor="#a5b4fc" />
                </linearGradient>
              </defs>
              <circle className="p-circle p-1" cx="300" cy="300" r="65" />
              <circle className="p-circle p-2" cx="300" cy="300" r="110" />
              <circle className="p-circle p-3" cx="300" cy="300" r="155" />
              <circle className="p-circle p-4" cx="300" cy="300" r="200" />
              <circle className="p-circle p-5" cx="300" cy="300" r="245" />
              <circle className="p-circle p-6" cx="300" cy="300" r="290" />
              <circle className="p-circle p-7" cx="300" cy="300" r="335" />
              <circle className="p-circle p-8" cx="300" cy="300" r="380" />
            </svg>
          </div>
          <PortalInteractive />
          <Navbar />
          <main>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/terapeuti" element={<Therapists />} />
                <Route path="/chi-siamo" element={<ChiSiamo />} />
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
                <Route path="/psicologo-online/:slug" element={<DisturboLanding />} />
                <Route path="/registrazione" element={<Register />} />
                <Route path="/accedi" element={<Login />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/cookie" element={<CookiePolicy />} />
                <Route path="/termini" element={<Terms />} />
                <Route path="/prezzi" element={<Prezzi />} />
                <Route path="/aziende" element={<Aziende />} />
                <Route path="/italiani-all-estero" element={<Estero />} />
                <Route path="/italiani-all-estero/:paese" element={<PaeseLanding />} />
                <Route path="/italiani-all-estero/:paese/:capitale" element={<PaeseLanding />} />
                <Route path="/tibiz" element={<Tibiz />} />
                <Route path="/equipe" element={<Equipe />} />
                <Route path="/ufficio-stampa" element={<Press />} />
                <Route
                  path="/area-paziente"
                  element={
                    <ProtectedRoute role="patient">
                      <PatientDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/pagamento/:bookingId"
                  element={
                    <ProtectedRoute role="patient">
                      <Checkout />
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
                <Route path="*" element={<NotFound />} />
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
