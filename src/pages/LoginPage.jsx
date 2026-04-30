/**
 * e-Arzuhal Login Page
 * Kullanıcı giriş sayfası
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, LegalModal, ForgotPasswordModal } from '../components/ui';
import { colors, fonts, radius } from '../styles/tokens';
import authService from '../services/auth.service';

const friendlyAuthError = (raw) => {
  const m = (raw || '').toString();
  if (!m) return 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.';
  if (/invalid username or password/i.test(m)) return 'Kullanıcı adı veya şifre hatalı.';
  if (/bad credentials/i.test(m)) return 'Kullanıcı adı veya şifre hatalı.';
  if (/user.*not.*found/i.test(m)) return 'Bu e-posta ile kayıtlı bir hesap bulunamadı.';
  if (/account.*lock|too many attempts/i.test(m)) return 'Çok fazla başarısız deneme. Lütfen biraz sonra tekrar deneyin.';
  if (/timeout|zaman aşımı|abort/i.test(m)) return 'İşlem zaman aşımına uğradı. Lütfen tekrar deneyin.';
  if (/failed to fetch|networkerror/i.test(m)) return 'Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edin.';
  if (/HTTP 5\d{2}/.test(m)) return 'Sunucuda geçici bir sorun oluştu. Lütfen daha sonra tekrar deneyin.';
  return m;
};

const EmailIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6h16v12H4V6z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

const LockIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden xmlns="http://www.w3.org/2000/svg">
    <path d="M7 11V8a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M6 11h12v10H6V11z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [legalModal, setLegalModal] = useState(null);
  const [showForgot, setShowForgot] = useState(false);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');

    if (!email || !password) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }
    if (twoFactorRequired && (!twoFactorCode || twoFactorCode.length < 4)) {
      setError('Lütfen e-postanıza gelen 6 haneli kodu girin.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.login(
        email,
        password,
        twoFactorRequired ? twoFactorCode : undefined,
      );
      if (response?.requires2fa && !response.accessToken) {
        setTwoFactorRequired(true);
        setTwoFactorCode('');
        setInfo('E-postanıza 6 haneli bir doğrulama kodu gönderildi. Lütfen kodu girerek girişi tamamlayın.');
        return;
      }
      onLogin(response.userInfo);
    } catch (err) {
      setError(friendlyAuthError(err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError('');
    setInfo('');
    setIsLoading(true);
    try {
      const response = await authService.login(email, password);
      if (response?.requires2fa) {
        setInfo('Yeni bir kod e-posta adresinize gönderildi.');
      }
    } catch (err) {
      setError(friendlyAuthError(err.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `radial-gradient(1000px 500px at 50% -10%, rgba(232,200,130,0.18) 0%, rgba(232,200,130,0) 60%), linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%)`,
      padding: '20px',
    }}>
      <div style={{ width: '100%', maxWidth: '420px', animation: 'fadeInUp 0.45s ease' }}>
        <div style={{ textAlign: 'center', marginBottom: '18px' }}>
          <img
            src={`${process.env.PUBLIC_URL || ''}/e-Arzuhal-logo.png`}
            alt="e-Arzuhal"
            width={72}
            height={72}
            style={{ borderRadius: '16px', objectFit: 'contain', marginBottom: '10px', background: 'rgba(255,255,255,0.08)' }}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <h1 style={{ fontFamily: fonts.heading, fontSize: '36px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
            e-Arzuhal
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            Akıllı Sözleşme Sistemi
          </p>
        </div>

        <Card
          hover={false}
          style={{
            padding: '34px 30px',
            background: 'rgba(255,255,255,0.96)',
            border: '1px solid rgba(226,230,238,0.9)',
            boxShadow: '0 18px 50px rgba(15, 26, 48, 0.28)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '18px' }}>
            <h2 style={{ fontFamily: fonts.heading, fontSize: '22px', fontWeight: 650, color: colors.text, marginBottom: '6px' }}>
              Hoş Geldiniz
            </h2>
            <p style={{ fontSize: '13px', color: colors.textSecondary, margin: 0 }}>
              Hesabınıza güvenle giriş yapın.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '14px' }}>
              <Input
                label="E-posta"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="ornek@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<EmailIcon />}
                required
                disabled={twoFactorRequired}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <Input
                label="Şifre"
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="Şifrenizi girin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<LockIcon />}
                required
                disabled={twoFactorRequired}
              />
            </div>

            {twoFactorRequired && (
              <div style={{ marginBottom: '14px' }}>
                <Input
                  label="Doğrulama Kodu"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="6 haneli kod"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                />
                <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => { setTwoFactorRequired(false); setTwoFactorCode(''); setInfo(''); setError(''); }}
                    style={{
                      background: 'none', border: 'none', color: colors.accent,
                      fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: fonts.body, padding: 0,
                    }}
                  >
                    ← E-posta veya şifreyi değiştir
                  </button>
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={isLoading}
                    style={{
                      background: 'none', border: 'none', color: colors.accent,
                      fontSize: 12, fontWeight: 600, cursor: isLoading ? 'not-allowed' : 'pointer',
                      fontFamily: fonts.body, padding: 0,
                    }}
                  >
                    Kodu yeniden gönder
                  </button>
                </div>
              </div>
            )}

            {info && (
              <div style={{
                padding: '12px 14px',
                background: colors.successBg,
                color: colors.success,
                borderRadius: radius.md,
                fontSize: '13px',
                marginBottom: '14px',
              }}>
                {info}
              </div>
            )}

            {error && (
              <div style={{
                padding: '12px 14px',
                background: colors.errorBg,
                color: colors.error,
                borderRadius: radius.md,
                fontSize: '13px',
                marginBottom: '14px',
                border: `1px solid rgba(192, 57, 43, 0.25)`,
              }}>
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={isLoading}
              style={{ marginBottom: '12px', boxShadow: '0 10px 18px rgba(15, 26, 48, 0.18)' }}
            >
              {twoFactorRequired ? 'Doğrula ve Giriş Yap' : 'Giriş Yap'}
            </Button>

            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => setShowForgot(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: colors.accent,
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontFamily: fonts.body,
                  fontWeight: 600,
                  padding: '6px 8px',
                }}
              >
                Şifremi Unuttum
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '18px 0 12px' }}>
              <div style={{ flex: 1, height: 1, background: colors.border }} />
              <div style={{ fontSize: '11px', color: colors.textMuted, letterSpacing: '0.12em' }}>VEYA</div>
              <div style={{ flex: 1, height: 1, background: colors.border }} />
            </div>

            <div style={{ textAlign: 'center', fontSize: '13px', color: colors.textSecondary }}>
              Hesabınız yok mu?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: colors.accent,
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: fonts.body,
                  padding: 0,
                }}
              >
                Kaydolun
              </button>
            </div>
          </form>
        </Card>

        <div style={{ textAlign: 'center', marginTop: '18px', color: 'rgba(255,255,255,0.55)', fontSize: '12px' }}>
          <div style={{ marginBottom: '6px' }}>© 2026 e-Arzuhal. Tüm hakları saklıdır.</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button type="button" onClick={() => setLegalModal('kvkk')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.55)', cursor: 'pointer', fontSize: '12px', fontFamily: fonts.body }}>
              KVKK
            </button>
            <button type="button" onClick={() => setLegalModal('terms')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.55)', cursor: 'pointer', fontSize: '12px', fontFamily: fonts.body }}>
              Kullanım Koşulları
            </button>
            <button type="button" onClick={() => setLegalModal('support')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.55)', cursor: 'pointer', fontSize: '12px', fontFamily: fonts.body }}>
              Destek
            </button>
          </div>
        </div>
      </div>
      <LegalModal open={!!legalModal} type={legalModal} onClose={() => setLegalModal(null)} />
      <ForgotPasswordModal open={showForgot} onClose={() => setShowForgot(false)} />
    </div>
  );
};

export default LoginPage;
