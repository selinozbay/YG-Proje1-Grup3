export const APP_NAME = 'Ders Panosu'

/**
 * Gizlilik/KVKK sayfasında gösterilen başvuru adresi (#58). Ekibin ortak Gmail hesabı;
 * şifre sıfırlama e-postaları da bu hesap üzerinden gönderilir (Firebase SMTP ayarı).
 */
export const CONTACT_EMAIL = 'projemeil@gmail.com'

/** Proje dönemi bitince kalan tüm hesap ve verilerin silineceği tarih (Gizlilik sayfası). */
export const DATA_DELETION_DATE = '31 Ocak 2027'

/** localStorage anahtarları tek yerde tutulur; çakışmasın diye hepsi aynı önekle başlar. */
export const STORAGE_KEYS = {
  theme: 'ders-panosu:theme', // index.html içindeki tema betiği de bu anahtarı okur
  demoUser: 'ders-panosu:demo-user',
  userData: (uid: string) => `ders-panosu:user-data:${uid}`,
} as const
