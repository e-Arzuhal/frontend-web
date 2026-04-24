import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams, useLocation } from 'react-router-dom';
import { MainLayout } from './components/layout';
import {
  DashboardPage,
  CreateContractPage,
  ContractsPage,
  ApprovalsPage,
  SettingsPage,
  LoginPage,
  RegisterPage,
  ContractDetailPage,
  VerificationPage,
} from './pages';
import authService from './services/auth.service';
import api from './services/api.service';
import ChatbotWidget from './components/ChatbotWidget';
import DisclaimerBanner from './components/DisclaimerBanner';
import './styles/global.css';

/* ─────────────────────────────────────────────────────────────
   Router-aware page wrappers
   Mevcut page component'leri onNavigate(page, data) callback'i ile
   çalışıyor. Bu wrapper'lar react-router navigate() fonksiyonunu
   onNavigate interface'ine çevirerek mevcut sayfalara müdahale
   etmeden router entegrasyonu sağlar.
   ───────────────────────────────────────────────────────────── */

function NavigableCreateContract() {
  const navigate = useNavigate();
  const handleNavigate = (page, data) => {
    if (page === 'contract-detail' && data?.contractId) {
      navigate(`/contracts/${data.contractId}`);
    } else {
      navigate(pageToPath(page));
    }
  };
  return <CreateContractPage onNavigate={handleNavigate} />;
}

function NavigableDashboard() {
  const navigate = useNavigate();
  const handleNavigate = (page, data) => {
    if (page === 'contract-detail' && data?.contractId) {
      navigate(`/contracts/${data.contractId}`);
    } else {
      navigate(pageToPath(page));
    }
  };
  return <DashboardPage onNavigate={handleNavigate} />;
}

function NavigableContracts() {
  const navigate = useNavigate();
  const handleNavigate = (page, data) => {
    if (page === 'contract-detail' && data?.contractId) {
      navigate(`/contracts/${data.contractId}`);
    } else {
      navigate(pageToPath(page));
    }
  };
  return <ContractsPage onNavigate={handleNavigate} />;
}

function NavigableApprovals() {
  const navigate = useNavigate();
  const handleNavigate = (page, data) => {
    if (page === 'contract-detail' && data?.contractId) {
      navigate(`/contracts/${data.contractId}`);
    } else {
      navigate(pageToPath(page));
    }
  };
  return <ApprovalsPage onNavigate={handleNavigate} />;
}

function NavigableContractDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  return <ContractDetailPage contractId={Number(id)} onBack={() => navigate('/contracts')} />;
}

/** Sayfa adından URL path'e dönüşüm */
function pageToPath(page) {
  const map = {
    'dashboard': '/',
    'create': '/create',
    'contracts': '/contracts',
    'approvals': '/approvals',
    'settings': '/settings',
    'verification': '/verification',
  };
  return map[page] || '/';
}

/** URL path'inden sayfa adına dönüşüm (layout aktif tab için) */
function pathToPage(pathname) {
  if (pathname === '/') return 'dashboard';
  if (pathname.startsWith('/contracts/')) return 'contracts';
  const map = {
    '/create': 'create',
    '/contracts': 'contracts',
    '/approvals': 'approvals',
    '/settings': 'settings',
    '/verification': 'verification',
  };
  return map[pathname] || 'dashboard';
}


/* ─────────────────────────────────────────────────────────────
   Auth guard — kimliği doğrulanmamış kullanıcıları login'e yönlendirir
   ───────────────────────────────────────────────────────────── */
function ProtectedRoutes({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPage = pathToPage(location.pathname);

  const handlePageChange = (page) => navigate(pageToPath(page));

  return (
    <MainLayout currentPage={currentPage} onPageChange={handlePageChange}>
      <DisclaimerBanner onAccepted={() => { }} />
      <Routes>
        <Route path="/" element={<NavigableDashboard />} />
        <Route path="/create" element={<NavigableCreateContract />} />
        <Route path="/contracts" element={<NavigableContracts />} />
        <Route path="/contracts/:id" element={<NavigableContractDetail />} />
        <Route path="/approvals" element={<NavigableApprovals />} />
        <Route path="/settings" element={<SettingsPage onLogout={onLogout} />} />
        <Route path="/verification" element={<VerificationPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ChatbotWidget />
    </MainLayout>
  );
}


/* ─────────────────────────────────────────────────────────────
   App root
   ───────────────────────────────────────────────────────────── */
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = authService.getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        // Token'ın backend'de hâlâ geçerli olduğunu doğrula
        await api.get('/api/users/me');
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        setIsAuthenticated(true);
      } catch {
        // Süresi dolmuş veya geçersiz token → temizle, login'e yönlendir
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleRegister = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0F1A30 0%, #1a2942 100%)',
      }}>
        <div style={{ textAlign: 'center', color: '#fff' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid rgba(255,255,255,0.1)',
            borderTopColor: '#E8C882',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px',
          }} />
          <p>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth sayfaları — kimlik doğrulaması gerekmez */}
        <Route
          path="/login"
          element={
            isAuthenticated
              ? <Navigate to="/" replace />
              : <LoginPage onLogin={handleLogin} onNavigate={(page) => {/* handled by router */ }} />
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated
              ? <Navigate to="/" replace />
              : <RegisterPage onRegister={handleRegister} onNavigate={(page) => {/* handled by router */ }} />
          }
        />

        {/* Korunan sayfalar */}
        <Route
          path="/*"
          element={
            isAuthenticated
              ? <ProtectedRoutes user={user} onLogout={handleLogout} />
              : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
