import React from 'react';
import { colors, radius, fonts } from '../../styles/tokens';

const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: { bg: colors.surfaceAlt, color: colors.textSecondary },
    accent: { bg: colors.accentMuted, color: colors.accent },
    success: { bg: colors.successBg, color: colors.success },
    warning: { bg: colors.warningBg, color: colors.warning },
    error: { bg: colors.errorBg, color: colors.error },
    info: { bg: colors.infoBg, color: colors.info },
  };

  const v = variants[variant];

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 10px',
      borderRadius: radius.full,
      fontSize: '12px',
      fontFamily: fonts.body,
      fontWeight: 600,
      background: v.bg,
      color: v.color,
    }}>
      {children}
    </span>
  );
};

export default Badge;
