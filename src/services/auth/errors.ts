// Firebase hata kodlarının Türkçe karşılıkları. Demo modu da aynı kodları kullanır.
const MESSAGES: Record<string, string> = {
  'auth/invalid-credential': 'E-posta veya şifre hatalı.',
  'auth/invalid-email': 'Geçerli bir e-posta adresi girin.',
  'auth/email-already-in-use': 'Bu e-posta adresiyle zaten bir hesap var.',
  'auth/weak-password': 'Şifre en az 6 karakter olmalı.',
  'auth/too-many-requests': 'Çok fazla deneme yapıldı. Biraz bekleyip tekrar deneyin.',
  'auth/network-request-failed': 'Bağlantı kurulamadı. İnternet bağlantınızı kontrol edin.',
  'auth/requires-recent-login': 'Bu işlem için çıkış yapıp yeniden giriş yapmanız gerekiyor.',
  'auth/operation-not-allowed': "E-posta ile giriş Firebase Console'da etkinleştirilmemiş.",
}

export function getAuthErrorMessage(error: unknown): string {
  const code =
    typeof error === 'object' && error !== null && 'code' in error ? String(error.code) : ''
  return MESSAGES[code] ?? 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.'
}

/** Firebase hatasıyla aynı biçimde ({ code }) hata üretir. */
export function createAuthError(code: string): Error {
  return Object.assign(new Error(code), { code })
}
