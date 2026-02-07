import React, { useState } from 'react';
import { TopBar } from '../components/layout';
import { Card, Button, Badge, TextArea, StepIndicator } from '../components/ui';
import { colors, fonts, radius } from '../styles/tokens';

const STEPS = ['Metin Girişi', 'Analiz', 'PDF', 'Onay'];

const CreateContractPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const mockAnalysis = {
    contractType: 'Borç Sözleşmesi',
    confidence: 0.92,
    entities: { alacakli: 'Kullanıcı', borclu: 'Ahmet Yılmaz', tutar: '50.000 TL' },
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
        Sözleşme ihtiyacınızı kendi cümlelerinizle açıklayın. Yapay zekâ metninizi analiz edecektir.
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
          {isAnalyzing ? 'Analiz ediliyor...' : 'Analiz Et'}
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
        {analysisResult?.mandatoryClauses.map(c => (
          <div key={c.id} style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', marginBottom: '8px',
            background: c.status === 'complete' ? colors.successBg : colors.warningBg, borderRadius: radius.md,
          }}>
            <span>{c.status === 'complete' ? '✓' : '!'}</span>
            <span style={{ flex: 1, fontWeight: 500 }}>{c.name}</span>
            <Badge variant={c.status === 'complete' ? 'success' : 'warning'}>{c.status === 'complete' ? 'Tamam' : 'Eksik'}</Badge>
          </div>
        ))}
      </Card>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outline" onClick={() => setCurrentStep(0)}>Geri</Button>
        <Button variant="accent" onClick={() => setCurrentStep(2)}>PDF Önizleme</Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <Card style={{ padding: '48px', textAlign: 'center' }}>
      <div style={{ fontSize: '12px', color: colors.textMuted, marginBottom: '10px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>PDF</div>
      <h3 style={{ fontFamily: fonts.heading, fontSize: '20px', marginBottom: '8px' }}>PDF Önizleme</h3>
      <p style={{ color: colors.textSecondary, marginBottom: '24px' }}>Bu adım 6. haftada eklenecektir.</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
        <Button variant="outline" onClick={() => setCurrentStep(1)}>Geri</Button>
        <Button variant="accent" onClick={() => setCurrentStep(3)}>Onaya Gönder</Button>
      </div>
    </Card>
  );

  const renderStep3 = () => (
    <Card style={{ padding: '48px', textAlign: 'center' }}>
      <div style={{ fontSize: '12px', color: colors.textMuted, marginBottom: '10px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Tamamlandı</div>
      <h3 style={{ fontFamily: fonts.heading, fontSize: '20px', marginBottom: '8px' }}>Sözleşme Oluşturuldu</h3>
      <p style={{ color: colors.textSecondary, marginBottom: '24px' }}>Onay süreci 7. haftada eklenecektir.</p>
      <Button variant="accent" onClick={() => { setCurrentStep(0); setUserInput(''); setAnalysisResult(null); }}>
        Yeni Sözleşme
      </Button>
    </Card>
  );

  const steps = [renderStep0, renderStep1, renderStep2, renderStep3];

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      <TopBar title="Yeni Sözleşme Oluştur" subtitle="Doğal dilde yazın; yapay zekâ sözleşmenizi oluştursun." />
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
