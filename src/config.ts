export const APP_NAME = 'Ders Panosu'

/** Gizlilik/KVKK sayfasında gösterilen başvuru adresi (#58): ekibin ortak e-posta hesabı. */
export const CONTACT_EMAIL = 'projemeil@gmail.com'

/**
 * Şifre sıfırlama e-postalarının gönderen adresi. E-postayı Firebase Authentication kendisi
 * gönderir (Gmail SMTP 1 Kasım 2026'da kapatıldı; bkz. README → Alan adı ve e-posta gönderimi).
 */
export const RESET_EMAIL_SENDER = 'noreply@ders.c1h4n.com'

/** Proje dönemi bitince kalan tüm hesap ve verilerin silineceği tarih (Gizlilik sayfası). */
export const DATA_DELETION_DATE = '31 Ocak 2027'

/** localStorage anahtarları tek yerde tutulur; çakışmasın diye hepsi aynı önekle başlar. */
export const STORAGE_KEYS = {
  theme: 'ders-panosu:theme', // index.html içindeki tema betiği de bu anahtarı okur
  demoUser: 'ders-panosu:demo-user',
  userData: (uid: string) => `ders-panosu:user-data:${uid}`,
} as const
