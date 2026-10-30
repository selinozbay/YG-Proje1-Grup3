import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'

// Uygulamanın Firebase servislerini (giriş, kullanıcı verisi) bilgisayardaki emülatörlere
// karşı test eder; gerçek projeye dokunmaz. "demo-" ile başlayan proje adı yalnızca
// emülatörlerde çalışır. Çalıştırma: npm run test:firebase
export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'node',
    include: ['test/firebase-services.spec.ts'],
    testTimeout: 20_000,
    env: {
      VITE_FIREBASE_API_KEY: 'demo-api-key',
      VITE_FIREBASE_AUTH_DOMAIN: 'demo-yg-proje1.firebaseapp.com',
      VITE_FIREBASE_PROJECT_ID: 'demo-yg-proje1',
      VITE_FIREBASE_STORAGE_BUCKET: '',
      VITE_FIREBASE_MESSAGING_SENDER_ID: '',
      VITE_FIREBASE_APP_ID: 'demo-app-id',
      VITE_FIREBASE_EMULATORS: 'true',
    },
  },
})
