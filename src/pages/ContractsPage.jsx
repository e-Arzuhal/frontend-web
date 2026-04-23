import React, { useState, useEffect } from 'react';
import { TopBar } from '../components/layout';
import { Card, Button, Badge, Input } from '../components/ui';
import { colors, fonts, radius } from '../styles/tokens';
import contractService from '../services/contract.service';

const ContractsPage = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const data = await contractService.getAll();
        setContracts(data);
      } catch (error) {
        console.error('Contracts fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  const statusConfig = {
    PENDING: { label: 'Onay Bekliyor', variant: 'warning' },
    APPROVED: { label: 'Onaylandı', variant: 'success' },
    DRAFT: { label: 'Taslak', variant: 'default' },
    COMPLETED: { label: 'Tamamlandı', variant: 'success' },
    REJECTED: { label: 'Reddedildi', variant: 'error' },
  };

  const filters = [
    { id: 'all', label: 'Tümü' },
    { id: 'PENDING', label: 'Bekleyen' },
    { id: 'APPROVED', label: 'Onaylanan' },
    { id: 'DRAFT', label: 'Taslak' },
  ];

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const filtered = contracts.filter(c => {
    const matchSearch = (c.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.counterpartyName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = filterStatus === 'all' || c.status === filterStatus;
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ animation: 'fadeInUp 0.35s ease' }}>
      <TopBar
        title="Sözleşmelerim"
        subtitle={`Toplam ${contracts.length} sözleşme`}
        onNavigate={onNavigate}
        actions={<Button variant="accent" onClick={() => onNavigate && onNavigate('create')}>Yeni Sözleşme</Button>}
      />

      <div style={{ padding: '28px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '4px', background: colors.surfaceAlt, padding: '4px', borderRadius: radius.md }}>
            {filters.map(f => (
              <button
                key={f.id}
                onClick={() => setFilterStatus(f.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: radius.sm,
                  border: 'none',
                  background: filterStatus === f.id ? colors.card : 'transparent',
                  color: filterStatus === f.id ? colors.text : colors.textSecondary,
                  fontSize: '13px',
                  fontWeight: filterStatus === f.id ? 600 : 400,
                  fontFamily: fonts.body,
                  cursor: 'pointer',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div style={{ width: '280px' }}>
            <Input placeholder="Ara..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </div>

        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 80px', padding: '12px 20px', background: colors.surfaceAlt, fontSize: '12px', fontWeight: 600, color: colors.textSecondary, textTransform: 'uppercase' }}>
            <span>Sözleşme</span><span>Taraf</span><span>Tür</span><span>Tutar</span><span>Durum</span><span></span>
          </div>
          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: colors.textMuted }}>
              Yükleniyor...
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: colors.textMuted }}>
              Sonuç bulunamadı.
            </div>
          ) : (
            filtered.map((c, i) => (
              <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 80px', padding: '16px 20px', alignItems: 'center', borderBottom: i < filtered.length - 1 ? `1px solid ${colors.border}` : 'none' }}>
                <div>
                  <div style={{ fontWeight: 500 }}>{c.title}</div>
                  <div style={{ fontSize: '12px', color: colors.textMuted }}>{formatDate(c.createdAt)}</div>
                </div>
                <span style={{ color: colors.textSecondary }}>{c.counterpartyName || '-'}</span>
                <Badge>{c.type || '-'}</Badge>
                <span style={{ fontWeight: 500 }}>{c.amount || '-'}</span>
                <Badge variant={statusConfig[c.status]?.variant || 'default'}>
                  {statusConfig[c.status]?.label || c.status}
                </Badge>
                <Button variant="ghost" size="sm" onClick={() => onNavigate && onNavigate('contract-detail', { contractId: c.id })}>
                  Görüntüle
                </Button>
              </div>
            ))
          )}
        </Card>
      </div>
    </div>
  );
};

export default ContractsPage;
