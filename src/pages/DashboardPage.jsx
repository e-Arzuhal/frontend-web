import React, { useState, useEffect } from 'react';
import { TopBar } from '../components/layout';
import { Card, Button, Badge } from '../components/ui';
import { colors, fonts } from '../styles/tokens';
import contractService from '../services/contract.service';

const DashboardPage = ({ onNavigate }) => {
  const [stats, setStats] = useState([
    { label: 'Aktif Sözleşmeler', value: 0 },
    { label: 'Onay Bekleyen', value: 0 },
    { label: 'Tamamlanan', value: 0 },
    { label: 'Taslak', value: 0 },
  ]);
  const [recentContracts, setRecentContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, contracts] = await Promise.all([
          contractService.getStats(),
          contractService.getAll(),
        ]);

        setStats([
          { label: 'Aktif Sözleşmeler', value: statsData.totalCount || 0 },
          { label: 'Onay Bekleyen', value: statsData.pendingCount || 0 },
          { label: 'Tamamlanan', value: statsData.completedCount || 0 },
          { label: 'Taslak', value: statsData.draftCount || 0 },
        ]);

        setRecentContracts(contracts.slice(0, 5));
      } catch (error) {
        console.error('Dashboard data fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statusConfig = {
    PENDING: { label: 'Onay Bekliyor', variant: 'warning' },
    APPROVED: { label: 'Onaylandı', variant: 'success' },
    DRAFT: { label: 'Taslak', variant: 'default' },
    COMPLETED: { label: 'Tamamlandı', variant: 'success' },
    REJECTED: { label: 'Reddedildi', variant: 'error' },
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const pendingCount = stats.find(s => s.label === 'Onay Bekleyen')?.value || 0;

  return (
    <div style={{ animation: 'fadeInUp 0.35s ease' }}>
      <TopBar
        title="Genel Bakış"
        subtitle={`Hoş geldiniz. ${pendingCount > 0 ? `Bugün ${pendingCount} işlem bekliyor.` : 'Bekleyen işlem yok.'}`}
        actions={<Button variant="accent" onClick={() => onNavigate('create')}>Yeni Sözleşme</Button>}
      />

      <div style={{ padding: '28px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
          {stats.map((stat, i) => (
            <Card key={i} style={{ padding: '24px' }} hover={false}>
              <div style={{ fontSize: '13px', color: colors.textSecondary, marginBottom: '8px' }}>{stat.label}</div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: colors.text }}>
                {loading ? '...' : stat.value}
              </div>
            </Card>
          ))}
        </div>

        <h3 style={{ fontFamily: fonts.heading, fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
          Son Sözleşmeler
        </h3>
        <Card style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: colors.textMuted }}>
              Yükleniyor...
            </div>
          ) : recentContracts.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: colors.textMuted }}>
              Henüz sözleşme oluşturulmamış.
            </div>
          ) : (
            recentContracts.map((contract, i) => (
              <div
                key={contract.id}
                onClick={() => onNavigate('contract-detail', { contractId: contract.id })}
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
                  <div style={{ fontWeight: 500, marginBottom: '4px' }}>
                    {contract.title}{contract.counterpartyName ? ` - ${contract.counterpartyName}` : ''}
                  </div>
                  <div style={{ fontSize: '12px', color: colors.textMuted }}>{formatDate(contract.createdAt)}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {contract.type && <Badge>{contract.type}</Badge>}
                  <Badge variant={statusConfig[contract.status]?.variant || 'default'}>
                    {statusConfig[contract.status]?.label || contract.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
