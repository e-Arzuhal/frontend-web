import React from 'react';
import { colors, fonts, radius, transitions } from '../../styles/tokens';

const NavIcon = ({ src, size = 18 }) => {
  // SVG/PNG ikonlarınızı "tek renk" olarak currentColor ile boyamak için:
  // - SVG önerilir (şeffaf arka plan, tek renk şekil)
  return (
    <span
      aria-hidden
      style={{
        width: size,
        height: size,
        display: 'inline-block',
        flex: '0 0 auto',
        backgroundColor: 'currentColor',
        WebkitMaskImage: `url(${src})`,
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        WebkitMaskSize: 'contain',
        maskImage: `url(${src})`,
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        maskSize: 'contain',
        opacity: 0.95,
      }}
    />
  );
};

const Sidebar = ({ currentPage, onPageChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Genel Bakış', iconSrc: '/icons/dashboard.svg' },
    { id: 'create', label: 'Yeni Sözleşme', iconSrc: '/icons/create.svg' },
    { id: 'contracts', label: 'Sözleşmelerim', iconSrc: '/icons/contracts.svg' },
    { id: 'approvals', label: 'Onay Bekleyenler', iconSrc: '/icons/approvals.svg' },
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
              <NavIcon src={item.iconSrc} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
