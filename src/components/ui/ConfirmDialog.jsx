import React from 'react';
import { colors, fonts, radius } from '../../styles/tokens';
import Button from './Button';

const ConfirmDialog = ({
  open,
  title = 'Onay',
  message,
  confirmLabel = 'Onayla',
  cancelLabel = 'Vazgeç',
  variant = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  const overlayStyle = {
    position: 'fixed', inset: 0, zIndex: 1100,
    background: 'rgba(0,0,0,0.55)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '24px',
    animation: 'fadeIn 0.15s ease',
  };

  const modalStyle = {
    background: colors.surface,
    borderRadius: radius.lg,
    padding: '28px 30px',
    maxWidth: '440px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    animation: 'fadeInUp 0.2s ease',
  };

  const accentColor = variant === 'danger' ? colors.error : colors.accent;

  return (
    <div style={overlayStyle} onClick={onCancel} role="dialog" aria-modal="true">
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <h3 style={{
          fontFamily: fonts.heading,
          fontSize: '18px',
          fontWeight: 700,
          marginBottom: '10px',
          color: accentColor,
        }}>
          {title}
        </h3>
        <p style={{
          fontSize: '14px',
          lineHeight: 1.6,
          color: colors.textSecondary,
          marginBottom: '22px',
        }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant === 'danger' ? 'ghost' : 'accent'}
            onClick={onConfirm}
            loading={loading}
            style={variant === 'danger' ? {
              background: colors.error,
              color: '#fff',
              border: `1px solid ${colors.error}`,
            } : undefined}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
