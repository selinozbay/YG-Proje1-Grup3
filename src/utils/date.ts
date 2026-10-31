/**
 * "2026-11-04" → "4 Kasım" (withYear ile "4 Kasım 2026"). Saati eklemek tarihin
 * yerel saatle okunmasını sağlar; yoksa bazı saat dilimlerinde bir önceki gün görünür.
 */
export function formatDate(isoDate: string, withYear = false) {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    ...(withYear ? { year: 'numeric' } : {}),
  })
}

/** Tarihi gün adıyla yazar: "1 Kasım Pazar". `isoDate` verilirse o gün. */
export function formatDayLong(date: Date | string) {
  const value = typeof date === 'string' ? new Date(`${date}T00:00:00`) : date
  return value.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' })
}

/** Yerel saate göre bugünün tarihi, görevlerdeki biçimde: "2026-10-31". */
export function toISODate(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}
