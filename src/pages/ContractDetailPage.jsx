/**
 * e-Arzuhal Contract Detail Page
 * Sözleşme detay görüntüleme
 */

import React from 'react';
import { TopBar } from '../components/layout';
import { Card, Button, Badge, ProgressBar } from '../components/ui';
import { colors, fonts, radius } from '../styles/tokens';

const ContractDetailPage = ({ contractId, onBack }) => {
  // Mock data - backend entegrasyonunda service'den gelecek
  const contract = {
    id: contractId || 1,
    name: 'Borç Sözleşmesi',
    type: 'borc_sozlesmesi',
    status: 'pending',
    createdAt: '07.02.2026',
    updatedAt: '07.02.2026',
    amount: '50.000 TL',
    parties: [
      { name: 'Deniz Eren Arıcı', role: 'Alacaklı', status: 'approved', date: '07.02.2026' },
      { name: 'Ahmet Yılmaz', role: 'Borçlu', status: 'pending', date: null },
    ],
    clauses: [
      { id: 1, name: 'Borç Tutarı', value: '50.000 TL', mandatory: true },
      { id: 2, name: 'Ödeme Tarihi', value: '07.08.2026', mandatory: true },
      { id: 3, name: 'Faiz Oranı', value: '%1,5 aylık', mandatory: false },
      { id: 4, name: 'Gecikme Cezası', value: '500 TL/gün', mandatory: false },
    ],
    timeline: [
      { date: '07.02.2026 14:30', action: 'Sözleşme oluşturuldu', user: 'Deniz Eren Arıcı' },
      { date: '07.02.2026 14:32', action: 'Alacaklı onayladı', user: 'Deniz Eren Arıcı' },
      { date: '07.02.2026 14:35', action: 'Borçluya gönderildi', user: 'Sistem' },
    ],
  };

  const statusConfig = {
    pending: { label: 'Onay Bekliyor', variant: 'warning', color: colors.warning },
    approved: { label: 'Onaylandı', variant: 'success', color: colors.success },
    draft: { label: 'Taslak', variant: 'default', color: colors.textMuted },
    completed: { label: 'Tamamlandı', variant: 'info', color: colors.info },
    rejected: { label: 'Reddedildi', variant: 'error', color: colors.error },
  };

  const approvedCount = contract.parties.filter(p => p.status === 'approved').length;
  const totalParties = contract.parties.length;

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      <TopBar
        title={contract.name}
        subtitle={`Oluşturulma: ${contract.createdAt}`}
        actions={
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button variant="outline" onClick={onBack}>Geri</Button>
            <Button variant="outline">PDF İndir</Button>
            <Button variant="accent">Düzenle</Button>
          </div>
        }
      />

      <div style={{ padding: '28px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Sol Kolon */}
          <div>
            {/* Ozet Kart */}
            <Card style={{ padding: '24px', marginBottom: '24px' }} hover={false}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                  <Badge variant={statusConfig[contract.status].variant} style={{ marginBottom: '12px' }}>
                    {statusConfig[contract.status].label}
                  </Badge>
                  <h2 style={{ fontFamily: fonts.heading, fontSize: '28px', fontWeight: 600, marginBottom: '4px' }}>
                    {contract.amount}
                  </h2>
                  <p style={{ fontSize: '14px', color: colors.textSecondary }}>Sözleşme Tutarı</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', color: colors.textMuted, marginBottom: '4px' }}>Sözleşme No</div>
                  <div style={{ fontFamily: fonts.mono, fontSize: '14px', fontWeight: 500 }}>
                    #SZL-2026-{String(contract.id).padStart(4, '0')}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: colors.textSecondary }}>Onay Durumu</span>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>{approvedCount}/{totalParties} taraf onayladı</span>
                </div>
                <ProgressBar value={approvedCount} max={totalParties} />
              </div>
            </Card>

            {/* Maddeler */}
            <Card style={{ padding: '24px', marginBottom: '24px' }} hover={false}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>Sözleşme Maddeleri</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {contract.clauses.map(clause => (
                  <div
                    key={clause.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '14px 16px',
                      background: colors.surfaceAlt,
                      borderRadius: radius.md,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: clause.mandatory ? colors.accent : colors.textMuted,
                      }} />
                      <span style={{ fontSize: '14px', fontWeight: 500 }}>{clause.name}</span>
                      {clause.mandatory && (
                        <Badge variant="accent" size="sm">Zorunlu</Badge>
                      )}
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: colors.text }}>{clause.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Zaman Cizelgesi */}
            <Card style={{ padding: '24px' }} hover={false}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>İşlem Geçmişi</h3>
              <div style={{ position: 'relative' }}>
                {contract.timeline.map((event, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      gap: '16px',
                      paddingBottom: index < contract.timeline.length - 1 ? '24px' : 0,
                      position: 'relative',
                    }}
                  >
                    {/* Line */}
                    {index < contract.timeline.length - 1 && (
                      <div style={{
                        position: 'absolute',
                        left: '7px',
                        top: '20px',
                        width: '2px',
                        height: 'calc(100% - 10px)',
                        background: colors.border,
                      }} />
                    )}
                    {/* Dot */}
                    <div style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      background: index === 0 ? colors.accent : colors.border,
                      border: `3px solid ${colors.card}`,
                      boxShadow: `0 0 0 2px ${index === 0 ? colors.accent : colors.border}`,
                      flexShrink: 0,
                    }} />
                    {/* Content */}
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>{event.action}</div>
                      <div style={{ fontSize: '12px', color: colors.textMuted }}>
                        {event.user} - {event.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sag Kolon */}
          <div>
            {/* Taraflar */}
            <Card style={{ padding: '24px', marginBottom: '24px' }} hover={false}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>Taraflar</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {contract.parties.map((party, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '16px',
                      border: `1px solid ${party.status === 'approved' ? colors.success : colors.border}`,
                      borderRadius: radius.md,
                      background: party.status === 'approved' ? colors.successBg : 'transparent',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600 }}>{party.name}</div>
                        <div style={{ fontSize: '12px', color: colors.textMuted }}>{party.role}</div>
                      </div>
                      {party.status === 'approved' ? (
                        <Badge variant="success">Onayladı</Badge>
                      ) : (
                        <Badge variant="warning">Bekliyor</Badge>
                      )}
                    </div>
                    {party.date && (
                      <div style={{ fontSize: '11px', color: colors.textMuted }}>
                        Onay: {party.date}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Hizli Islemler */}
            <Card style={{ padding: '24px' }} hover={false}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>İşlemler</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Button variant="outline" fullWidth>Hatırlatma Gönder</Button>
                <Button variant="outline" fullWidth>Sözleşmeyi Paylaş</Button>
                <Button variant="outline" fullWidth>Yorum Ekle</Button>
                <Button variant="ghost" fullWidth style={{ color: colors.error }}>Sözleşmeyi İptal Et</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractDetailPage;
