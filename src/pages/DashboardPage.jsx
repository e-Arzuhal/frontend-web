import React from 'react';
import { TopBar } from '../components/layout';
import { Card, Button, Badge } from '../components/ui';
import { colors, fonts } from '../styles/tokens';

const DashboardPage = ({ onNavigate }) => {
  const stats = [
    { label: 'Aktif Sözleşmeler', value: 12 },
    { label: 'Onay Bekleyen', value: 4 },
    { label: 'Bu Ay Tamamlanan', value: 8 },
    { label: 'Taslak', value: 2 },
  ];

  const recentContracts = [
    { id: 1, name: 'Borç Sözleşmesi - Ahmet Yılmaz', type: 'Borç', status: 'pending', date: '07.02.2026' },
    { id: 2, name: 'Kira Sözleşmesi - Zeynep Ay', type: 'Kira', status: 'approved', date: '05.02.2026' },
    { id: 3, name: 'Hizmet Sözleşmesi - ABC Ltd.', type: 'Hizmet', status: 'draft', date: '04.02.2026' },
  ];

  const statusConfig = {
    pending: { label: 'Onay Bekliyor', variant: 'warning' },
    approved: { label: 'Onaylandı', variant: 'success' },
    draft: { label: 'Taslak', variant: 'default' },
  };

  return (
    <div style={{ animation: 'fadeInUp 0.35s ease' }}>
      <TopBar
        title="Genel Bakış"
        subtitle="Hoş geldiniz. Bugün 4 işlem bekliyor."
        actions={<Button variant="accent" onClick={() => onNavigate('create')}>Yeni Sözleşme</Button>}
      />

      <div style={{ padding: '28px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
          {stats.map((stat, i) => (
            <Card key={i} style={{ padding: '24px' }} hover={false}>
              <div style={{ fontSize: '13px', color: colors.textSecondary, marginBottom: '8px' }}>{stat.label}</div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: colors.text }}>{stat.value}</div>
            </Card>
          ))}
        </div>

        <h3 style={{ fontFamily: fonts.heading, fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
          Son Sözleşmeler
        </h3>
        <Card style={{ padding: 0 }}>
          {recentContracts.map((contract, i) => (
            <div
              key={contract.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderBottom: i < recentContracts.length - 1 ? `1px solid ${colors.border}` : 'none',
                cursor: 'pointer',
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, marginBottom: '4px' }}>{contract.name}</div>
                <div style={{ fontSize: '12px', color: colors.textMuted }}>{contract.date}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Badge>{contract.type}</Badge>
                <Badge variant={statusConfig[contract.status].variant}>{statusConfig[contract.status].label}</Badge>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
