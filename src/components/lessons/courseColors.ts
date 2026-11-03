import coursesData from '@/data/courses.json'

/**
 * Her dersin rengi: ders sayfalar arasında bir bakışta ayırt edilsin diye. Turuncu uygulamanın
 * vurgu rengi ve "Devam ediyor" durumu, yeşil "Tamamlandı", kırmızı geciken görev olduğu için
 * burada yok. Renk dersin katalogdaki sırasından gelir; yeni ders eklenince mevcut derslerin
 * rengi değişmez.
 *
 * - solid: dolu zemin (beyaz yazı, kontrast ≥ 4.5:1)
 * - badge: açık zeminli kod rozeti
 * - bar: ince şerit ve çubuklar
 * - text: renkli yazı (aydınlık ve karanlık tema)
 * - ring / border: çerçeve ve sol kenar çizgisi
 */
const PALETTE = [
  {
    solid: 'bg-violet-600 text-white',
    badge: 'bg-violet-100 text-violet-800 dark:bg-violet-500/20 dark:text-violet-200',
    bar: 'bg-violet-500',
    text: 'text-violet-700 dark:text-violet-300',
    ring: 'ring-violet-500',
    border: 'border-violet-500',
  },
  {
    solid: 'bg-sky-700 text-white',
    badge: 'bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-200',
    bar: 'bg-sky-500',
    text: 'text-sky-700 dark:text-sky-300',
    ring: 'ring-sky-500',
    border: 'border-sky-500',
  },
  {
    solid: 'bg-pink-700 text-white',
    badge: 'bg-pink-100 text-pink-800 dark:bg-pink-500/20 dark:text-pink-200',
    bar: 'bg-pink-500',
    text: 'text-pink-700 dark:text-pink-300',
    ring: 'ring-pink-500',
    border: 'border-pink-500',
  },
  {
    solid: 'bg-cyan-700 text-white',
    badge: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-200',
    bar: 'bg-cyan-500',
    text: 'text-cyan-700 dark:text-cyan-300',
    ring: 'ring-cyan-500',
    border: 'border-cyan-500',
  },
  {
    solid: 'bg-fuchsia-700 text-white',
    badge: 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-500/20 dark:text-fuchsia-200',
    bar: 'bg-fuchsia-500',
    text: 'text-fuchsia-700 dark:text-fuchsia-300',
    ring: 'ring-fuchsia-500',
    border: 'border-fuchsia-500',
  },
] as const

export function courseColor(courseId: string) {
  const index = Math.max(
    0,
    coursesData.findIndex((course) => course.id === courseId),
  )
  return PALETTE[index % PALETTE.length]!
}
