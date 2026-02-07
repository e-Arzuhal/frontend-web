import React from 'react';
import { colors, radius, fonts, transitions } from '../../styles/tokens';

const Button = ({ children, variant = 'primary', size = 'md', icon, disabled, loading, onClick, style }) => {
  const sizes = {
    sm: { padding: '8px 16px', fontSize: '13px' },
    md: { padding: '10px 20px', fontSize: '14px' },
    lg: { padding: '14px 28px', fontSize: '16px' },
  };

  const variants = {
    primary: { background: colors.primary, color: '#fff', border: 'none' },
    accent: { background: `linear-gradient(135deg, ${colors.accent}, ${colors.accentLight})`, color: colors.primaryDark, border: 'none' },
    outline: { background: 'transparent', color: colors.primary, border: `1.5px solid ${colors.border}` },
    ghost: { background: 'transparent', color: colors.textSecondary, border: 'none' },
    success: { background: colors.success, color: '#fff', border: 'none' },
  };

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: fonts.body,
    fontWeight: 600,
    borderRadius: radius.md,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: `all ${transitions.base}`,
    ...sizes[size],
    ...variants[variant],
    ...style,
  };

  return (
    <button
      disabled={disabled || loading}
      onClick={disabled || loading ? undefined : onClick}
      style={baseStyle}
      onMouseEnter={(e) => { if (!disabled && !loading) e.target.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; }}
    >
      {loading ? <span style={{ width: 16, height: 16, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> : icon}
      {children}
    </button>
  );
};

export default Button;
