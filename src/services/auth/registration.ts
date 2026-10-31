// Kayıt formunun kuralları. Yalnızca kayıtta uygulanır; giriş ve şifre sıfırlama serbesttir.

/** KTÜ öğrenci e-postası: öğrenci numarası (yalnızca rakam) + @ogr.ktu.edu.tr (#6). */
const STUDENT_EMAIL = /^\d+@ogr\.ktu\.edu\.tr$/i

export function isStudentEmail(email: string): boolean {
  return STUDENT_EMAIL.test(email.trim())
}

export type PasswordStrength = 'weak' | 'medium' | 'strong'

export const PASSWORD_STRENGTH_LABELS: Record<PasswordStrength, string> = {
  weak: 'Zayıf',
  medium: 'Orta',
  strong: 'Güçlü',
}

/**
 * Şifre gücü (#7). Karakter türleri: küçük harf, büyük harf, rakam, simge.
 * - Zayıf: 8 karakterden kısa ya da tek tür. Zayıf şifreyle kayıt olunmaz.
 * - Güçlü: en az 10 karakter ve en az üç tür.
 * - Orta: ikisinin arası.
 */
export function checkPasswordStrength(password: string): {
  level: PasswordStrength
  hints: string[]
} {
  // \p{Ll} / \p{Lu}: Türkçe harfler (ç, ğ, ı, ö, ş, ü) dahil küçük ve büyük harfler.
  const kinds = {
    lower: /\p{Ll}/u.test(password),
    upper: /\p{Lu}/u.test(password),
    digit: /\p{N}/u.test(password),
    symbol: /[^\p{L}\p{N}\s]/u.test(password),
  }
  const kindCount = Object.values(kinds).filter(Boolean).length

  const hints: string[] = []
  if (password.length < 8) hints.push('En az 8 karakter kullanın.')
  if (!kinds.lower) hints.push('Küçük harf ekleyin.')
  if (!kinds.upper) hints.push('Büyük harf ekleyin.')
  if (!kinds.digit) hints.push('Rakam ekleyin.')
  if (!kinds.symbol) hints.push('Simge ekleyin (ör. ! ? - #).')

  let level: PasswordStrength = 'medium'
  if (password.length < 8 || kindCount < 2) level = 'weak'
  else if (password.length >= 10 && kindCount >= 3) level = 'strong'

  return { level, hints }
}
