import React, { useMemo, useState, useEffect } from 'react';
import { TopBar } from '../components/layout';
import { Card, Button, Input, Badge } from '../components/ui';
import { colors, fonts, radius } from '../styles/tokens';
import authService from '../services/auth.service';
import api from '../services/api.service';

const TabIcon = ({ name, size = 20 }) => {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg', style: { display: 'block' } };
  const stroke = { stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };

  switch (name) {
    case 'profile':
      return <svg {...common} aria-hidden><path {...stroke} d="M20 21a8 8 0 0 0-16 0" /><path {...stroke} d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" /></svg>;
    case 'security':
      return <svg {...common} aria-hidden><path {...stroke} d="M7 11V8a5 5 0 0 1 10 0v3" /><path {...stroke} d="M6 11h12v10H6V11z" /></svg>;
    case 'notifications':
      return <svg {...common} aria-hidden><path {...stroke} d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" /><path {...stroke} d="M13.7 21a2 2 0 0 1-3.4 0" /></svg>;
    default:
      return null;
  }
};

const SettingRow = ({ label, description, checked, onToggle, isLast }) => (
  <div style={{
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '16px 0', borderBottom: isLast ? 'none' : `1px solid ${colors.border}`,
  }}>
    <div>
      <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '2px' }}>{label}</div>
      <div style={{ fontSize: '12px', color: colors.textSecondary }}>{description}</div>
    </div>
    <div
      onClick={onToggle}
      style={{
        width: '44px', height: '24px', borderRadius: '12px', cursor: 'pointer',
        background: checked ? colors.success : colors.border,
        position: 'relative', transition: 'background 0.2s',
      }}
    >
      <div style={{
        width: '18px', height: '18px', borderRadius: '50%', background: '#fff',
        position: 'absolute', top: '3px', left: checked ? '23px' : '3px',
        transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </div>
  </div>
);

const SettingsPage = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  const currentUser = authService.getCurrentUser();

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
  });

  useEffect(() => {
    if (currentUser) {
      const fullName = [currentUser.firstName, currentUser.lastName].filter(Boolean).join(' ');
      setProfile({
        name: fullName || currentUser.username || '',
        email: currentUser.email || '',
        phone: '',
        company: '',
      });
    }
  }, []);

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    contractUpdates: true,
    approvalRequests: true,
    marketing: false,
  });

  const toggleSetting = (key) => setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));

  const tabs = useMemo(() => ([
    { id: 'profile', label: 'Profil', icon: 'profile' },
    { id: 'security', label: 'Güvenlik', icon: 'security' },
    { id: 'notifications', label: 'Bildirimler', icon: 'notifications' },
  ]), []);

  const handleSaveProfile = async () => {
    setSaveSuccess(false);
    setSaveError('');
    try {
      const nameParts = profile.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      await api.put('/api/users/me', {
        firstName,
        lastName,
        email: profile.email,
      });

      // Update localStorage
      const updatedUser = { ...currentUser, firstName, lastName, email: profile.email };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError(err.message || 'Profil güncellenemedi.');
    }
  };

  const renderProfileTab = () => (
    <div>
      <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Profil Bilgileri</h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '22px' }}>
        <Input label="Ad Soyad" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} />
        <Input label="E-posta" type="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} />
        <Input label="Telefon" value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} />
        <Input label="Şirket (Opsiyonel)" value={profile.company} onChange={(e) => setProfile((p) => ({ ...p, company: e.target.value }))} />
      </div>

      {saveSuccess && (
        <div style={{ padding: '12px', background: colors.successBg, color: colors.success, borderRadius: radius.md, fontSize: '13px', marginBottom: '14px' }}>
          Profil başarıyla güncellendi.
        </div>
      )}
      {saveError && (
        <div style={{ padding: '12px', background: colors.errorBg, color: colors.error, borderRadius: radius.md, fontSize: '13px', marginBottom: '14px' }}>
          {saveError}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
        <Button variant="outline">İptal</Button>
        <Button variant="accent" onClick={handleSaveProfile}>Kaydet</Button>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div>
      <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Güvenlik Ayarları</h3>

      <Card style={{ padding: '18px', marginBottom: '14px', background: colors.surfaceAlt }} hover={false}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>Şifre Değiştir</div>
            <div style={{ fontSize: '13px', color: colors.textSecondary }}>Son değişiklik: 30 gün önce</div>
          </div>
          <Button variant="outline" size="sm">Değiştir</Button>
        </div>
      </Card>

      <Card style={{ padding: '18px', marginBottom: '14px', background: colors.surfaceAlt }} hover={false}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>İki Faktörlü Doğrulama</div>
            <div style={{ fontSize: '13px', color: colors.textSecondary }}>Hesabınızı daha güvenli hale getirin</div>
          </div>
          <Badge variant="warning">Kapalı</Badge>
        </div>
      </Card>

      <Card style={{ padding: '18px', background: colors.surfaceAlt }} hover={false}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>Aktif Oturumlar</div>
            <div style={{ fontSize: '13px', color: colors.textSecondary }}>1 cihazda aktif oturum bulunuyor</div>
          </div>
          <Button variant="ghost" size="sm" style={{ color: colors.error }}>Tümünü Kapat</Button>
        </div>
      </Card>

      <div style={{ marginTop: '18px' }}>
        <div style={{ fontSize: '12px', fontWeight: 800, color: colors.textSecondary, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
          Tehlikeli Bölge
        </div>
        <Card style={{ padding: '18px', background: colors.errorBg, border: `1px solid ${colors.error}` }} hover={false}>
          <div style={{ fontSize: '13px', color: colors.textSecondary, marginBottom: '14px', lineHeight: 1.55 }}>
            Hesabınızı silmek geri alınamaz bir işlemdir. Tüm verileriniz kalıcı olarak silinecektir.
          </div>
          <Button
            variant="outline"
            fullWidth
            style={{ borderColor: colors.error, color: colors.error, background: 'transparent' }}
            onClick={() => {}}
          >
            Hesabı Sil
          </Button>
        </Card>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div>
      <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Bildirim Tercihleri</h3>

      <div style={{ fontSize: '12px', fontWeight: 700, color: colors.textSecondary, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Kanallar
      </div>
      <Card style={{ padding: '0 20px', marginBottom: '18px' }} hover={false}>
        <SettingRow label="E-posta Bildirimleri" description="Önemli güncellemeleri e-posta ile alın" checked={notifications.email} onToggle={() => toggleSetting('email')} />
        <SettingRow label="SMS Bildirimleri" description="Kritik durumlar için SMS alın" checked={notifications.sms} onToggle={() => toggleSetting('sms')} />
        <SettingRow label="Push Bildirimleri" description="Tarayıcı bildirimleri" checked={notifications.push} onToggle={() => toggleSetting('push')} isLast />
      </Card>

      <div style={{ fontSize: '12px', fontWeight: 700, color: colors.textSecondary, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Türler
      </div>
      <Card style={{ padding: '0 20px' }} hover={false}>
        <SettingRow label="Sözleşme Güncellemeleri" description="Sözleşmelerinizle ilgili değişiklikler" checked={notifications.contractUpdates} onToggle={() => toggleSetting('contractUpdates')} />
        <SettingRow label="Onay Talepleri" description="Yeni onay bekleyen sözleşmeler" checked={notifications.approvalRequests} onToggle={() => toggleSetting('approvalRequests')} />
        <SettingRow label="Pazarlama" description="Yenilikler ve kampanyalar" checked={notifications.marketing} onToggle={() => toggleSetting('marketing')} isLast />
      </Card>
    </div>
  );

  const tabContent = {
    profile: renderProfileTab,
    security: renderSecurityTab,
    notifications: renderNotificationsTab,
  };

  return (
    <div style={{ animation: 'fadeInUp 0.35s ease' }}>
      <TopBar
        title="Ayarlar"
        subtitle="Hesap ve uygulama tercihleri"
        actions={onLogout ? <Button variant="outline" onClick={onLogout}>Çıkış Yap</Button> : null}
      />

      <div style={{ padding: '28px 32px' }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
          <Card style={{ width: '260px', padding: '12px', position: 'sticky', top: 88 }} hover={false}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: colors.textSecondary, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '10px 10px 6px' }}>
              Menü
            </div>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '12px 12px',
                    marginBottom: '6px',
                    borderRadius: radius.md,
                    border: '1px solid transparent',
                    background: isActive ? colors.surfaceAlt : 'transparent',
                    color: isActive ? colors.primary : colors.textSecondary,
                    fontSize: '14px',
                    fontWeight: isActive ? 800 : 600,
                    fontFamily: fonts.body,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ width: 22, height: 22, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TabIcon name={tab.icon} />
                  </span>
                  {tab.label}
                </button>
              );
            })}
          </Card>

          <Card style={{ flex: 1, padding: '28px' }} hover={false}>
            {tabContent[activeTab]()}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
