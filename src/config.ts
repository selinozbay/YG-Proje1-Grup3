export const APP_NAME = 'Ders Panosu'

/**
 * Gizlilik/KVKK sayfasında gösterilen başvuru adresi.
 * TODO: Ekip iletişim e-postası belirlenince doldurun.
 */
export const CONTACT_EMAIL = ''

/** localStorage anahtarları tek yerde tutulur; çakışmasın diye hepsi aynı önekle başlar. */
export const STORAGE_KEYS = {
  theme: 'ders-panosu:theme', // index.html içindeki tema betiği de bu anahtarı okur
  demoUser: 'ders-panosu:demo-user',
  userData: (uid: string) => `ders-panosu:user-data:${uid}`,
} as const
