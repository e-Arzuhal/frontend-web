import React, { useState } from 'react';
import { colors, fonts, radius } from '../../styles/tokens';
import Button from './Button';
import Input from './Input';
import authService from '../../services/auth.service';

const ForgotPasswordModal = ({ open, onClose }) => {
  const [step, setStep] = useState(1); // 1: e-posta iste | 2: kod + yeni şifre | 3: tamamlandı
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const reset = () => {
    setStep(1);
    setEmail('');
    setCode('');
    setNewPassword('');
    setNewPasswordConfirm('');
    setError('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const requestCode = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Lütfen geçerli bir e-posta adresi girin.');
      return;
    }
    setSubmitting(true);
    try {
      await authService.requestPasswordReset(email);
      setStep(2);
    } catch (err) {
      const raw = err?.message || '';
      if (/failed to fetch|networkerror|timeout|zaman aşımı/i.test(raw)) {
        setError('Sunucuya bağlanılamadı. Lütfen tekrar deneyin.');
      } else {
        // Enumeration sızıntısını engellemek için backend her durumda 200 döner; yine de adım 2'ye geç.
        setStep(2);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const submitNewPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (!code || code.trim().length !== 6) {
      setError('Lütfen e-postanıza gelen 6 haneli kodu girin.');
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      setError('Yeni şifre en az 8 karakter olmalıdır.');
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      setError('Şifreler eşleşmiyor.');
      return;
    }
    setSubmitting(true);
    try {
      await authService.confirmPasswordReset(email, code.trim(), newPassword);
      setStep(3);
    } catch (err) {
      const raw = err?.message || '';
      if (/failed to fetch|networkerror/i.test(raw)) {
        setError('Sunucuya bağlanılamadı. Lütfen tekrar deneyin.');
      } else if (/geçersiz|süresi dolmuş|hatalı/i.test(raw)) {
        setError('Kod hatalı veya süresi dolmuş. Lütfen yeni bir kod talep edin.');
      } else {
        setError(raw || 'İşlem başarısız oldu. Lütfen tekrar deneyin.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const overlayStyle = {
    position: 'fixed', inset: 0, zIndex: 1200,
    background: 'rgba(0,0,0,0.55)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '24px',
  };

  const modalStyle = {
    background: colors.surface,
    borderRadius: radius.lg,
    padding: '28px 30px',
    maxWidth: '440px',
    width: '100%',
    boxShadow: '0 25px 70px rgba(0,0,0,0.4)',
  };

  return (
    <div style={overlayStyle} onClick={handleClose} role="dialog" aria-modal="true">
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ fontFamily: fonts.heading, fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>
          Şifremi Unuttum
        </h2>

        {step === 1 && (
          <>
            <p style={{ fontSize: '13px', color: colors.textSecondary, lineHeight: 1.6, marginBottom: '18px' }}>
              Hesabınıza tanımlı e-posta adresini girin. Şifrenizi yenileyebilmeniz için 6 haneli bir doğrulama kodu göndereceğiz.
            </p>
            <form onSubmit={requestCode}>
              <div style={{ marginBottom: '14px' }}>
                <Input
                  label="E-posta"
                  type="email"
                  placeholder="ornek@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {error && (
                <div style={{
                  padding: '10px 12px',
                  background: colors.errorBg,
                  color: colors.error,
                  borderRadius: radius.md,
                  fontSize: '13px',
                  marginBottom: '12px',
                }}>{error}</div>
              )}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <Button type="button" variant="outline" onClick={handleClose} disabled={submitting}>Vazgeç</Button>
                <Button type="submit" variant="accent" loading={submitting}>Kod Gönder</Button>
              </div>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <p style={{ fontSize: '13px', color: colors.textSecondary, lineHeight: 1.6, marginBottom: '18px' }}>
              <strong>{email}</strong> adresine 6 haneli bir doğrulama kodu gönderdik (eğer bu e-posta sistemde kayıtlıysa).
              Kodu ve belirleyeceğiniz yeni şifreyi aşağıya girin.
            </p>
            <form onSubmit={submitNewPassword}>
              <div style={{ marginBottom: '12px' }}>
                <Input
                  label="Doğrulama Kodu"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="6 haneli kod"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <Input
                  label="Yeni Şifre"
                  type="password"
                  placeholder="En az 8 karakter"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div style={{ marginBottom: '14px' }}>
                <Input
                  label="Yeni Şifre (Tekrar)"
                  type="password"
                  placeholder="Tekrar girin"
                  value={newPasswordConfirm}
                  onChange={(e) => setNewPasswordConfirm(e.target.value)}
                  required
                />
              </div>
              {error && (
                <div style={{
                  padding: '10px 12px',
                  background: colors.errorBg,
                  color: colors.error,
                  borderRadius: radius.md,
                  fontSize: '13px',
                  marginBottom: '12px',
                }}>{error}</div>
              )}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => { setStep(1); setError(''); setCode(''); }}
                  disabled={submitting}
                  style={{
                    background: 'none', border: 'none',
                    color: colors.accent, fontWeight: 600, fontSize: '13px',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    fontFamily: fonts.body, padding: 0,
                  }}
                >
                  ← E-postayı değiştir
                </button>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Button type="button" variant="outline" onClick={handleClose} disabled={submitting}>Vazgeç</Button>
                  <Button type="submit" variant="accent" loading={submitting}>Şifreyi Sıfırla</Button>
                </div>
              </div>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <p style={{ fontSize: '13px', color: colors.textSecondary, lineHeight: 1.6, marginBottom: '20px' }}>
              Şifreniz başarıyla güncellendi. Yeni şifrenizle giriş yapabilirsiniz.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="accent" onClick={handleClose}>Tamam</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
