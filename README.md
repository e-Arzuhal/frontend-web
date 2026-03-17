# e-Arzuhal – Web Frontend

e-Arzuhal Akıllı Sözleşme Sistemi — React Web Uygulaması

---

## Tech Stack

| Katman | Teknoloji |
|--------|-----------|
| Framework | React 18 |
| Stil | Inline styles + design tokens |
| API | JWT-aware fetch wrapper |
| Font | Playfair Display + DM Sans (Google Fonts) |

---

## Proje Yapısı

```
src/
├── components/
│   ├── ui/                       # Button, Card, Badge, Input, TextArea, ProgressBar, StepIndicator
│   ├── layout/                   # Sidebar, TopBar, MainLayout
│   └── DisclaimerBanner.jsx      # Yasal uyarı overlay (useRef hook pattern)
├── pages/
│   ├── DashboardPage.jsx
│   ├── CreateContractPage.jsx    # Gerçek NLP API entegrasyonu
│   ├── ContractsPage.jsx
│   ├── ContractDetailPage.jsx
│   ├── ApprovalsPage.jsx
│   ├── SettingsPage.jsx
│   ├── VerificationPage.jsx      # NFC için açıklayıcı modal
│   ├── LoginPage.jsx
│   └── RegisterPage.jsx
├── services/
│   ├── api.service.js            # JWT-aware HTTP wrapper
│   ├── auth.service.js
│   ├── contract.service.js       # analyzeText → /api/analysis/analyze
│   └── verification.service.js
├── styles/
│   ├── tokens.js
│   └── global.css
└── App.js                        # State tabanlı routing (React Router yok)
```

---

## Kurulum

```bash
cd frontend-web
npm install
npm start
```

Uygulama `http://localhost:3000` adresinde çalışır.

**API URL değiştirmek için:**
```bash
REACT_APP_API_URL=http://localhost:8080 npm start
```

---

## Sayfalar ve Özellikler

### CreateContractPage — 4 Adımlı Sözleşme Akışı

```
Adım 0: Metin Girişi    → Kullanıcı doğal dilde yazar
Adım 1: Analiz          → POST /api/analysis/analyze (gerçek NLP + GraphRAG)
Adım 2: PDF Önizleme    → Blob URL ile iframe içinde PDF gösterilir
Adım 3: Onay            → Sözleşme oluşturuldu; detay sayfasına git
```

Analiz yanıtı `nlp_result.extracted_fields` ve `graphrag_result.suggestions` alanlarını
component'in beklediği formata dönüştürerek gösterir.

### VerificationPage — TC Kimlik Doğrulama

**Manuel Giriş:** TC No (11 hane) + Ad + Soyad + Doğum Tarihi → backend doğrulama

**NFC:** Web tarayıcıda NFC desteklenmez. NFC butonuna tıklandığında açıklayıcı modal gösterilir:
> "NFC ile T.C. Kimlik Kartı doğrulaması yalnızca e-Arzuhal mobil uygulaması üzerinden yapılabilmektedir."

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

### contract.service.js

```js
contractService.analyzeText(text)      // POST /api/analysis/analyze
contractService.create(data)
contractService.getAll()
contractService.getById(id)
contractService.update(id, data)
contractService.delete(id)
contractService.finalize(id)
contractService.approve(id)
contractService.reject(id)
contractService.downloadPdf(id)        // → Blob
contractService.getStats()
```

---

## Disclaimer (Yasal Uyarı) Bileşeni

`src/components/DisclaimerBanner.jsx`

Uygulama açılışında tam ekran overlay olarak gösterilir.

**useRef Pattern:** `onAccepted` callback'i `useRef` ile tutulur; `useEffect` yalnızca
mount'ta çalışır. Bu sayede stale closure ve `eslint-disable` yorumuna gerek kalmaz.

**Akış:**
1. `localStorage.getItem('disclaimerAccepted_v1.0')` kontrolü
2. Yoksa `GET /api/disclaimer/status` backend kontrolü
3. Kabul edilmemişse modal görünür
4. "Okudum, Anladım" → `POST /api/disclaimer/accept` + localStorage kayıt

---

## Navigasyon

`App.js` state tabanlı routing kullanır (React Router yok). `setCurrentPage()` ile geçiş.

**Sidebar:** Ana Sayfa · Yeni Sözleşme · Sözleşmelerim · Onay Bekleyenler · Kimlik Doğrulama · Ayarlar

---

## Takım

- **Deniz Eren ARICI** — Frontend & UI Engineer
- **Enes Burak ATAY** — Lead & Mobile
- **Burak DERE** — AI & Data Engineer
