import React from 'react';
import { colors, fonts, radius } from '../../styles/tokens';
import Button from './Button';

const LEGAL_CONTENT = {
  kvkk: {
    title: 'KVKK Aydınlatma Metni',
    body: `e-Arzuhal olarak 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında veri sorumlusu sıfatıyla hareket ederiz. Topladığımız kişisel verileriniz (ad, soyad, e-posta, T.C. Kimlik No, telefon, sözleşme içerikleri) yalnızca aşağıdaki amaçlarla işlenir:

• Kullanıcı kaydı, kimlik doğrulama ve hesap güvenliği
• Sözleşmelerin dijital olarak hazırlanması, saklanması ve karşı taraf onayı
• Yasal saklama yükümlülüklerinin yerine getirilmesi
• Hizmet kalitesinin iyileştirilmesi ve istatistiksel analizler (anonim)

Verileriniz, açık rızanız olmadıkça üçüncü kişilerle paylaşılmaz. T.C. Kimlik numaranız AES-256 ile şifrelenerek saklanır. KVKK md. 11 kapsamındaki haklarınızı kullanmak için kvkk@earzuhal.com adresine başvurabilirsiniz.

Verileriniz Türkiye Cumhuriyeti sınırları içerisinde, ISO 27001 sertifikalı sunucularda barındırılır.`,
  },
  terms: {
    title: 'Kullanım Koşulları',
    body: `e-Arzuhal platformunu kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız:

1. Platform, hukuki tavsiye sağlamaz. Oluşturulan sözleşme taslakları yalnızca bilgilendirme amaçlıdır; nihai kullanım öncesi mutlaka bir avukata danışılmalıdır.

2. Hesap güvenliğinden kullanıcı sorumludur. Şifrenizi ve kimlik doğrulama bilgilerinizi üçüncü kişilerle paylaşmayınız.

3. Platform üzerinden gerçekleştirilen sözleşme onayları, dijital imza niteliği taşımaz; tarafların ayrıca ıslak imza atması gerekebilir.

4. Sahte kimlik bilgisi girmek, başkasının T.C. Kimlik numarasını kullanmak ya da hizmeti kötüye kullanmak yasaktır ve hesabın kapatılmasına yol açar.

5. Hizmet kesintisi, veri kaybı veya yanlış sözleşme metni nedeniyle doğabilecek zararlardan e-Arzuhal sorumlu tutulamaz.

6. Bu koşullar, herhangi bir bildirim olmaksızın güncellenebilir. Güncel sürüm her zaman bu sayfada yayımlanır.`,
  },
  privacy: {
    title: 'Gizlilik Politikası',
    body: `e-Arzuhal, kullanıcılarının gizliliğine en üst düzeyde önem verir.

• Saklanan veriler: kullanıcı bilgileri, sözleşme içerikleri, oturum verileri, doğrulama kayıtları.
• Çerezler: oturum yönetimi için zorunlu çerezler kullanılır; üçüncü taraf izleme çerezi yoktur.
• Şifreler bcrypt ile, T.C. Kimlik bilgisi AES-256 ile şifrelenerek saklanır.
• Verileriniz analitik amaçlı kullanılmadan önce anonimleştirilir.
• Hesabınızı silmeniz halinde kişisel verileriniz 30 gün içinde geri dönülmez biçimde silinir; yasal saklama yükümlülüğüne tabi tutanaklar bu süreden istisnadır.

Sorularınız için: privacy@earzuhal.com`,
  },
  support: {
    title: 'Destek',
    body: `Yardıma mı ihtiyacınız var? Aşağıdaki kanallardan bize ulaşabilirsiniz:

• E-posta: destek@earzuhal.com
• Telefon: 0850 123 45 67 (Hafta içi 09:00 – 18:00)
• Yardım merkezi: yardim.earzuhal.com

Sıkça karşılaşılan sorunlar:
- Şifremi unuttum: Giriş ekranındaki "Şifremi Unuttum" bağlantısını kullanın.
- Kimlik doğrulama: Mobil uygulamadaki NFC adımı zorunludur. Web üzerinden NFC okutamazsınız.
- Sözleşme onaya gönderilmiyor: Karşı taraf TC kimlik bilgisinin doğru olduğundan ve KVKK uyarısını kabul ettiğinizden emin olun.

Yanıt süremiz iş günlerinde ortalama 24 saattir.`,
  },
};

const LegalModal = ({ open, type, onClose }) => {
  if (!open || !type) return null;
  const content = LEGAL_CONTENT[type];
  if (!content) return null;

  const overlayStyle = {
    position: 'fixed', inset: 0, zIndex: 1200,
    background: 'rgba(0,0,0,0.55)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '24px',
  };

  const modalStyle = {
    background: colors.surface,
    borderRadius: radius.lg,
    padding: '28px 30px',
    maxWidth: '640px',
    width: '100%',
    maxHeight: '85vh',
    overflowY: 'auto',
    boxShadow: '0 25px 70px rgba(0,0,0,0.4)',
  };

  return (
    <div style={overlayStyle} onClick={onClose} role="dialog" aria-modal="true">
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <h2 style={{
          fontFamily: fonts.heading,
          fontSize: '22px',
          fontWeight: 700,
          color: colors.text,
          marginBottom: '16px',
        }}>
          {content.title}
        </h2>
        <div style={{
          fontSize: '13px',
          color: colors.textSecondary,
          lineHeight: 1.7,
          whiteSpace: 'pre-wrap',
          marginBottom: '24px',
        }}>
          {content.body}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="accent" onClick={onClose}>Kapat</Button>
        </div>
      </div>
    </div>
  );
};

export default LegalModal;
