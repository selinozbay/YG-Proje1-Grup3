import coursesData from '@/data/courses.json'

/**
 * Her dersin ayraç rengi: defterdeki renkli ayraçlar gibi, ders sayfalar arasında bir bakışta
 * ayırt edilsin diye. Yeşil "Tamamlandı", mavi "Devam ediyor", sarı "şu an" anlamına geldiği
 * için burada yok. Renk dersin katalogdaki sırasından gelir; yeni ders eklenince mevcut
 * derslerin rengi değişmez.
 *
 * - solid: dolu ayraç (beyaz yazı, kontrast ≥ 4.5:1)
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
    solid: 'bg-orange-700 text-white',
    badge: 'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-200',
    bar: 'bg-orange-500',
    text: 'text-orange-700 dark:text-orange-300',
    ring: 'ring-orange-500',
    border: 'border-orange-500',
  },
  {
    solid: 'bg-fuchsia-700 text-white',
    badge: 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-500/20 dark:text-fuchsia-200',
    bar: 'bg-fuchsia-500',
    text: 'text-fuchsia-700 dark:text-fuchsia-300',
    ring: 'ring-fuchsia-500',
    border: 'border-fuchsia-500',
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
    solid: 'bg-rose-600 text-white',
    badge: 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-200',
    bar: 'bg-rose-500',
    text: 'text-rose-700 dark:text-rose-300',
    ring: 'ring-rose-500',
    border: 'border-rose-500',
  },
] as const

export function courseColor(courseId: string) {
  const index = Math.max(
    0,
    coursesData.findIndex((course) => course.id === courseId),
  )
  return PALETTE[index % PALETTE.length]!
}
