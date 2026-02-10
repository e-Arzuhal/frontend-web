import React, { useState, useEffect } from 'react';
import { TopBar } from '../components/layout';
import { Card, Button, Badge } from '../components/ui';
import { colors } from '../styles/tokens';
import contractService from '../services/contract.service';

const ApprovalsPage = () => {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    try {
      const data = await contractService.getPendingApprovals();
      setPending(data);
    } catch (error) {
      console.error('Approvals fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleApprove = async (id) => {
    try {
      await contractService.approve(id);
      setPending(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Approve error:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await contractService.reject(id);
      setPending(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Reject error:', error);
    }
  };

  return (
    <div style={{ animation: 'fadeInUp 0.35s ease' }}>
      <TopBar title="Onay Bekleyenler" subtitle={`${pending.length} sözleşme onayınızı bekliyor`} />

      <div style={{ padding: '28px 32px' }}>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: colors.textMuted }}>
            Yükleniyor...
          </div>
        ) : pending.length === 0 ? (
          <Card style={{ padding: '48px', textAlign: 'center' }}>
            <p style={{ color: colors.textMuted }}>Onay bekleyen sözleşme bulunmuyor.</p>
          </Card>
        ) : (
          pending.map(p => (
            <Card key={p.id} style={{ padding: '24px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>{p.title}</h4>
                    <Badge variant="warning">Onay Bekliyor</Badge>
                  </div>
                  <div style={{ fontSize: '13px', color: colors.textMuted }}>
                    {p.counterpartyName && <>Taraf: <strong>{p.counterpartyName}</strong> | </>}
                    Tarih: <strong>{formatDate(p.createdAt)}</strong>
                    {p.amount && <> | Tutar: <strong>{p.amount}</strong></>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Button variant="success" size="sm" onClick={() => handleApprove(p.id)}>Onayla</Button>
                  <Button variant="ghost" size="sm" style={{ color: colors.error }} onClick={() => handleReject(p.id)}>Reddet</Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ApprovalsPage;
