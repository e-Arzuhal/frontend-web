import React, { useState } from 'react';
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
} from './pages';
import './styles/global.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);
  const [selectedContractId, setSelectedContractId] = useState(null);

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
        return <CreateContractPage />;
      case 'contracts': 
        return <ContractsPage onNavigate={handleNavigate} />;
      case 'approvals': 
        return <ApprovalsPage />;
      case 'settings': 
        return <SettingsPage onLogout={handleLogout} />;
      case 'contract-detail':
        return <ContractDetailPage contractId={selectedContractId} onBack={() => setCurrentPage('contracts')} />;
      default: 
        return <DashboardPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <MainLayout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </MainLayout>
  );
}

export default App;
