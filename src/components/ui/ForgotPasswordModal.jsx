import React, { useState } from 'react';
import { colors, fonts, radius } from '../../styles/tokens';
import Button from './Button';
import Input from './Input';
import authService from '../../services/auth.service';

const ForgotPasswordModal = ({ open, onClose }) => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Lütfen e-posta adresinizi girin.');
      return;
    }
    setSubmitting(true);
    try {
      await authService.requestPasswordReset(email);
      // Güvenlik gereği e-posta var/yok bilgisi sızdırılmaz; her zaman aynı yanıt.
      setDone(true);
    } catch (err) {
      // Kullanıcıya yine de "gönderildi" mesajı göster (enumeration saldırısı önleme),
      // sadece ağ hatası olursa generic hata göster.
      const raw = err?.message || '';
      if (/failed to fetch|networkerror|timeout|zaman aşımı/i.test(raw)) {
        setError('Sunucuya bağlanılamadı. Lütfen tekrar deneyin.');
      } else {
        setDone(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setDone(false);
    setError('');
    onClose();
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
        {!done ? (
          <>
            <p style={{ fontSize: '13px', color: colors.textSecondary, lineHeight: 1.6, marginBottom: '18px' }}>
              Hesabınıza tanımlı e-posta adresini girin. Şifre sıfırlama bağlantısını e-posta ile göndereceğiz.
            </p>
            <form onSubmit={handleSubmit}>
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
                }}>
                  {error}
                </div>
              )}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <Button type="button" variant="outline" onClick={handleClose} disabled={submitting}>Vazgeç</Button>
                <Button type="submit" variant="accent" loading={submitting}>Bağlantıyı Gönder</Button>
              </div>
            </form>
          </>
        ) : (
          <>
            <p style={{ fontSize: '13px', color: colors.textSecondary, lineHeight: 1.6, marginBottom: '20px' }}>
              <strong>{email}</strong> adresine bir şifre sıfırlama bağlantısı gönderildi (eğer bu e-posta sistemde kayıtlıysa). Birkaç dakika içinde gelmezse spam klasörünü kontrol edin.
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
