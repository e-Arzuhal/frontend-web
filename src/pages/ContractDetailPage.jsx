import React, { useState, useEffect } from 'react';
import { TopBar } from '../components/layout';
import { Card, Button, Badge, ProgressBar } from '../components/ui';
import { colors, fonts, radius } from '../styles/tokens';
import contractService from '../services/contract.service';

const DownloadIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden xmlns="http://www.w3.org/2000/svg">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ContractDetailPage = ({ contractId, onBack }) => {
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPdfDownloading, setIsPdfDownloading] = useState(false);

  useEffect(() => {
    const fetchContract = async () => {
      if (!contractId) {
        setError('Sözleşme ID bulunamadı.');
        setLoading(false);
        return;
      }
      try {
        const data = await contractService.getById(contractId);
        setContract(data);
      } catch (err) {
        setError(err.message || 'Sözleşme yüklenirken hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchContract();
  }, [contractId]);

  const statusConfig = {
    PENDING: { label: 'Onay Bekliyor', variant: 'warning', color: colors.warning },
    APPROVED: { label: 'Onaylandı', variant: 'success', color: colors.success },
    DRAFT: { label: 'Taslak', variant: 'default', color: colors.textMuted },
    COMPLETED: { label: 'Tamamlandı', variant: 'success', color: colors.success },
    REJECTED: { label: 'Reddedildi', variant: 'error', color: colors.error },
  };

  const handleDownloadPdf = async () => {
    setIsPdfDownloading(true);
    try {
      const blob = await contractService.downloadPdf(contract.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sozlesme-${String(contract.id).padStart(6, '0')}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF download error:', err);
    } finally {
      setIsPdfDownloading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  if (loading) {
    return (
      <div style={{ padding: '48px', textAlign: 'center', color: colors.textMuted }}>
        Yükleniyor...
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <p style={{ color: colors.error, marginBottom: '16px' }}>{error || 'Sözleşme bulunamadı.'}</p>
        <Button variant="outline" onClick={onBack}>Geri</Button>
      </div>
    );
  }

  const isApproved = contract.status === 'APPROVED' || contract.status === 'COMPLETED';
  const approvalProgress = isApproved ? 1 : 0;

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      <TopBar
        title={contract.title}
        subtitle={`Oluşturulma: ${formatDate(contract.createdAt)}`}
        actions={
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button variant="outline" onClick={onBack}>Geri</Button>
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
                  <Badge variant={statusConfig[contract.status]?.variant || 'default'} style={{ marginBottom: '12px' }}>
                    {statusConfig[contract.status]?.label || contract.status}
                  </Badge>
                  <h2 style={{ fontFamily: fonts.heading, fontSize: '28px', fontWeight: 600, marginBottom: '4px' }}>
                    {contract.amount || '-'}
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
                  <span style={{ fontSize: '13px', color: colors.textSecondary }}>Durum</span>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>
                    {statusConfig[contract.status]?.label || contract.status}
                  </span>
                </div>
                <ProgressBar value={approvalProgress} max={1} />
              </div>
            </Card>

            {/* Sözleşme İçeriği */}
            {contract.content && (
              <Card style={{ padding: '24px', marginBottom: '24px' }} hover={false}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>Sözleşme İçeriği</h3>
                <div style={{
                  padding: '16px',
                  background: colors.surfaceAlt,
                  borderRadius: radius.md,
                  fontSize: '14px',
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap',
                }}>
                  {contract.content}
                </div>
              </Card>
            )}

            {/* Detaylar */}
            <Card style={{ padding: '24px' }} hover={false}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>Sözleşme Detayları</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: 'Tür', value: contract.type || '-' },
                  { label: 'Tutar', value: contract.amount || '-' },
                  { label: 'Oluşturulma', value: formatDate(contract.createdAt) },
                  { label: 'Güncelleme', value: formatDate(contract.updatedAt) },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '14px 16px',
                      background: colors.surfaceAlt,
                      borderRadius: radius.md,
                    }}
                  >
                    <span style={{ fontSize: '14px', color: colors.textSecondary }}>{item.label}</span>
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>{item.value}</span>
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
                {/* Sözleşme Sahibi */}
                <div style={{
                  padding: '16px',
                  border: `1px solid ${colors.success}`,
                  borderRadius: radius.md,
                  background: colors.successBg,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600 }}>{contract.ownerUsername}</div>
                      <div style={{ fontSize: '12px', color: colors.textMuted }}>Sözleşme Sahibi</div>
                    </div>
                    <Badge variant="success">Oluşturan</Badge>
                  </div>
                </div>

                {/* Karşı Taraf */}
                {contract.counterpartyName && (
                  <div style={{
                    padding: '16px',
                    border: `1px solid ${contract.status === 'APPROVED' ? colors.success : colors.border}`,
                    borderRadius: radius.md,
                    background: contract.status === 'APPROVED' ? colors.successBg : 'transparent',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600 }}>{contract.counterpartyName}</div>
                        <div style={{ fontSize: '12px', color: colors.textMuted }}>{contract.counterpartyRole || 'Karşı Taraf'}</div>
                      </div>
                      <Badge variant={contract.status === 'APPROVED' ? 'success' : 'warning'}>
                        {contract.status === 'APPROVED' ? 'Onayladı' : 'Bekliyor'}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Hizli Islemler */}
            <Card style={{ padding: '24px' }} hover={false}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>İşlemler</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {contract.status === 'DRAFT' && (
                  <>
                    <div style={{
                      padding: '10px 12px', marginBottom: '4px',
                      background: 'rgba(232, 200, 130, 0.1)',
                      border: '1px solid rgba(232, 200, 130, 0.4)',
                      borderRadius: '8px', fontSize: '12px', color: '#7a6535',
                      lineHeight: 1.5,
                    }}>
                      ⚠️ Onaya göndermeden önce sözleşmeyi bir avukata inceletmenizi öneririz.
                    </div>
                    <Button variant="accent" fullWidth onClick={async () => {
                      try {
                        const updated = await contractService.finalize(contract.id);
                        setContract(updated);
                      } catch (err) {
                        console.error('Finalize error:', err);
                      }
                    }}>
                      Onaya Gönder
                    </Button>
                  </>
                )}
                <Button variant="outline" fullWidth onClick={handleDownloadPdf} loading={isPdfDownloading}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <DownloadIcon /> {isPdfDownloading ? 'İndiriliyor...' : 'PDF İndir'}
                  </span>
                </Button>
                <Button variant="outline" fullWidth onClick={onBack}>Sözleşmelere Dön</Button>
                <Button variant="ghost" fullWidth style={{ color: colors.error }} onClick={async () => {
                  try {
                    await contractService.delete(contract.id);
                    onBack();
                  } catch (err) {
                    console.error('Delete error:', err);
                  }
                }}>
                  Sözleşmeyi Sil
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractDetailPage;
