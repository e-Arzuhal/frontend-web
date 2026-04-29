/**
 * Two-Factor Verification Modal
 * Sends a 6-digit OTP to the user's email and verifies it.
 */

import React, { useEffect, useState } from 'react';
import { colors, fonts, radius } from '../../styles/tokens';
import authService from '../../services/auth.service';
import Button from './Button';
import Input from './Input';

const TwoFactorModal = ({ open, action = 'enable', onClose, onSuccess }) => {
  const [code, setCode] = useState('');
  const [info, setInfo] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (!open) {
      setCode('');
      setInfo('');
      setError('');
      setSending(false);
      setVerifying(false);
    }
  }, [open]);

  if (!open) return null;

  const handleSend = async () => {
    setError('');
    setInfo('');
    setSending(true);
    try {
      await authService.send2faCode(action);
      setInfo('Doğrulama kodu e-posta adresinize gönderildi. Lütfen kontrol edin.');
    } catch (err) {
      setError(err.message || 'Kod gönderilemedi. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setSending(false);
    }
  };

  const handleVerify = async () => {
    setError('');
    setInfo('');
    if (!code || code.trim().length < 4) {
      setError('Lütfen e-posta ile gönderilen kodu girin.');
      return;
    }
    setVerifying(true);
    try {
      await authService.verify2faCode(code.trim(), action);
      setInfo('Doğrulama başarılı.');
      onSuccess?.();
      setTimeout(() => onClose?.(), 700);
    } catch (err) {
      setError(err.message || 'Kod doğrulanamadı. Lütfen tekrar deneyin.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 26, 48, 0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 4000,
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 460,
          background: '#fff',
          borderRadius: radius.lg,
          boxShadow: '0 18px 50px rgba(15, 26, 48, 0.28)',
          padding: 24,
          fontFamily: fonts.body,
        }}
      >
        <h2 style={{ fontFamily: fonts.heading, fontSize: 20, fontWeight: 700, color: colors.text, marginBottom: 6 }}>
          İki Faktörlü Doğrulama
        </h2>
        <p style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 16, lineHeight: 1.55 }}>
          E-posta adresinize gönderilen 6 haneli kodu girerek bu işlemi onaylayın.
        </p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <Button variant="outline" onClick={handleSend} disabled={sending}>
            {sending ? 'Gönderiliyor...' : 'Kodu Gönder'}
          </Button>
        </div>

        <Input
          label="Doğrulama Kodu"
          placeholder="6 haneli kod"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\s+/g, ''))}
          inputMode="numeric"
          maxLength={8}
        />

        {info && (
          <div style={{
            marginTop: 12,
            padding: '10px 12px',
            background: colors.successBg,
            color: colors.success,
            borderRadius: radius.md,
            fontSize: 13,
          }}>
            {info}
          </div>
        )}
        {error && (
          <div style={{
            marginTop: 12,
            padding: '10px 12px',
            background: colors.errorBg,
            color: colors.error,
            borderRadius: radius.md,
            fontSize: 13,
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
          <Button variant="ghost" onClick={onClose}>İptal</Button>
          <Button variant="accent" onClick={handleVerify} disabled={verifying}>
            {verifying ? 'Doğrulanıyor...' : 'Doğrula'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorModal;
