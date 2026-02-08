import React, { useState } from 'react';
import { TopBar } from '../components/layout';
import { Card, Button, Badge, TextArea, StepIndicator } from '../components/ui';
import { colors, fonts, radius } from '../styles/tokens';

const STEPS = ['Metin Girişi', 'Analiz', 'PDF', 'Onay'];

const InfoIcon = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" stroke="currentColor" strokeWidth="2" />
    <path d="M12 10v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 7h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const CheckIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const AlertIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden xmlns="http://www.w3.org/2000/svg">
    <path d="M12 9v5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M12 17h.01" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
    <path d="M10.3 4.3h3.4L21 19.7H3L10.3 4.3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

const CreateContractPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const mockAnalysis = {
    contractType: 'Borç Sözleşmesi',
    confidence: 0.92,
    entities: { alacaklı: 'Kullanıcı', borçlu: 'Ahmet Yılmaz', tutar: '50.000 TL' },
    mandatoryClauses: [
      { id: 1, name: 'Borç Tutarı', status: 'complete' },
      { id: 2, name: 'Taraflar', status: 'complete' },
      { id: 3, name: 'Ödeme Tarihi', status: 'missing' },
    ],
  };

  const handleAnalyze = async () => {
    if (!userInput.trim()) return;
    setIsAnalyzing(true);
    await new Promise(r => setTimeout(r, 1500));
    setAnalysisResult(mockAnalysis);
    setCurrentStep(1);
    setIsAnalyzing(false);
  };

  const renderStep0 = () => (
    <Card style={{ padding: '32px' }}>
      <h3 style={{ fontFamily: fonts.heading, fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
        İhtiyacınızı Doğal Dilde Yazın
      </h3>
      <p style={{ fontSize: '14px', color: colors.textSecondary, marginBottom: '24px', lineHeight: 1.6 }}>
        Sözleşme ihtiyacınızı kendi cümlelerinizle açıklayın. Sistem metninizi analiz edecektir.
      </p>
      <TextArea
        placeholder="Örnek: Ahmet Yılmaz'a 50.000 TL borç vereceğim..."
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        rows={6}
        showCount
        maxLength={2000}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
        <Button variant="accent" onClick={handleAnalyze} loading={isAnalyzing} disabled={!userInput.trim()}>
          {isAnalyzing ? 'Analiz Ediliyor...' : 'Analiz Et'}
        </Button>
      </div>
    </Card>
  );

  const renderStep1 = () => (
    <div>
      <Card style={{ padding: '24px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontFamily: fonts.heading, fontSize: '20px', fontWeight: 600 }}>{analysisResult?.contractType}</h3>
            <p style={{ fontSize: '13px', color: colors.textSecondary }}>Tespit edilen sözleşme türü</p>
          </div>
          <Badge variant="success">%{Math.round((analysisResult?.confidence || 0) * 100)} Güven</Badge>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', padding: '16px', background: colors.surfaceAlt, borderRadius: radius.md }}>
          {Object.entries(analysisResult?.entities || {}).map(([k, v]) => (
            <div key={k}>
              <div style={{ fontSize: '12px', color: colors.textMuted, marginBottom: '4px', textTransform: 'capitalize' }}>{k}</div>
              <div style={{ fontSize: '14px', fontWeight: 500 }}>{v}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{ padding: '24px', marginBottom: '20px' }}>
        <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Zorunlu Maddeler</h4>
        {analysisResult?.mandatoryClauses.map(c => {
          const isComplete = c.status === 'complete';
          return (
            <div key={c.id} style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', marginBottom: '8px',
              background: isComplete ? colors.successBg : colors.warningBg, borderRadius: radius.md,
              color: isComplete ? colors.success : colors.warning,
            }}>
              <span style={{ display: 'inline-flex' }}>{isComplete ? <CheckIcon /> : <AlertIcon />}</span>
              <span style={{ flex: 1, fontWeight: 600, color: colors.text }}>{c.name}</span>
              <Badge variant={isComplete ? 'success' : 'warning'}>{isComplete ? 'Tamam' : 'Eksik'}</Badge>
            </div>
          );
        })}
      </Card>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outline" onClick={() => setCurrentStep(0)}>Geri</Button>
        <Button variant="accent" onClick={() => setCurrentStep(2)}>PDF Önizleme</Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <Card style={{ padding: '44px', textAlign: 'center' }}>
      <div style={{ color: colors.textMuted, marginBottom: '14px' }}>
        <InfoIcon />
      </div>
      <h3 style={{ fontFamily: fonts.heading, fontSize: '20px', marginBottom: '8px' }}>PDF Önizleme</h3>
      <p style={{ color: colors.textSecondary, marginBottom: '24px' }}>Bu adım 6. haftada eklenecektir.</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
        <Button variant="outline" onClick={() => setCurrentStep(1)}>Geri</Button>
        <Button variant="accent" onClick={() => setCurrentStep(3)}>Onaya Gönder</Button>
      </div>
    </Card>
  );

  const renderStep3 = () => (
    <Card style={{ padding: '44px', textAlign: 'center' }}>
      <div style={{ color: colors.success, marginBottom: '14px' }}>
        <CheckIcon size={44} />
      </div>
      <h3 style={{ fontFamily: fonts.heading, fontSize: '20px', marginBottom: '8px' }}>Sözleşme Oluşturuldu</h3>
      <p style={{ color: colors.textSecondary, marginBottom: '24px' }}>Onay süreci 7. haftada eklenecektir.</p>
      <Button variant="accent" onClick={() => { setCurrentStep(0); setUserInput(''); setAnalysisResult(null); }}>
        Yeni Sözleşme
      </Button>
    </Card>
  );

  const steps = [renderStep0, renderStep1, renderStep2, renderStep3];

  return (
    <div style={{ animation: 'fadeInUp 0.35s ease' }}>
      <TopBar title="Yeni Sözleşme Oluştur" subtitle="Doğal dilde yazın; sözleşme taslağını hızlıca oluşturun." />
      <div style={{ padding: '28px 32px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <StepIndicator steps={STEPS} currentStep={currentStep} />
        </div>
        {steps[currentStep]()}
      </div>
    </div>
  );
};

export default CreateContractPage;
