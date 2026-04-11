import React, { useState, useEffect, useCallback } from 'react';
import { TopBar } from '../components/layout';
import { Card, Button, Badge, TextArea, StepIndicator } from '../components/ui';
import { colors, fonts, radius } from '../styles/tokens';
import contractService from '../services/contract.service';
import useVoiceInput from '../hooks/useVoiceInput';

const STEPS = ['Metin Girişi', 'Sözleşme Önerisi', 'PDF Önizleme', 'Onay & İmza'];

const CheckIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DownloadIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden xmlns="http://www.w3.org/2000/svg">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const CpuIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden xmlns="http://www.w3.org/2000/svg">
    <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2" />
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const LightbulbIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden xmlns="http://www.w3.org/2000/svg">
    <path d="M9 21h6M12 3a6 6 0 0 1 6 6c0 2.22-1.21 4.16-3 5.2V18H9v-3.8C7.21 13.16 6 11.22 6 9a6 6 0 0 1 6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ZapIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden xmlns="http://www.w3.org/2000/svg">
    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BarChartIcon = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden xmlns="http://www.w3.org/2000/svg">
    <path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ZoomInIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
    <path d="m21 21-4.35-4.35M11 8v6M8 11h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MicIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden xmlns="http://www.w3.org/2000/svg">
    <rect x="9" y="1" width="6" height="12" rx="3" stroke="currentColor" strokeWidth="2" />
    <path d="M19 10v1a7 7 0 0 1-14 0v-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="8" y1="23" x2="16" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/* ── TC Kimlik frontend doğrulama ── */
const isValidTcNo = (tcNo) => {
  if (!/^\d{11}$/.test(tcNo)) return false;
  if (tcNo[0] === '0') return false;
  const d = tcNo.split('').map(Number);
  const d10 = ((7 * (d[0] + d[2] + d[4] + d[6] + d[8]) - (d[1] + d[3] + d[5] + d[7])) % 10 + 10) % 10;
  if (d[9] !== d10) return false;
  const sum = d.slice(0, 10).reduce((a, b) => a + b, 0);
  return d[10] === sum % 10;
};

const CreateContractPage = ({ onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [selectedClauses, setSelectedClauses] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [contractId, setContractId] = useState(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState('');
  const [counterpartyTc, setCounterpartyTc] = useState('');
  const [counterpartyTcError, setCounterpartyTcError] = useState('');
  const [counterpartyNameInput, setCounterpartyNameInput] = useState('');
  const [voiceError, setVoiceError] = useState('');

  /* ── Voice-to-Text ── */
  const handleVoiceResult = useCallback((text) => {
    setUserInput(prev => prev + (prev && !prev.endsWith(' ') ? ' ' : '') + text);
    setVoiceError('');
  }, []);

  const handleVoiceError = useCallback((err) => {
    setVoiceError(err);
  }, []);

  const { isListening, isSupported: voiceSupported, toggleListening } = useVoiceInput({
    lang: 'tr-TR',
    continuous: true,
    onResult: handleVoiceResult,
    onError: handleVoiceError,
  });

  /* ── Karşı taraf TC doğrulama ── */
  const handleCounterpartyTcChange = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 11);
    setCounterpartyTc(digits);
    if (digits.length === 11) {
      setCounterpartyTcError(isValidTcNo(digits) ? '' : 'Geçersiz TC Kimlik Numarası.');
    } else {
      setCounterpartyTcError('');
    }
  };

  useEffect(() => {
    return () => {
      if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
    };
  }, [pdfBlobUrl]);

  const mockAnalysis = {
    contractType: 'Borç Sözleşmesi',
    contractTypeEn: 'Loan Agreement',
    confidence: 0.92,
    entities: [
      { label: 'Borç Veren', type: 'PERSON', value: 'Kullanıcı' },
      { label: 'Borç Alan', type: 'PERSON', value: 'Ahmet Yılmaz' },
      { label: 'Tutar', type: 'MONEY', value: '50.000 TL' },
      { label: 'Tarih', type: 'DATE', value: '01.06.2026' },
    ],
    mandatoryClauses: [
      { id: 1, name: 'Borç Tutarı', description: 'Borç verilen miktar ve para birimi' },
      { id: 2, name: 'Geri Ödeme Tarihi', description: 'Son ödeme tarihi' },
      { id: 3, name: 'Taraflar', description: 'Borç veren ve borç alan bilgileri' },
    ],
    suggestedClauses: [
      { id: 'faiz', name: 'Faiz Oranı', description: 'Aylık/yıllık faiz oranı belirlenmesi', usagePercent: 72, recommended: true },
      { id: 'temerrut', name: 'Temerrüt Koşulları', description: 'Ödeme gecikmesi durumunda uygulanacak yaptırımlar', usagePercent: 65, recommended: true },
      { id: 'tanik', name: 'Tanıklar', description: 'Sözleşmeye tanık eklenmesi', usagePercent: 38, recommended: false },
      { id: 'odeme_plani', name: 'Ödeme Planı', description: 'Taksitli ödeme takvimi', usagePercent: 45, recommended: false },
    ],
  };

  const handleAnalyze = async () => {
    if (!userInput.trim()) return;
    setIsAnalyzing(true);
    try {
      const realResult = await contractService.analyzeText(userInput);
      const fields = realResult.nlp_result?.extracted_fields || {};
      const graphSuggestions = realResult.graphrag_result?.suggestions?.suggestions || [];
      const matched = realResult.graphrag_result?.analysis?.matched_fields || [];
      const missing = realResult.graphrag_result?.analysis?.missing_required || [];

      const entityList = [];
      if (fields.tutar) entityList.push({ label: 'Tutar', type: 'MONEY', value: fields.tutar });
      if (fields.sure) entityList.push({ label: 'Süre', type: 'DURATION', value: fields.sure });
      if (fields.tarih) entityList.push({ label: 'Tarih', type: 'DATE', value: fields.tarih });
      (fields.taraflar || []).forEach((t, i) =>
        entityList.push({ label: i === 0 ? 'Karşı Taraf' : 'Taraf', type: 'PERSON', value: t })
      );

      setAnalysisResult({
        contractType: realResult.contract_type_display?.replace(/_/g, ' ') || realResult.contract_type,
        contractTypeEn: realResult.contract_type,
        confidence: realResult.confidence || 0,
        entities: entityList,
        mandatoryClauses: [
          ...matched.map(f => ({ id: f.field_name || f, name: f.name || f.field_name || String(f), description: f.description || '' })),
          ...missing.map(f => ({ id: f, name: typeof f === 'string' ? f : (f.name || String(f)), description: 'Eksik zorunlu madde', missing: true })),
        ],
        suggestedClauses: graphSuggestions.map(s => ({
          id: s.field_name,
          name: s.field_name,
          description: s.message || '',
          usagePercent: s.usage_percent ?? null,
          recommended: s.necessity === 'required' || s.necessity === 'recommended',
        })),
      });
      setCurrentStep(1);
    } catch (e) {
      alert('Analiz başarısız: ' + (e.message || 'Sunucuya bağlanılamadı.'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleClause = (clauseId) => {
    setSelectedClauses(prev =>
      prev.includes(clauseId) ? prev.filter(id => id !== clauseId) : [...prev, clauseId]
    );
  };

  const handleSaveAndPreview = async () => {
    setIsSaving(true);
    setSaveError('');
    try {
      const entities = analysisResult?.entities || [];
      const tutar = entities.find(e => e.type === 'MONEY')?.value || '';
      const karsıTaraf = entities.find(e => e.label === 'Karşı Taraf' || e.label === 'Borç Alan' || e.type === 'PERSON')?.value || '';
      const saved = await contractService.create({
        title: analysisResult?.contractType || 'Yeni Sözleşme',
        type: analysisResult?.contractTypeEn || analysisResult?.contractType || 'GENEL',
        content: userInput,
        amount: tutar,
        counterpartyName: counterpartyNameInput || karsıTaraf,
        counterpartyRole: '',
        counterpartyTcKimlik: counterpartyTc || null,
        selectedClauses,
      });
      setContractId(saved.id);
      setCurrentStep(2);

      setIsPdfLoading(true);
      setPdfError('');
      try {
        const blob = await contractService.downloadPdf(saved.id);
        const url = URL.createObjectURL(blob);
        setPdfBlobUrl(url);
      } catch (pdfErr) {
        setPdfError(pdfErr.message || 'PDF oluşturulamadı.');
      } finally {
        setIsPdfLoading(false);
      }
    } catch (err) {
      setSaveError(err.message || 'Sözleşme kaydedilemedi.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!pdfBlobUrl) return;
    const a = document.createElement('a');
    a.href = pdfBlobUrl;
    a.download = `sozlesme-${String(contractId).padStart(6, '0')}.pdf`;
    a.click();
  };

  const handleZoomPdf = () => {
    if (pdfBlobUrl) window.open(pdfBlobUrl, '_blank');
  };

  const handleReset = () => {
    if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
    setCurrentStep(0);
    setUserInput('');
    setAnalysisResult(null);
    setSelectedClauses([]);
    setSaveError('');
    setContractId(null);
    setPdfBlobUrl(null);
    setPdfError('');
  };

  const renderStep0 = () => (
    <Card style={{ padding: '32px' }}>
      <h3 style={{ fontFamily: fonts.heading, fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
        İhtiyacınızı Doğal Dilde Yazın
      </h3>
      <p style={{ fontSize: '14px', color: colors.textSecondary, marginBottom: '24px', lineHeight: 1.6 }}>
        Sözleşme ihtiyacınızı kendi cümlelerinizle açıklayın. Sistem metninizi analiz edecektir.
      </p>
      <div style={{ position: 'relative' }}>
        <TextArea
          placeholder="Örnek: Ahmet Yılmaz'a 50.000 TL borç vereceğim..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          rows={6}
          showCount
          maxLength={2000}
        />
        {/* Mikrofon butonu — destekleniyorsa göster */}
        {voiceSupported && (
          <button
            onClick={toggleListening}
            title={isListening ? 'Dinlemeyi durdur' : 'Sesle yaz (Türkçe)'}
            style={{
              position: 'absolute', top: '10px', right: '10px',
              width: '36px', height: '36px', borderRadius: radius.full,
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: isListening ? '#ef4444' : colors.surfaceAlt,
              color: isListening ? '#fff' : colors.textMuted,
              transition: 'all 0.2s ease',
              animation: isListening ? 'micPulse 1.5s ease-in-out infinite' : 'none',
              boxShadow: isListening ? '0 0 0 4px rgba(239,68,68,0.25)' : 'none',
            }}
          >
            <MicIcon size={18} />
          </button>
        )}
      </div>
      {voiceError && (
        <div style={{
          padding: '8px 12px', marginTop: '8px',
          background: colors.errorBg, color: colors.error,
          borderRadius: radius.md, fontSize: '12px',
        }}>
          {voiceError}
        </div>
      )}
      {isListening && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          marginTop: '8px', fontSize: '13px', color: '#ef4444', fontWeight: 500,
        }}>
          <span style={{
            width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444',
            animation: 'micPulse 1s ease-in-out infinite',
          }} />
          Dinleniyor... Konuşmanız metne dönüştürülüyor.
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
        <Button variant="accent" onClick={handleAnalyze} loading={isAnalyzing} disabled={!userInput.trim()}>
          {isAnalyzing ? 'Analiz Ediliyor...' : 'Analiz Et'}
        </Button>
      </div>
    </Card>
  );

  const renderStep1 = () => {
    const entities = analysisResult?.entities || [];
    const mandatory = analysisResult?.mandatoryClauses || [];
    const suggested = analysisResult?.suggestedClauses || [];

    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Sol: NLP Analiz Sonucu */}
        <Card style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <span style={{ color: colors.primary, display: 'inline-flex' }}><CpuIcon size={20} /></span>
            <h3 style={{ fontFamily: fonts.heading, fontSize: '18px', fontWeight: 600 }}>NLP Analiz Sonucu</h3>
          </div>

          {/* Tespit Edilen Sözleşme Tipi */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '12px', color: colors.textMuted, fontWeight: 500, marginBottom: '8px' }}>
              Tespit Edilen Sözleşme Tipi
            </p>
            <div style={{
              background: 'rgba(200, 150, 62, 0.1)',
              border: '1px solid rgba(200, 150, 62, 0.2)',
              borderRadius: radius.md,
              padding: '12px 16px',
            }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: colors.text }}>
                {analysisResult?.contractType} ({analysisResult?.contractTypeEn})
              </span>
            </div>
          </div>

          {/* NER Varlıklar */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: colors.text, marginBottom: '10px' }}>
              Çıkarılan Bilgiler (NER)
            </p>
            {entities.map((entity, i) => (
              <div key={entity.label} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 0',
                borderBottom: i < entities.length - 1 ? `1px solid ${colors.border}` : 'none',
              }}>
                <span style={{ fontSize: '13px', color: colors.textSecondary }}>
                  {entity.label} ({entity.type})
                </span>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>{entity.value}</span>
              </div>
            ))}
          </div>

          {/* Zorunlu Maddeler */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ color: colors.accent, display: 'inline-flex' }}><ZapIcon /></span>
              <p style={{ fontSize: '13px', fontWeight: 600, color: colors.text }}>Zorunlu Maddeler</p>
            </div>
            {mandatory.map(clause => (
              <div key={clause.id} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '10px 14px',
                marginBottom: '8px',
                background: colors.successBg,
                borderRadius: radius.md,
              }}>
                <span style={{ display: 'inline-flex', color: colors.success, marginTop: '2px', flexShrink: 0 }}>
                  <CheckIcon size={14} />
                </span>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: colors.text }}>{clause.name}</p>
                  <p style={{ fontSize: '12px', color: colors.textSecondary }}>{clause.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Sağ: Önerilen Maddeler */}
        <div>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ color: colors.accent, display: 'inline-flex' }}><LightbulbIcon size={20} /></span>
              <h3 style={{ fontFamily: fonts.heading, fontSize: '18px', fontWeight: 600 }}>Önerilen Maddeler</h3>
            </div>
            <p style={{ fontSize: '13px', color: colors.textSecondary, lineHeight: 1.5 }}>
              GraphRAG bilgi grafiği analizi sonucu önerilen opsiyonel ve tavsiye edilen maddeler. Eklemek istediklerinizi seçin.
            </p>
          </div>

          {suggested.map(clause => {
            const isChecked = selectedClauses.includes(clause.id);
            return (
              <Card
                key={clause.id}
                style={{
                  padding: '14px 16px',
                  marginBottom: '10px',
                  cursor: 'pointer',
                  border: `1.5px solid ${isChecked ? colors.primary : colors.border}`,
                  transition: 'border-color 0.2s ease',
                }}
                onClick={() => toggleClause(clause.id)}
              >
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  {/* Özel Checkbox */}
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '4px',
                    border: `2px solid ${isChecked ? colors.primary : colors.border}`,
                    background: isChecked ? colors.primary : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                    transition: 'all 0.15s ease',
                  }}>
                    {isChecked && (
                      <span style={{ color: '#fff', display: 'inline-flex' }}>
                        <CheckIcon size={11} />
                      </span>
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: colors.text }}>{clause.name}</span>
                      {clause.recommended && <Badge variant="warning">Tavsiye Edilen</Badge>}
                    </div>
                    <p style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '8px' }}>
                      {clause.description}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: colors.textMuted }}>
                      <BarChartIcon />
                      <span style={{ fontSize: '12px' }}>Kullanıcıların %{clause.usagePercent}'i ekledi</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}

          {/* Karşı Taraf Bilgileri */}
          <Card style={{ padding: '20px', marginBottom: '16px', border: `1px solid ${colors.accent}33` }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '14px', color: colors.accent }}>Karşı Taraf Bilgileri</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: colors.textSecondary, marginBottom: '6px' }}>
                  Karşı Taraf TC Kimlik No *
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={11}
                  placeholder="12345678901"
                  value={counterpartyTc}
                  onChange={e => handleCounterpartyTcChange(e.target.value)}
                  style={{
                    width: '100%', padding: '9px 12px',
                    background: colors.surfaceAlt, border: `1px solid ${counterpartyTcError ? colors.error : colors.border}`,
                    borderRadius: radius.md, color: colors.text,
                    fontFamily: fonts.body, fontSize: '14px', letterSpacing: '2px',
                    outline: 'none', boxSizing: 'border-box',
                  }}
                />
                {counterpartyTcError && (
                  <p style={{ fontSize: '11px', color: colors.error, marginTop: '4px' }}>{counterpartyTcError}</p>
                )}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: colors.textSecondary, marginBottom: '6px' }}>
                  Karşı Taraf Ad Soyad
                </label>
                <input
                  type="text"
                  placeholder="Karşı tarafın adı soyadı"
                  value={counterpartyNameInput}
                  onChange={e => setCounterpartyNameInput(e.target.value)}
                  style={{
                    width: '100%', padding: '9px 12px',
                    background: colors.surfaceAlt, border: `1px solid ${colors.border}`,
                    borderRadius: radius.md, color: colors.text,
                    fontFamily: fonts.body, fontSize: '14px',
                    outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
            <p style={{ fontSize: '11px', color: colors.textMuted, marginTop: '10px', lineHeight: 1.5 }}>
              Karşı tarafın TC Kimlik Numarası ile sözleşme onay talebi karşı tarafa iletilecektir.
            </p>
          </Card>

          {saveError && (
            <div style={{
              padding: '12px', background: colors.errorBg, color: colors.error,
              borderRadius: radius.md, fontSize: '13px', marginBottom: '16px',
            }}>
              {saveError}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
            <Button variant="outline" onClick={() => setCurrentStep(0)}>Geri</Button>
            <Button
              variant="accent"
              onClick={handleSaveAndPreview}
              loading={isSaving}
              disabled={counterpartyTc.length === 11 && !!counterpartyTcError}
            >
              {isSaving ? 'Oluşturuluyor...' : 'PDF Oluştur'}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const clauseCount = (analysisResult?.mandatoryClauses?.length || 0) + selectedClauses.length;

  const renderStep2 = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px', alignItems: 'start' }}>
      {/* Ana: PDF Önizleme */}
      <Card style={{ padding: '0', overflow: 'hidden' }} hover={false}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '14px 20px',
          borderBottom: `1px solid ${colors.border}`,
        }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600 }}>PDF Önizleme</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            {pdfBlobUrl && (
              <Button variant="ghost" onClick={handleZoomPdf}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '13px' }}>
                  <ZoomInIcon /> Yakınlaştır
                </span>
              </Button>
            )}
            {pdfBlobUrl && (
              <Button variant="ghost" onClick={handleDownloadPdf}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '13px' }}>
                  <DownloadIcon /> İndir
                </span>
              </Button>
            )}
          </div>
        </div>
        <div style={{ padding: '20px' }}>
          {isPdfLoading && (
            <div style={{ textAlign: 'center', padding: '80px 32px', color: colors.textMuted }}>
              <p style={{ fontSize: '14px' }}>PDF oluşturuluyor...</p>
            </div>
          )}
          {pdfError && !isPdfLoading && (
            <div style={{
              padding: '16px', background: colors.errorBg, color: colors.error,
              borderRadius: radius.md, fontSize: '13px', textAlign: 'center',
            }}>
              PDF yüklenemedi: {pdfError}
            </div>
          )}
          {pdfBlobUrl && !isPdfLoading && (
            <iframe
              src={pdfBlobUrl}
              title="Sözleşme PDF Önizleme"
              style={{
                width: '100%',
                height: '600px',
                border: `1px solid ${colors.border}`,
                borderRadius: radius.md,
              }}
            />
          )}
        </div>
      </Card>

      {/* Sağ Kenar Çubuğu */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Sözleşme Bilgileri */}
        <Card style={{ padding: '20px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '14px' }}>Sözleşme Bilgileri</h4>
          {[
            { label: 'Tip', value: analysisResult?.contractType },
            { label: 'Taraflar', value: '2 kişi' },
            { label: 'Maddeler', value: String(clauseCount) },
          ].map((row, i, arr) => (
            <div key={row.label} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '7px 0',
              borderBottom: `1px solid ${colors.border}`,
            }}>
              <span style={{ fontSize: '13px', color: colors.textSecondary }}>{row.label}</span>
              <span style={{ fontSize: '13px', fontWeight: 500 }}>{row.value}</span>
            </div>
          ))}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '7px',
          }}>
            <span style={{ fontSize: '13px', color: colors.textSecondary }}>Durum</span>
            <Badge variant="warning">Taslak</Badge>
          </div>
        </Card>

        {/* Düzenle */}
        <Card style={{ padding: '20px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>Düzenle</h4>
          <p style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '14px', lineHeight: 1.5 }}>
            Sözleşme içeriğini düzenlemek isterseniz geri dönebilirsiniz.
          </p>
          <Button variant="outline" fullWidth onClick={() => setCurrentStep(1)}>
            Maddeleri Düzenle
          </Button>
        </Card>

        {/* Aksiyonlar */}
        <Button variant="accent" fullWidth onClick={() => setCurrentStep(3)}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', justifyContent: 'center' }}>
            <CheckIcon /> Onaya Gönder
          </span>
        </Button>
        <Button variant="outline" fullWidth onClick={handleDownloadPdf} disabled={!pdfBlobUrl}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', justifyContent: 'center' }}>
            <DownloadIcon /> PDF İndir
          </span>
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <Card style={{ padding: '44px', textAlign: 'center' }}>
      <div style={{ color: colors.success, marginBottom: '14px', display: 'inline-flex' }}>
        <CheckIcon size={44} />
      </div>
      <h3 style={{ fontFamily: fonts.heading, fontSize: '20px', marginBottom: '8px' }}>Sözleşme Oluşturuldu</h3>
      <p style={{ color: colors.textSecondary, marginBottom: '28px' }}>
        Sözleşmeniz başarıyla kaydedildi ve PDF hazırlandı.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
        {contractId && onNavigate && (
          <Button variant="outline" onClick={() => onNavigate('contract-detail', { contractId })}>
            Sözleşmeyi Görüntüle
          </Button>
        )}
        <Button variant="accent" onClick={handleReset}>
          Yeni Sözleşme
        </Button>
      </div>
    </Card>
  );

  const steps = [renderStep0, renderStep1, renderStep2, renderStep3];
  const containerMaxWidth = currentStep === 1 || currentStep === 2 ? '1100px' : '900px';

  return (
    <div style={{ animation: 'fadeInUp 0.35s ease' }}>
      <TopBar title="Yeni Sözleşme Oluştur" subtitle="Doğal dilde yazın; sözleşme taslağını hızlıca oluşturun." />
      <div style={{ padding: '28px 32px', maxWidth: containerMaxWidth, margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <StepIndicator steps={STEPS} currentStep={currentStep} />
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '10px 16px', marginBottom: '20px',
          background: 'rgba(232, 200, 130, 0.1)',
          border: '1px solid rgba(232, 200, 130, 0.4)',
          borderRadius: '8px', fontSize: '13px', color: '#7a6535',
        }}>
          <span>⚠️</span>
          Bu platform hukuki tavsiye vermez. Oluşturulan sözleşmeyi imzalamadan önce bir avukata danışmanızı öneririz.
        </div>
        {steps[currentStep]()}
      </div>
    </div>
  );
};

export default CreateContractPage;

/* Mikrofon pulse animasyonu — global style etiketi ile eklenir */
if (typeof document !== 'undefined' && !document.getElementById('mic-pulse-style')) {
  const style = document.createElement('style');
  style.id = 'mic-pulse-style';
  style.textContent = `
    @keyframes micPulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.08); opacity: 0.85; }
    }
  `;
  document.head.appendChild(style);
}
