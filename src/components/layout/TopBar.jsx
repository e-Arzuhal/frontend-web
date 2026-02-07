import React from 'react';
import { colors, fonts } from '../../styles/tokens';

const TopBar = ({ title, subtitle, actions }) => {
  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 32px',
      background: colors.card,
      borderBottom: `1px solid ${colors.border}`,
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div>
        <h1 style={{ fontFamily: fonts.heading, fontSize: '24px', fontWeight: 600, color: colors.text, margin: 0 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: '14px', color: colors.textSecondary, margin: '4px 0 0 0' }}>{subtitle}</p>}
      </div>
      {actions && <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>{actions}</div>}
    </header>
  );
};

export default TopBar;
