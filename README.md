# e-Arzuhal Frontend

e-Arzuhal Akıllı Sözleşme Sistemi - Web Frontend

## Proje Yapısı

```
src/
├── components/
│   ├── ui/                 # Reusable UI componentleri
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Badge.jsx
│   │   ├── Input.jsx
│   │   ├── TextArea.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── StepIndicator.jsx
│   │   └── index.js
│   ├── layout/             # Layout componentleri
│   │   ├── Sidebar.jsx
│   │   ├── TopBar.jsx
│   │   ├── MainLayout.jsx
│   │   └── index.js
│   └── contract/           # Sozlesme ozel componentleri (ilerleyen haftalarda)
├── pages/                  # Sayfa componentleri
│   ├── DashboardPage.jsx
│   ├── CreateContractPage.jsx
│   ├── ContractsPage.jsx
│   ├── ApprovalsPage.jsx
│   ├── SettingsPage.jsx
│   └── index.js
├── services/               # API servisleri
│   ├── api.service.js      # Base API wrapper
│   └── contract.service.js # Sozlesme API islemleri
├── hooks/                  # Custom React hooks (ilerleyen haftalarda)
├── utils/                  # Yardimci fonksiyonlar (ilerleyen haftalarda)
├── styles/
│   ├── tokens.js           # Design tokens (renkler, fontlar, spacing)
│   └── global.css          # Global stiller
├── config/
│   └── api.config.js       # API yapilandirmasi
├── assets/                 # Statik dosyalar (ilerleyen haftalarda)
├── App.js
└── index.js
```

## Kurulum

```bash
npm install
npm start
```

## API Yapılandırması

Backend URL'i `src/config/api.config.js` dosyasından veya environment variable ile ayarlanabilir:

```bash
REACT_APP_API_URL=http://localhost:8080 npm start
```

## Haftalık İlerleme

### Week 1 (Mevcut)
- [x] Proje yapısı oluşturuldu
- [x] Design system (renkler, fontlar, spacing)
- [x] Temel UI componentleri (Button, Card, Badge, Input, TextArea, ProgressBar, StepIndicator)
- [x] Layout componentleri (Sidebar, TopBar, MainLayout)
- [x] Sayfa iskeletleri (Dashboard, CreateContract, Contracts, Approvals)
- [x] API service katmanı
- [x] Tıklanabilir wireframe/prototype

### Week 2 (Sonraki)
- [ ] Backend API entegrasyonu
- [ ] Loading/error state'leri
- [ ] Response handling

## Takım

- **Deniz Eren ARICI** - Frontend & UI Engineer
- **Enes Burak ATAY** - Lead & Mobile + Coordinator  
- **Burak DERE** - AI & Data Engineer
