import React, { useEffect, useState } from 'react';
import { colors, fonts, radius, transitions } from '../../styles/tokens';

const THEME_STORAGE_KEY = 'theme';

const SunIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden xmlns="http://www.w3.org/2000/svg">
    <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" stroke="currentColor" strokeWidth="2" />
    <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.4 1.4M17.6 17.6 19 19M19 5l-1.4 1.4M6.4 17.6 5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const MoonIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden xmlns="http://www.w3.org/2000/svg">
    <path d="M21 14.5A8.5 8.5 0 0 1 9.5 3a7 7 0 1 0 11.5 11.5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

const ThemeToggle = ({ value, onChange }) => {
  const isDark = value === 'dark';
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      onClick={() => onChange(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Açık temaya geç' : 'Koyu temaya geç'}
      title={isDark ? 'Açık tema' : 'Koyu tema'}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={{
        width: 92,
        height: 30,
        borderRadius: radius.full,
        border: '1px solid rgba(255,255,255,0.20)',
        background: isHovered
          ? 'linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.07))'
          : 'linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.06))',
        cursor: 'pointer',
        position: 'relative',
        padding: 0,
        outline: 'none',
        transition: `all ${transitions.base}`,
        boxShadow: isFocused
          ? 'inset 0 0 0 1px rgba(15,26,48,0.28), 0 0 0 3px rgba(200,150,62,0.22)'
          : 'inset 0 0 0 1px rgba(15,26,48,0.28)',
      }}
    >
      {/* knob */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          top: 4,
          left: isDark ? 92 - 4 - 22 : 4, // width - padding - knob
          width: 22,
          height: 22,
          borderRadius: radius.full,
          background: `linear-gradient(135deg, ${colors.accent}, ${colors.accentLight})`,
          boxShadow: '0 8px 14px rgba(0,0,0,0.22)',
          transition: 'left 0.22s ease',
        }}
      />

      {/* icons */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 8px',
          pointerEvents: 'none',
          fontFamily: fonts.body,
        }}
      >
        <span style={{ display: 'inline-flex', color: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(255,255,255,0.92)' }}>
          <SunIcon size={12} />
        </span>
        <span style={{ display: 'inline-flex', color: isDark ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.40)' }}>
          <MoonIcon size={12} />
        </span>
      </span>
    </button>
  );
};

const NavIcon = ({ name, size = 20 }) => {
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
    case 'settings':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
          <path {...stroke} d="M4 6h16M4 12h16M4 18h16" />
          <circle cx="9" cy="6" r="2" {...stroke} />
          <circle cx="15" cy="12" r="2" {...stroke} />
          <circle cx="11" cy="18" r="2" {...stroke} />
        </svg>
      );
    default:
      return null;
  }
};

const Sidebar = ({ currentPage, onPageChange }) => {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem(THEME_STORAGE_KEY) || 'light'; } catch { return 'light'; }
  });

  useEffect(() => {
    document.body.dataset.theme = theme;
    try { localStorage.setItem(THEME_STORAGE_KEY, theme); } catch {}
  }, [theme]);

  const menuItems = [
    { id: 'dashboard', label: 'Genel Bakış', icon: 'dashboard' },
    { id: 'create', label: 'Yeni Sözleşme', icon: 'create' },
    { id: 'contracts', label: 'Sözleşmelerim', icon: 'contracts' },
    { id: 'approvals', label: 'Onay Bekleyenler', icon: 'approvals' },
  ];

  const bottomItems = [{ id: 'settings', label: 'Ayarlar', icon: 'settings' }];

  const renderItem = (item) => {
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
        <span style={{ width: 22, height: 22, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <NavIcon name={item.icon} />
        </span>
        {item.label}
      </button>
    );
  };

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
      <div
        style={{
          padding: '24px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <div style={{ fontFamily: fonts.heading, fontSize: '24px', fontWeight: 700, color: '#fff', lineHeight: 1 }}>
          e-Arzuhal
        </div>

        <div
          style={{
            fontSize: '11px',
            color: 'rgba(255,255,255,0.5)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          Akıllı Sözleşme Sistemi
        </div>
      </div>

      <nav style={{ flex: 1, padding: '16px 12px' }}>
        {menuItems.map(renderItem)}
      </nav>

      <div style={{ padding: '14px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => onPageChange('settings')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: radius.md,
              border: 'none',
              background: currentPage === 'settings' ? 'rgba(200, 150, 62, 0.15)' : 'transparent',
              color: currentPage === 'settings' ? colors.accent : 'rgba(255,255,255,0.7)',
              fontFamily: fonts.body,
              fontSize: '14px',
              fontWeight: currentPage === 'settings' ? 600 : 400,
              cursor: 'pointer',
              transition: `all ${transitions.base}`,
              textAlign: 'left',
              minWidth: 0,
            }}
          >
            <span style={{ width: 22, height: 22, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <NavIcon name="settings" />
            </span>
            Ayarlar
          </button>

          <div style={{ flexShrink: 0 }}>
            <ThemeToggle value={theme} onChange={setTheme} />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
