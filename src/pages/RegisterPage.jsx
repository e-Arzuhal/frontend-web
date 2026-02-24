/**
 * e-Arzuhal Register Page
 * Kullanıcı kayıt sayfası
 */

import React, { useState } from 'react';
import { Card, Button, Input } from '../components/ui';
import { colors, fonts, radius } from '../styles/tokens';
import authService from '../services/auth.service';

const UserIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden xmlns="http://www.w3.org/2000/svg">
    <path d="M20 21a8 8 0 0 0-16 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

const EmailIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6h16v12H4V6z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

const PhoneIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden xmlns="http://www.w3.org/2000/svg">
    <path d="M6.5 3h3l1.5 5-2 1.5c1.2 2.5 3.1 4.3 5.5 5.5L16 13l5 1.5v3c0 1.1-.9 2-2 2C10.8 19.5 4.5 13.2 4.5 5c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

const LockIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden xmlns="http://www.w3.org/2000/svg">
    <path d="M7 11V8a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M6 11h12v10H6V11z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

const ArrowRightIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const RegisterPage = ({ onRegister, onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirm: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Ad soyad zorunludur.';
    else if (formData.name.trim().length < 3) newErrors.name = 'Ad soyad en az 3 karakter olmalıdır.';

    if (!formData.email.trim()) newErrors.email = 'E-posta zorunludur.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Geçerli bir e-posta girin.';

    if (!formData.phone.trim()) newErrors.phone = 'Telefon zorunludur.';

    if (!formData.password) newErrors.password = 'Şifre zorunludur.';
    else if (formData.password.length < 8) newErrors.password = 'Şifre en az 8 karakter olmalıdır.';

    if (formData.password !== formData.passwordConfirm) newErrors.passwordConfirm = 'Şifreler eşleşmiyor.';

    if (!acceptTerms) newErrors.terms = 'Kullanım Koşullarını kabul etmelisiniz.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);

    try {
      // Split name into first and last name
      const nameParts = formData.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const response = await authService.register({
        username: formData.email.split('@')[0], // Use email prefix as username
        email: formData.email,
        password: formData.password,
        firstName: firstName,
        lastName: lastName,
      });

      onRegister(response.userInfo);
    } catch (err) {
      setErrors({ general: err.message || 'Kayıt başarısız. Lütfen tekrar deneyin.' });
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
      background: `radial-gradient(900px 520px at 50% -10%, rgba(232,200,130,0.16) 0%, rgba(232,200,130,0) 60%), linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%)`,
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '520px', animation: 'fadeInUp 0.45s ease' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '18px' }}>
          <h1 style={{ fontFamily: fonts.heading, fontSize: '34px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
            e-Arzuhal
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            Akıllı Sözleşme Sistemi
          </p>
        </div>

        {/* Register Card */}
        <Card
          hover={false}
          style={{
            padding: '38px 34px',
            background: 'rgba(255,255,255,0.96)',
            border: '1px solid rgba(226,230,238,0.9)',
            boxShadow: '0 18px 50px rgba(15, 26, 48, 0.28)',
            backdropFilter: 'blur(10px)',
            borderRadius: radius.xl,
          }}
        >
          <h2 style={{
            fontFamily: fonts.heading,
            fontSize: '24px',
            fontWeight: 650,
            color: colors.text,
            marginBottom: '6px',
            textAlign: 'center',
          }}>
            Hesap Oluşturun
          </h2>
          <p style={{
            fontSize: '13px',
            color: colors.textSecondary,
            textAlign: 'center',
            marginBottom: '24px',
          }}>
            Kurumsal yönetim dünyasına adım atın.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '14px' }}>
              <Input
                label="AD SOYAD"
                placeholder="Adınız Soyadınız"
                value={formData.name}
                onChange={handleChange('name')}
                error={errors.name}
                icon={<UserIcon />}
                iconBoxed
                required
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <Input
                label="E-POSTA ADRESİ"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="ornek@kurum.com"
                value={formData.email}
                onChange={handleChange('email')}
                error={errors.email}
                icon={<EmailIcon />}
                iconBoxed
                required
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <Input
                label="TELEFON"
                type="tel"
                name="phone"
                autoComplete="tel"
                placeholder="05XX XXX XX XX"
                value={formData.phone}
                onChange={handleChange('phone')}
                error={errors.phone}
                icon={<PhoneIcon />}
                iconBoxed
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              <Input
                label="ŞİFRE"
                type="password"
                name="password"
                autoComplete="new-password"
                placeholder="En az 8 karakter"
                value={formData.password}
                onChange={handleChange('password')}
                error={errors.password}
                icon={<LockIcon />}
                iconBoxed
                required
              />
              <Input
                label="ŞİFRE TEKRAR"
                type="password"
                name="passwordConfirm"
                autoComplete="new-password"
                placeholder="Tekrar girin"
                value={formData.passwordConfirm}
                onChange={handleChange('passwordConfirm')}
                error={errors.passwordConfirm}
                icon={<LockIcon />}
                iconBoxed
                required
              />
            </div>

            {/* Terms */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                <div
                  onClick={() => setAcceptTerms(!acceptTerms)}
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '4px',
                    border: `2px solid ${errors.terms ? colors.error : acceptTerms ? colors.accent : colors.border}`,
                    background: acceptTerms ? colors.accent : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  {acceptTerms && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span style={{ fontSize: '12px', color: colors.textSecondary, lineHeight: 1.55 }}>
                  <span style={{ color: colors.accent, cursor: 'pointer', fontWeight: 600 }}>Kullanım Koşulları</span> ve{' '}
                  <span style={{ color: colors.accent, cursor: 'pointer', fontWeight: 600 }}>Gizlilik Politikası</span>'nı okudum, kabul ediyorum.
                </span>
              </label>
              {errors.terms && (
                <p style={{ fontSize: '12px', color: colors.error, marginTop: '6px', marginLeft: '30px' }}>
                  {errors.terms}
                </p>
              )}
            </div>

            {errors.general && (
              <div style={{
                padding: '12px 14px',
                background: colors.errorBg,
                color: colors.error,
                borderRadius: radius.md,
                fontSize: '13px',
                marginBottom: '14px',
                border: `1px solid rgba(192, 57, 43, 0.25)`,
              }}>
                {errors.general}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={isLoading}
              icon={<ArrowRightIcon />}
              style={{ marginTop: '4px', boxShadow: '0 10px 18px rgba(15, 26, 48, 0.18)' }}
            >
              Kayıt Ol
            </Button>
          </form>

          <div style={{ marginTop: '18px', paddingTop: '18px', borderTop: `1px solid ${colors.border}`, textAlign: 'center' }}>
            <span style={{ fontSize: '13px', color: colors.textSecondary }}>Zaten bir hesabınız var mı? </span>
            <button
              type="button"
              onClick={() => onNavigate('login')}
              style={{
                background: 'none',
                border: 'none',
                color: colors.accent,
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                fontFamily: fonts.body,
                padding: 0,
              }}
            >
              Giriş Yapın
            </button>
          </div>
        </Card>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '18px', color: 'rgba(255,255,255,0.55)', fontSize: '12px' }}>
          <div style={{ marginBottom: '6px' }}>© 2026 e-Arzuhal. Tüm hakları saklıdır.</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button type="button" onClick={() => {}} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.55)', cursor: 'pointer', fontSize: '12px', fontFamily: fonts.body }}>
              KVKK
            </button>
            <button type="button" onClick={() => {}} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.55)', cursor: 'pointer', fontSize: '12px', fontFamily: fonts.body }}>
              Kullanım
            </button>
            <button type="button" onClick={() => {}} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.55)', cursor: 'pointer', fontSize: '12px', fontFamily: fonts.body }}>
              Destek
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
