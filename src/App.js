import React, { useState, useEffect } from 'react';
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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);
  const [selectedContractId, setSelectedContractId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

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
        setCurrentPage('dashboard');
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
    setCurrentPage('dashboard');
  };

  const handleRegister = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setCurrentPage('login');
  };

  const handleNavigate = (page, data) => {
    if (page === 'contract-detail' && data?.contractId) {
      setSelectedContractId(data.contractId);
    }
    setCurrentPage(page);
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

  // Auth sayfalari (login/register)
  if (!isAuthenticated) {
    if (currentPage === 'register') {
      return <RegisterPage onRegister={handleRegister} onNavigate={setCurrentPage} />;
    }
    return <LoginPage onLogin={handleLogin} onNavigate={setCurrentPage} />;
  }

  // Ana uygulama sayfalari
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} />;
      case 'create':
        return <CreateContractPage onNavigate={handleNavigate} />;
      case 'contracts':
        return <ContractsPage onNavigate={handleNavigate} />;
      case 'approvals':
        return <ApprovalsPage onNavigate={handleNavigate} />;
      case 'settings':
        return <SettingsPage onLogout={handleLogout} />;
      case 'contract-detail':
        return <ContractDetailPage contractId={selectedContractId} onBack={() => setCurrentPage('contracts')} />;
      case 'verification':
        return <VerificationPage />;
      default:
        return <DashboardPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <MainLayout currentPage={currentPage} onPageChange={setCurrentPage}>
      <DisclaimerBanner onAccepted={() => setDisclaimerAccepted(true)} />
      {renderPage()}
      {isAuthenticated && <ChatbotWidget />}
    </MainLayout>
  );
}

export default App;
