import { initializeApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

// Değerler .env.local dosyasından gelir; anahtarlar repoya yazılmaz (bkz. .env.example).
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

/**
 * Firebase yalnızca .env.local doluysa kullanılır. Değerler yoksa ya da uygulama
 * `npm run dev:demo` ile açıldıysa DEMO MODU devreye girer: giriş ve ilerleme
 * localStorage'da tutulur (services/auth/local.ts, services/userData/local.ts).
 * Böylece repo, Firebase anahtarları olmadan da çalıştırılabilir.
 */
export const isFirebaseEnabled =
  import.meta.env.MODE !== 'demo' &&
  Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId)

let services: { auth: Auth; db: Firestore } | null = null

/** Firebase'i ilk kullanımda başlatır; sonraki çağrılarda aynı örneği döndürür. */
export function getFirebase() {
  if (!isFirebaseEnabled) {
    throw new Error('Firebase yapılandırılmadı; uygulama demo modunda çalışıyor.')
  }
  if (!services) {
    const app = initializeApp(firebaseConfig)
    const auth = getAuth(app)
    auth.languageCode = 'tr' // şifre sıfırlama e-postaları Türkçe gönderilsin
    services = { auth, db: getFirestore(app) }
  }
  return services
}
