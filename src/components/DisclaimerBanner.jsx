import React, { useState, useEffect } from 'react';
import api from '../services/api.service';

const STORAGE_KEY = 'disclaimerAccepted_v1.0';

const DisclaimerBanner = ({ onAccepted }) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Hızlı kontrol: localStorage cache'i
    if (localStorage.getItem(STORAGE_KEY)) {
      onAccepted && onAccepted();
      return;
    }
    // Backend'den gerçek durum sorgula
    api.get('/api/disclaimer/status')
      .then(data => {
        if (data.accepted) {
          localStorage.setItem(STORAGE_KEY, '1');
          onAccepted && onAccepted();
        } else {
          setVisible(true);
        }
      })
      .catch(() => setVisible(true)); // backend erişilemiyor → göster
  }, []);

  const handleAccept = async () => {
    setLoading(true);
    try {
      await api.post('/api/disclaimer/accept', { platform: 'WEB' });
      localStorage.setItem(STORAGE_KEY, '1');
      setVisible(false);
      onAccepted && onAccepted();
    } catch {
      // Hata durumunda tekrar dene mesajı gösterebiliriz; banner'ı açık bırak
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.iconWrap}>
          <span style={styles.icon}>⚖️</span>
        </div>
        <h2 style={styles.title}>Yasal Uyarı</h2>
        <p style={styles.text}>
          Bu platform tarafından sunulan hukuki tavsiyeler yanıltıcı olabilir.
          Herhangi bir sözleşme veya hukuki işlem öncesinde bir avukata danışmanız
          <strong> şiddetle tavsiye edilir.</strong>
        </p>
        <p style={styles.subtext}>
          Devam etmek için aşağıdaki butona tıklayarak bu uyarıyı okuduğunuzu
          ve anladığınızı onaylayın.
        </p>
        <button
          style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
          onClick={handleAccept}
          disabled={loading}
        >
          {loading ? 'Kaydediliyor...' : 'Okudum, Anladım — Devam Et'}
        </button>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15, 26, 48, 0.85)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
  },
  modal: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '40px 36px',
    maxWidth: '520px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 20px 60px rgba(15, 26, 48, 0.25)',
  },
  iconWrap: {
    marginBottom: '16px',
  },
  icon: {
    fontSize: '48px',
  },
  title: {
    fontSize: '22px',
    fontFamily: "'Playfair Display', Georgia, serif",
    color: '#1B2A4A',
    marginBottom: '16px',
    fontWeight: 700,
  },
  text: {
    fontSize: '15px',
    color: '#3d4f6e',
    lineHeight: 1.7,
    marginBottom: '12px',
  },
  subtext: {
    fontSize: '13px',
    color: '#6B7A96',
    lineHeight: 1.6,
    marginBottom: '28px',
  },
  button: {
    background: '#1B2A4A',
    color: '#E8C882',
    border: 'none',
    borderRadius: '10px',
    padding: '14px 28px',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    width: '100%',
    transition: 'background 0.2s ease',
  },
};

export default DisclaimerBanner;
