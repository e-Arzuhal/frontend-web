import React, { useState } from 'react';
import { MainLayout } from './components/layout';
import { DashboardPage, CreateContractPage, ContractsPage, ApprovalsPage } from './pages';
import './styles/global.css';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <DashboardPage onNavigate={setCurrentPage} />;
      case 'create': return <CreateContractPage />;
      case 'contracts': return <ContractsPage />;
      case 'approvals': return <ApprovalsPage />;
      default: return <DashboardPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <MainLayout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </MainLayout>
  );
}

export default App;
