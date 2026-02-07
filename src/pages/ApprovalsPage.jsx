import React from 'react';
import { TopBar } from '../components/layout';
import { Card, Button, Badge } from '../components/ui';
import { colors, fonts } from '../styles/tokens';

const ApprovalsPage = () => {
  const pending = [
    { id: 1, name: 'Borç Sözleşmesi - Ahmet Yılmaz', from: 'Ahmet Yılmaz', date: '07.02.2026', amount: '50.000 TL', urgent: true },
    { id: 2, name: 'Kira Sözleşmesi - Zeynep Ay', from: 'Zeynep Ay', date: '06.02.2026', amount: '15.000 TL/ay', urgent: false },
  ];

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      <TopBar title="Onay Bekleyen Sözleşmeler" subtitle={`${pending.length} sözleşme onayınızı bekliyor`} />

      <div style={{ padding: '28px 32px' }}>
        {pending.map(p => (
          <Card key={p.id} style={{ padding: '24px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>{p.name}</h4>
                  {p.urgent && <Badge variant="error">Acil</Badge>}
                </div>
                <div style={{ fontSize: '13px', color: colors.textMuted }}>
                  Gönderen: <strong>{p.from}</strong> | Tarih: <strong>{p.date}</strong> | Tutar: <strong>{p.amount}</strong>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Button variant="outline" size="sm">İncele</Button>
                <Button variant="success" size="sm">Onayla</Button>
                <Button variant="ghost" size="sm" style={{ color: colors.error }}>Reddet</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ApprovalsPage;
