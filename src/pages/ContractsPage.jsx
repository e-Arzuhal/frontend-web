import React, { useState } from 'react';
import { TopBar } from '../components/layout';
import { Card, Button, Badge, Input } from '../components/ui';
import { colors, fonts, radius } from '../styles/tokens';

const ContractsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const contracts = [
    { id: 1, name: 'Borç Sözleşmesi', party: 'Ahmet Yılmaz', type: 'Borç', amount: '50.000 TL', status: 'pending', date: '07.02.2026' },
    { id: 2, name: 'Kira Sözleşmesi', party: 'Zeynep Ay', type: 'Kira', amount: '15.000 TL/ay', status: 'approved', date: '05.02.2026' },
    { id: 3, name: 'Hizmet Sözleşmesi', party: 'ABC Ltd.', type: 'Hizmet', amount: '25.000 TL', status: 'draft', date: '04.02.2026' },
  ];

  const statusConfig = {
    pending: { label: 'Onay Bekliyor', variant: 'warning' },
    approved: { label: 'Onaylandı', variant: 'success' },
    draft: { label: 'Taslak', variant: 'default' },
  };

  const filters = [
    { id: 'all', label: 'Tümü' },
    { id: 'pending', label: 'Bekleyen' },
    { id: 'approved', label: 'Onaylanan' },
    { id: 'draft', label: 'Taslak' },
  ];

  const filtered = contracts.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.party.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = filterStatus === 'all' || c.status === filterStatus;
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ animation: 'fadeInUp 0.35s ease' }}>
      <TopBar
        title="Sözleşmelerim"
        subtitle={`Toplam ${contracts.length} sözleşme`}
        actions={<Button variant="accent">Yeni Sözleşme</Button>}
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
          {filtered.map((c, i) => (
            <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 80px', padding: '16px 20px', alignItems: 'center', borderBottom: i < filtered.length - 1 ? `1px solid ${colors.border}` : 'none' }}>
              <div>
                <div style={{ fontWeight: 500 }}>{c.name}</div>
                <div style={{ fontSize: '12px', color: colors.textMuted }}>{c.date}</div>
              </div>
              <span style={{ color: colors.textSecondary }}>{c.party}</span>
              <Badge>{c.type}</Badge>
              <span style={{ fontWeight: 500 }}>{c.amount}</span>
              <Badge variant={statusConfig[c.status].variant}>{statusConfig[c.status].label}</Badge>
              <Button variant="ghost" size="sm">Görüntüle</Button>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: '48px', textAlign: 'center', color: colors.textMuted }}>
              Sonuç bulunamadı.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ContractsPage;
