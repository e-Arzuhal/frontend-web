# e-Arzuhal – Web Frontend

e-Arzuhal Akıllı Sözleşme Sistemi — React Web Uygulaması

---

## Proje Yapısı

```
src/
├── components/
│   ├── ui/                       # Yeniden kullanılabilir UI bileşenleri
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Badge.jsx
│   │   ├── Input.jsx
│   │   ├── TextArea.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── StepIndicator.jsx
│   │   └── index.js
│   └── layout/                   # Layout bileşenleri
│       ├── Sidebar.jsx           # Sol navigasyon (5 ana sayfa + Kimlik Doğrulama)
│       ├── TopBar.jsx
│       ├── MainLayout.jsx
│       └── index.js
├── pages/                        # Sayfa bileşenleri
│   ├── DashboardPage.jsx         # Ana sayfa + istatistikler
│   ├── CreateContractPage.jsx    # 4 adımlı sözleşme oluşturma + PDF önizleme
│   ├── ContractsPage.jsx         # Sözleşme listesi
│   ├── ContractDetailPage.jsx    # Sözleşme detayı + PDF indir
│   ├── ApprovalsPage.jsx         # Onay bekleyenler
│   ├── SettingsPage.jsx          # Profil & güvenlik ayarları
│   ├── VerificationPage.jsx      # TC Kimlik doğrulama (NFC / kamera / manuel)
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   └── index.js
├── services/                     # API servis katmanı
│   ├── api.service.js            # JWT-aware base HTTP wrapper (JSON + blob)
│   ├── auth.service.js           # Kimlik doğrulama işlemleri
│   ├── contract.service.js       # Sözleşme CRUD + PDF download
│   └── verification.service.js   # Kimlik doğrulama API çağrıları
├── hooks/                        # Custom React hooks
├── utils/                        # Yardımcı fonksiyonlar
├── styles/
│   ├── tokens.js                 # Design tokens (renkler, fontlar, spacing)
│   └── global.css                # Global stiller
├── config/
│   └── api.config.js             # API URL yapılandırması
├── App.js                        # Routing (state tabanlı, React Router yok)
└── index.js
```

---

## Kurulum

```bash
cd frontend-web
npm install
npm start
```

Uygulama `http://localhost:3000` adresinde çalışır.

---

## API Yapılandırması

Backend URL'i `src/config/api.config.js` dosyasından veya environment variable ile ayarlanabilir:

```bash
REACT_APP_API_URL=http://localhost:8080 npm start
```

---

## Sayfalar ve Özellikler

### CreateContractPage — 4 Adımlı Sözleşme Akışı

```
Adım 0: Metin Girişi    → Kullanıcı doğal dilde yazar
Adım 1: Analiz          → NLP sözleşme türü + entity tespiti (şu an mock)
Adım 2: PDF Önizleme    → Blob URL ile iframe içinde PDF gösterilir
Adım 3: Onay            → Sözleşme oluşturuldu; detay sayfasına git
```

**PDF Önizleme Tekniği:**
```js
// JWT-authenticated PDF fetch
const blob = await contractService.downloadPdf(id);
const url = URL.createObjectURL(blob);
// iframe src olarak kullanılır, blob URL component unmount'ta revoke edilir
```

### ContractDetailPage — Sözleşme Detayı

- Durum kartı (DRAFT / PENDING / APPROVED / REJECTED / COMPLETED)
- Sözleşme içeriği ve detaylar
- Taraflar (sahibi + karşı taraf)
- İşlemler: Onaya Gönder | **PDF İndir** | Sözleşmelere Dön | Sil

### VerificationPage — TC Kimlik Doğrulama

İki doğrulama modu:

**1. Manuel Giriş:**
- TC No (11 hane), Ad, Soyad, Doğum Tarihi
- Frontend'de TC checksum algoritması çalışır (formda anlık kontrol)
- Backend'e `POST /api/verification/identity` gönderilir
- TC No'nun ham değeri hiçbir zaman saklanmaz

**2. Kamera ile Tara:**
- `navigator.mediaDevices.getUserMedia()` ile kamera açılır
- MRZ bölgesi çerçevesiyle hizalama rehberi gösterilir (arka kısım)
- MRZ OCR backend entegrasyonu planlanmaktadır (Burak)
- NFC için mobil uygulama yönlendirmesi gösterilir

**TC Checksum Algoritması (frontend):**
```js
const isValidTcNo = (tcNo) => {
  if (!/^\d{11}$/.test(tcNo) || tcNo[0] === '0') return false;
  const d = tcNo.split('').map(Number);
  const d10 = ((7*(d[0]+d[2]+d[4]+d[6]+d[8]) - (d[1]+d[3]+d[5]+d[7])) % 10 + 10) % 10;
  if (d[9] !== d10) return false;
  return d[10] === d.slice(0,10).reduce((a,b) => a+b, 0) % 10;
};
```

---

## Servis Katmanı

### api.service.js

JWT token'ı otomatik header'a ekleyen base wrapper:

```js
// JSON yanıt için
api.get('/api/contracts')
api.post('/api/contracts', data)

// Binary (PDF) yanıt için
api.getBlob('/api/contracts/1/pdf')  // → Promise<Blob>
```

### contract.service.js

```js
contractService.create(data)
contractService.getAll()
contractService.getById(id)
contractService.update(id, data)
contractService.delete(id)
contractService.finalize(id)        // DRAFT → PENDING
contractService.approve(id)
contractService.reject(id)
contractService.downloadPdf(id)     // → Blob
contractService.getStats()
```

### verification.service.js

```js
verificationService.getStatus()                    // GET /api/verification/status
verificationService.verify(data)                   // POST /api/verification/identity
```

---

## Navigasyon

`App.js` state tabanlı routing kullanır (React Router yok). Sayfa geçişleri `setCurrentPage()` ile yapılır.

**Sidebar navigasyon menüsü:**
- Genel Bakış (`dashboard`)
- Yeni Sözleşme (`create`)
- Sözleşmelerim (`contracts`)
- Onay Bekleyenler (`approvals`)
- **Kimlik Doğrulama** (`verification`)
- Ayarlar (`settings`) — alt kısımda

---

## Haftalık İlerleme

### Week 1–2 — Temel Altyapı
- [x] Design system (tokens, renkler, fontlar)
- [x] UI bileşenleri (Button, Card, Badge, Input, TextArea, ProgressBar, StepIndicator)
- [x] Layout (Sidebar, TopBar, MainLayout)
- [x] Sayfa iskeletleri
- [x] API servis katmanı

### Week 3–5 — Backend Entegrasyonu
- [x] Auth flow (login, register, JWT)
- [x] Sözleşme CRUD
- [x] Dashboard istatistikleri

### Week 6 — PDF
- [x] PDF önizleme (blob URL + iframe) — CreateContractPage Step 2
- [x] PDF indirme — ContractDetailPage

### Week 7 — Taraflar & Onay
- [x] Onay akışı UI (ApprovalsPage)
- [x] ContractDetailPage finalize/approve/reject

### Week 8 — NFC & Kimlik Doğrulama
- [x] VerificationPage (Manuel + Kamera modu)
- [x] TC Kimlik checksum doğrulama (frontend + backend)
- [x] Doğrulama durum kartı
- [x] Mobil NFC yönlendirmesi (bilgi paneli)
- [ ] MRZ OCR entegrasyonu (Burak — plannlı)

### Week 9 — Chatbot
- [ ] Chatbot UI

---

## Takım

- **Deniz Eren ARICI** — Frontend & UI Engineer
- **Enes Burak ATAY** — Lead & Mobile + Coordinator
- **Burak DERE** — AI & Data Engineer
