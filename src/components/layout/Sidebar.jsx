import React from 'react';
import { colors, fonts, radius, transitions } from '../../styles/tokens';

const Icon = ({ name, size = 20 }) => {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    style: { display: 'block' },
  };
  const stroke = { stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };

  switch (name) {
    case 'dashboard':
      return (
        <svg {...common} aria-hidden>
          <path {...stroke} d="M4 4h7v7H4V4zM13 4h7v4h-7V4zM13 10h7v10h-7V10zM4 13h7v7H4v-7z" />
        </svg>
      );
    case 'create':
      return (
        <svg {...common} aria-hidden>
          <path {...stroke} d="M12 5v14M5 12h14" />
          <path {...stroke} d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" />
        </svg>
      );
    case 'contracts':
      return (
        <svg {...common} aria-hidden>
          <path {...stroke} d="M7 3h7l3 3v15a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
          <path {...stroke} d="M14 3v4a2 2 0 0 0 2 2h4" />
          <path {...stroke} d="M8 12h8M8 16h8" />
        </svg>
      );
    case 'approvals':
      return (
        <svg {...common} aria-hidden>
          <path {...stroke} d="M9 12l2 2 4-4" />
          <path {...stroke} d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" />
        </svg>
      );
    default:
      return null;
  }
};

const Sidebar = ({ currentPage, onPageChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Genel Bakış', icon: 'dashboard' },
    { id: 'create', label: 'Yeni Sözleşme', icon: 'create' },
    { id: 'contracts', label: 'Sözleşmelerim', icon: 'contracts' },
    { id: 'approvals', label: 'Onay Bekleyenler', icon: 'approvals' },
  ];

  return (
    <aside
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '260px',
        height: '100vh',
        background: colors.primary,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
      }}
    >
      <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Opsiyonel: public/icons/app.svg ekleyip açın */}
          {/* <NavIcon src="/icons/app.svg" size={22} /> */}
          <div style={{ fontFamily: fonts.heading, fontSize: '24px', fontWeight: 700, color: '#fff' }}>e-Arzuhal</div>
        </div>
        <div
          style={{
            fontSize: '11px',
            color: 'rgba(255,255,255,0.5)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginTop: '4px',
          }}
        >
          Akıllı Sözleşme Sistemi
        </div>
      </div>

      <nav style={{ flex: 1, padding: '16px 12px' }}>
        {menuItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '12px 16px',
                marginBottom: '4px',
                borderRadius: radius.md,
                border: 'none',
                background: isActive ? 'rgba(200, 150, 62, 0.15)' : 'transparent',
                color: isActive ? colors.accent : 'rgba(255,255,255,0.7)',
                fontFamily: fonts.body,
                fontSize: '14px',
                fontWeight: isActive ? 600 : 400,
                cursor: 'pointer',
                transition: `all ${transitions.base}`,
                textAlign: 'left',
              }}
            >
              <span
                style={{
                  width: 22,
                  height: 22,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: '0 0 auto',
                }}
              >
                <Icon name={item.icon} />
              </span>
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
