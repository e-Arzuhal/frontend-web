import React from 'react';
import Sidebar from './Sidebar';
import { colors } from '../../styles/tokens';

const MainLayout = ({ children, currentPage, onPageChange }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar currentPage={currentPage} onPageChange={onPageChange} />
      <main style={{ marginLeft: '260px', flex: 1, background: colors.surface, minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
