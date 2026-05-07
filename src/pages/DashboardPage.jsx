import React, { useState, useEffect, useMemo } from 'react';
import { TopBar } from '../components/layout';
import { Card, Button, Badge } from '../components/ui';
import { DonutChart, LineChart } from '../components/charts';
import { colors, fonts } from '../styles/tokens';
import contractService from '../services/contract.service';

const STATUS_LABELS = {
  PENDING: 'Onay Bekliyor',
  APPROVED: 'Onaylandı',
  DRAFT: 'Taslak',
  COMPLETED: 'Tamamlandı',
  REJECTED: 'Reddedildi',
};

const STATUS_COLORS = {
  PENDING: '#D08A4A',
  APPROVED: '#3F8F73',
  DRAFT: '#8B8B8B',
  COMPLETED: '#1B2A4A',
  REJECTED: '#B5454A',
};

const TR_MONTHS_SHORT = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

const DashboardPage = ({ onNavigate }) => {
  const [stats, setStats] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, contractList] = await Promise.all([
          contractService.getStats(),
          contractService.getAll(),
        ]);
        setStats(statsData || {});
        setContracts(Array.isArray(contractList) ? contractList : []);
      } catch (error) {
        console.error('Dashboard data fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const summaryCards = useMemo(() => ([
    { label: 'Aktif Sözleşmeler', value: stats?.totalCount || 0 },
    { label: 'Onay Bekleyen', value: stats?.pendingCount || 0 },
    { label: 'Tamamlanan', value: stats?.completedCount || 0 },
    { label: 'Taslak', value: stats?.draftCount || 0 },
  ]), [stats]);

  const statusDonutData = useMemo(() => {
    if (!stats) return [];
    return [
      { label: STATUS_LABELS.PENDING, value: stats.pendingCount || 0, color: STATUS_COLORS.PENDING },
      { label: STATUS_LABELS.APPROVED, value: stats.approvedCount || 0, color: STATUS_COLORS.APPROVED },
      { label: STATUS_LABELS.COMPLETED, value: stats.completedCount || 0, color: STATUS_COLORS.COMPLETED },
      { label: STATUS_LABELS.DRAFT, value: stats.draftCount || 0, color: STATUS_COLORS.DRAFT },
      { label: STATUS_LABELS.REJECTED, value: stats.rejectedCount || 0, color: STATUS_COLORS.REJECTED },
    ].filter((d) => d.value > 0);
  }, [stats]);

  const typeDonutData = useMemo(() => {
    const counts = {};
    contracts.forEach((c) => {
      const t = (c.type || c.contractType || 'GENEL').toString();
      const label = t.replace(/_/g, ' ').toLocaleLowerCase('tr-TR').replace(/\b\w/g, (m) => m.toLocaleUpperCase('tr-TR'));
      counts[label] = (counts[label] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  }, [contracts]);

  const monthlyTrendData = useMemo(() => {
    const now = new Date();
    const buckets = [];
    for (let i = 5; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      buckets.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        label: TR_MONTHS_SHORT[d.getMonth()],
        value: 0,
      });
    }
    const idxByKey = Object.fromEntries(buckets.map((b, i) => [b.key, i]));

    contracts.forEach((c) => {
      if (!c.createdAt) return;
      const d = new Date(c.createdAt);
      if (Number.isNaN(d.getTime())) return;
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (idxByKey[key] !== undefined) {
        buckets[idxByKey[key]].value += 1;
      }
    });

    return buckets;
  }, [contracts]);

  const recentContracts = useMemo(() => contracts.slice(0, 5), [contracts]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const statusBadgeConfig = {
    PENDING: { label: 'Onay Bekliyor', variant: 'warning' },
    APPROVED: { label: 'Onaylandı', variant: 'success' },
    DRAFT: { label: 'Taslak', variant: 'default' },
    COMPLETED: { label: 'Tamamlandı', variant: 'success' },
    REJECTED: { label: 'Reddedildi', variant: 'error' },
  };

  const pendingCount = stats?.pendingCount || 0;

  const sectionTitleStyle = {
    fontFamily: fonts.heading,
    fontSize: '15px',
    fontWeight: 600,
    color: colors.text,
    marginBottom: '14px',
  };

  return (
    <div style={{ animation: 'fadeInUp 0.35s ease' }}>
      <TopBar
        title="Genel Bakış"
        subtitle={`Hoş geldiniz. ${pendingCount > 0 ? `Bugün ${pendingCount} işlem bekliyor.` : 'Bekleyen işlem yok.'}`}
        onNavigate={onNavigate}
        actions={(
          <>
            {pendingCount > 0 && (
              <Button variant="outline" onClick={() => onNavigate('approvals')}>
                Onay Bekleyenleri Aç
              </Button>
            )}
            <Button variant="accent" onClick={() => onNavigate('create')}>Yeni Sözleşme</Button>
          </>
        )}
      />

      <div style={{ padding: '28px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
          {summaryCards.map((stat, i) => (
            <Card key={i} style={{ padding: '24px' }} hover={false}>
              <div style={{ fontSize: '13px', color: colors.textSecondary, marginBottom: '8px' }}>{stat.label}</div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: colors.text }}>
                {loading ? '...' : stat.value}
              </div>
            </Card>
          ))}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '20px',
          marginBottom: '24px',
        }}>
          <Card style={{ padding: '20px' }} hover={false}>
            <div style={sectionTitleStyle}>Durum Dağılımı</div>
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: colors.textMuted }}>Yükleniyor...</div>
            ) : (
              <DonutChart data={statusDonutData} centerLabel="Toplam" />
            )}
          </Card>

          <Card style={{ padding: '20px' }} hover={false}>
            <div style={sectionTitleStyle}>Sözleşme Türü Dağılımı</div>
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: colors.textMuted }}>Yükleniyor...</div>
            ) : (
              <DonutChart data={typeDonutData} centerLabel="Tür" />
            )}
          </Card>
        </div>

        <Card style={{ padding: '20px', marginBottom: '24px' }} hover={false}>
          <div style={sectionTitleStyle}>Son 6 Aylık Sözleşme Trendi</div>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: colors.textMuted }}>Yükleniyor...</div>
          ) : (
            <LineChart data={monthlyTrendData} yLabel="sözleşme" />
          )}
        </Card>

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
                  <Badge variant={statusBadgeConfig[contract.status]?.variant || 'default'}>
                    {statusBadgeConfig[contract.status]?.label || contract.status}
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
