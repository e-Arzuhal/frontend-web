import React, { useState, useEffect } from 'react';
import { TopBar } from '../components/layout';
import { Card, Button, Badge } from '../components/ui';
import { colors, fonts, radius } from '../styles/tokens';
import contractService from '../services/contract.service';
import verificationService from '../services/verification.service';

const ShieldAlertIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const ApprovalsPage = ({ onNavigate }) => {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(null); // null = yükleniyor

  const fetchData = async () => {
    try {
      const [data, status] = await Promise.all([
        contractService.getPendingApprovals(),
        verificationService.getStatus(),
      ]);
      setPending(data);
      setIsVerified(status?.verified || false);
    } catch (error) {
      console.error('Approvals fetch error:', error);
      setIsVerified(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
        {/* Kimlik doğrulama uyarısı */}
        {isVerified === false && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '16px',
            padding: '16px 20px', marginBottom: '24px',
            background: 'rgba(232, 200, 130, 0.12)',
            border: '1px solid rgba(232, 200, 130, 0.45)',
            borderRadius: radius.lg,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: radius.full,
              background: 'rgba(232, 200, 130, 0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: colors.accent, flexShrink: 0,
            }}>
              <ShieldAlertIcon size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{
                fontSize: '14px', fontWeight: 600, color: colors.text,
                marginBottom: '4px',
              }}>
                Kimlik Doğrulama Gerekli
              </p>
              <p style={{ fontSize: '13px', color: colors.textSecondary, lineHeight: 1.5 }}>
                Sözleşmeleri onaylayabilmek veya reddedebilmek için önce kimliğinizi doğrulamanız gerekmektedir.
              </p>
            </div>
            {onNavigate && (
              <Button
                variant="accent"
                onClick={() => onNavigate('verification')}
                style={{ flexShrink: 0 }}
              >
                Doğrula
              </Button>
            )}
          </div>
        )}

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
                    {p.ownerUsername && <>Gönderen: <strong>{p.ownerUsername}</strong> | </>}
                    {p.counterpartyName && <>Taraf: <strong>{p.counterpartyName}</strong> | </>}
                    Tarih: <strong>{formatDate(p.createdAt)}</strong>
                    {p.amount && <> | Tutar: <strong>{p.amount}</strong></>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleApprove(p.id)}
                    disabled={isVerified === false}
                    title={isVerified === false ? 'Kimlik doğrulaması gerekli' : ''}
                  >
                    Onayla
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    style={{ color: colors.error }}
                    onClick={() => handleReject(p.id)}
                    disabled={isVerified === false}
                    title={isVerified === false ? 'Kimlik doğrulaması gerekli' : ''}
                  >
                    Reddet
                  </Button>
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
