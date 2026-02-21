import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TopBar } from '../components/layout';
import { Card, Button, Badge } from '../components/ui';
import { colors, fonts, radius } from '../styles/tokens';
import verificationService from '../services/verification.service';

/* ────────────────────────────── Icons ────────────────────────────── */
const ShieldCheckIcon = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ShieldIcon = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

const CameraIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden xmlns="http://www.w3.org/2000/svg">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const IdCardIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
    <circle cx="8" cy="12" r="2" stroke="currentColor" strokeWidth="2" />
    <path d="M13 10h5M13 14h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const NfcIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden xmlns="http://www.w3.org/2000/svg">
    <path d="M20 12a8 8 0 0 1-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M16.5 12a4.5 4.5 0 0 1-4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M7.5 12a4.5 4.5 0 0 1 4.5-4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </svg>
);

/* ──────────────────── TC No frontend doğrulama ──────────────────── */
const isValidTcNo = (tcNo) => {
  if (!/^\d{11}$/.test(tcNo)) return false;
  if (tcNo[0] === '0') return false;
  const d = tcNo.split('').map(Number);
  const d10 = ((7 * (d[0] + d[2] + d[4] + d[6] + d[8]) - (d[1] + d[3] + d[5] + d[7])) % 10 + 10) % 10;
  if (d[9] !== d10) return false;
  const sum = d.slice(0, 10).reduce((a, b) => a + b, 0);
  return d[10] === sum % 10;
};

/* ───────────────────────── Ana bileşen ──────────────────────────── */
const VerificationPage = () => {
  const [verificationStatus, setVerificationStatus] = useState(null); // VerificationResponse
  const [activeMode, setActiveMode] = useState('manual'); // 'manual' | 'camera'
  const [form, setForm] = useState({ tcNo: '', firstName: '', lastName: '', dateOfBirth: '' });
  const [tcError, setTcError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);

  // Kamera
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraError, setCameraError] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  /* Mevcut doğrulama durumunu yükle */
  useEffect(() => {
    verificationService.getStatus()
      .then(setVerificationStatus)
      .catch(() => {})
      .finally(() => setIsLoadingStatus(false));
  }, []);

  /* Kamera başlat / durdur */
  const startCamera = useCallback(async () => {
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch {
      setCameraError('Kamera erişimi sağlanamadı. Tarayıcı izinlerini kontrol edin.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  useEffect(() => {
    if (activeMode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [activeMode, startCamera, stopCamera]);

  /* TC No girişi doğrulama */
  const handleTcChange = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 11);
    setForm(f => ({ ...f, tcNo: digits }));
    if (digits.length === 11) {
      setTcError(isValidTcNo(digits) ? '' : 'Geçersiz TC Kimlik Numarası.');
    } else {
      setTcError('');
    }
  };

  /* Manuel form gönder */
  const handleSubmit = async () => {
    if (!isValidTcNo(form.tcNo)) { setTcError('Geçersiz TC Kimlik Numarası.'); return; }
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setSubmitError('Ad ve soyad zorunludur.'); return;
    }
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const result = await verificationService.verify({
        tcNo: form.tcNo,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        dateOfBirth: form.dateOfBirth || null,
        method: 'MANUAL',
      });
      setVerificationStatus(result);
    } catch (err) {
      setSubmitError(err.message || 'Doğrulama sırasında hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* Kamera ile tarama simülasyonu (MRZ OCR backend'e bağlandığında gerçeğe dönecek) */
  const handleCameraCapture = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
      setCameraError('Kimlik kartı tanınamadı. Lütfen kartı düzgün konumlandırın veya Manuel Giriş yöntemini kullanın.');
    }, 2000);
  };

  /* ─────────────── Durum kartı ─────────────── */
  const renderStatusCard = () => {
    if (isLoadingStatus) return null;

    const isVerified = verificationStatus?.verified;
    return (
      <Card style={{ padding: '28px', marginBottom: '24px' }} hover={false}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: 64, height: 64,
            borderRadius: radius.full,
            background: isVerified ? colors.successBg : colors.surfaceAlt,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: isVerified ? colors.success : colors.textMuted,
            flexShrink: 0,
          }}>
            {isVerified ? <ShieldCheckIcon size={32} /> : <ShieldIcon size={32} />}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <h3 style={{ fontFamily: fonts.heading, fontSize: '18px', fontWeight: 600, margin: 0 }}>
                {isVerified ? 'Kimlik Doğrulandı' : 'Kimlik Doğrulanmamış'}
              </h3>
              <Badge variant={isVerified ? 'success' : 'default'}>
                {isVerified ? 'Doğrulandı' : 'Bekliyor'}
              </Badge>
            </div>
            {isVerified ? (
              <div style={{ fontSize: '13px', color: colors.textSecondary, display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                <span>TC: <strong style={{ color: colors.text }}>{verificationStatus.tcNoMasked}</strong></span>
                <span>Ad: <strong style={{ color: colors.text }}>{verificationStatus.firstName} {verificationStatus.lastName}</strong></span>
                <span>Yöntem: <strong style={{ color: colors.text }}>{verificationStatus.verificationMethod}</strong></span>
              </div>
            ) : (
              <p style={{ fontSize: '13px', color: colors.textSecondary, margin: 0 }}>
                Sözleşmelerinizi imzalamak için kimlik doğrulaması yapmanız önerilir.
              </p>
            )}
          </div>
        </div>
      </Card>
    );
  };

  /* ─────────────── Mod seçici ─────────────── */
  const renderModeTabs = () => (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
      {[
        { key: 'manual', label: 'Manuel Giriş', Icon: IdCardIcon },
        { key: 'camera', label: 'Kamera ile Tara', Icon: CameraIcon },
      ].map(({ key, label, Icon }) => (
        <button
          key={key}
          onClick={() => setActiveMode(key)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', borderRadius: radius.md,
            border: `1px solid ${activeMode === key ? colors.accent : colors.border}`,
            background: activeMode === key ? 'rgba(200,150,62,0.1)' : 'transparent',
            color: activeMode === key ? colors.accent : colors.textSecondary,
            fontFamily: fonts.body, fontSize: '14px', fontWeight: activeMode === key ? 600 : 400,
            cursor: 'pointer',
          }}
        >
          <Icon size={16} /> {label}
        </button>
      ))}
    </div>
  );

  /* ─────────────── Manuel form ─────────────── */
  const inputStyle = {
    width: '100%', padding: '10px 14px',
    background: colors.surfaceAlt, border: `1px solid ${colors.border}`,
    borderRadius: radius.md, color: colors.text,
    fontFamily: fonts.body, fontSize: '14px',
    outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle = { display: 'block', fontSize: '13px', color: colors.textSecondary, marginBottom: '6px', fontFamily: fonts.body };

  const renderManualForm = () => (
    <Card style={{ padding: '28px' }} hover={false}>
      <h3 style={{ fontFamily: fonts.heading, fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>
        TC Kimlik Bilgileri
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div>
          <label style={labelStyle}>TC Kimlik Numarası *</label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={11}
            placeholder="12345678901"
            value={form.tcNo}
            onChange={e => handleTcChange(e.target.value)}
            style={{ ...inputStyle, borderColor: tcError ? colors.error : colors.border, letterSpacing: '2px' }}
          />
          {tcError && (
            <p style={{ fontSize: '12px', color: colors.error, marginTop: '4px' }}>{tcError}</p>
          )}
        </div>

        <div>
          <label style={labelStyle}>Doğum Tarihi</label>
          <input
            type="date"
            value={form.dateOfBirth}
            onChange={e => setForm(f => ({ ...f, dateOfBirth: e.target.value }))}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Ad *</label>
          <input
            type="text"
            placeholder="Adınız"
            value={form.firstName}
            onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Soyad *</label>
          <input
            type="text"
            placeholder="Soyadınız"
            value={form.lastName}
            onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
            style={inputStyle}
          />
        </div>
      </div>

      {submitError && (
        <div style={{
          padding: '12px', background: colors.errorBg, color: colors.error,
          borderRadius: radius.md, fontSize: '13px', marginBottom: '16px',
        }}>
          {submitError}
        </div>
      )}

      <div style={{
        padding: '12px 16px', background: colors.surfaceAlt,
        borderRadius: radius.md, fontSize: '12px', color: colors.textMuted,
        marginBottom: '20px', lineHeight: 1.6,
      }}>
        <strong>Gizlilik:</strong> TC Kimlik Numaranız güvenli şekilde maskelenerek saklanır.
        Hiçbir zaman açık metin olarak depolanmaz.
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="accent"
          onClick={handleSubmit}
          loading={isSubmitting}
          disabled={form.tcNo.length !== 11 || !!tcError || !form.firstName.trim() || !form.lastName.trim()}
        >
          {isSubmitting ? 'Doğrulanıyor...' : 'Kimliği Doğrula'}
        </Button>
      </div>
    </Card>
  );

  /* ─────────────── Kamera görünümü ─────────────── */
  const renderCameraView = () => (
    <Card style={{ padding: '24px' }} hover={false}>
      <h3 style={{ fontFamily: fonts.heading, fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>
        Kimlik Kartı Tarama
      </h3>
      <p style={{ fontSize: '13px', color: colors.textSecondary, marginBottom: '20px', lineHeight: 1.6 }}>
        Kimlik kartınızın arka yüzündeki MRZ alanını (alt kısımdaki makine okuma bölümü) çerçeveye getirin.
      </p>

      {/* Kamera alanı */}
      <div style={{
        position: 'relative', background: '#000',
        borderRadius: radius.md, overflow: 'hidden',
        aspectRatio: '16/9', marginBottom: '16px',
      }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: isCameraActive ? 'block' : 'none' }}
        />

        {/* MRZ tarama çerçevesi */}
        {isCameraActive && (
          <div style={{
            position: 'absolute', bottom: '15%', left: '10%', right: '10%',
            height: '22%', border: '2px solid rgba(200,150,62,0.9)',
            borderRadius: '4px', boxShadow: '0 0 0 9999px rgba(0,0,0,0.45)',
          }}>
            <div style={{
              position: 'absolute', top: '-20px', left: 0,
              fontSize: '11px', color: colors.accent, fontFamily: fonts.body,
              background: 'rgba(0,0,0,0.7)', padding: '2px 8px', borderRadius: '4px',
            }}>
              MRZ Bölgesi
            </div>
            {/* Köşe marker'ları */}
            {[
              { top: -2, left: -2, borderTop: '3px solid', borderLeft: '3px solid' },
              { top: -2, right: -2, borderTop: '3px solid', borderRight: '3px solid' },
              { bottom: -2, left: -2, borderBottom: '3px solid', borderLeft: '3px solid' },
              { bottom: -2, right: -2, borderBottom: '3px solid', borderRight: '3px solid' },
            ].map((s, i) => (
              <div key={i} style={{ position: 'absolute', width: 16, height: 16, borderColor: colors.accent, ...s }} />
            ))}
          </div>
        )}

        {/* Yükleniyor */}
        {!isCameraActive && !cameraError && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: colors.textMuted }}>
            <p>Kamera başlatılıyor...</p>
          </div>
        )}

        {/* Hata */}
        {cameraError && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            height: '100%', padding: '24px', textAlign: 'center', gap: '12px',
          }}>
            <p style={{ color: colors.error, fontSize: '14px' }}>{cameraError}</p>
            <Button variant="outline" onClick={startCamera}>Yeniden Dene</Button>
          </div>
        )}
      </div>

      {/* Mobil NFC yönlendirmesi */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '14px',
        padding: '14px 16px', background: 'rgba(200,150,62,0.07)',
        border: `1px solid rgba(200,150,62,0.25)`, borderRadius: radius.md,
        marginBottom: '16px',
      }}>
        <span style={{ color: colors.accent, flexShrink: 0 }}><NfcIcon size={24} /></span>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: colors.text, marginBottom: '2px' }}>
            Daha hızlı doğrulama için mobil uygulamayı kullanın
          </div>
          <div style={{ fontSize: '12px', color: colors.textSecondary }}>
            Mobil uygulamada NFC ile kimliğinizi saniyeler içinde doğrulayabilirsiniz.
          </div>
        </div>
      </div>

      {isCameraActive && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="accent" onClick={handleCameraCapture} loading={isCapturing}>
            {isCapturing ? 'Taranıyor...' : 'Tara'}
          </Button>
        </div>
      )}
    </Card>
  );

  return (
    <div style={{ animation: 'fadeInUp 0.35s ease' }}>
      <TopBar
        title="Kimlik Doğrulama"
        subtitle="TC Kimlik Kartınızı doğrulayarak sözleşmelerinizi güvence altına alın."
      />
      <div style={{ padding: '28px 32px', maxWidth: '800px', margin: '0 auto' }}>
        {renderStatusCard()}

        {/* Zaten doğrulandıysa sadece yeniden doğrulama seçeneği göster */}
        {verificationStatus?.verified && (
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="outline"
              onClick={() => setVerificationStatus(null)}
            >
              Yeniden Doğrula
            </Button>
          </div>
        )}

        {!verificationStatus?.verified && (
          <>
            {renderModeTabs()}
            {activeMode === 'manual' ? renderManualForm() : renderCameraView()}
          </>
        )}
      </div>
    </div>
  );
};

export default VerificationPage;
