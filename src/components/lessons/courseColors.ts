import coursesData from '@/data/courses.json'

/**
 * Her dersin kendi rengi: ders kodu rozetinde kullanılır, böylece dersler sayfalar arasında
 * bir bakışta ayırt edilir. Yeşil ve sarı görev durumlarına, mavi uygulamanın ana rengine
 * ayrıldığı için burada yok. Renk dersin katalogdaki sırasından gelir;
 * yeni ders eklenince mevcut derslerin rengi değişmez.
 */
const PALETTE = [
  {
    badge: 'bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300',
    bar: 'bg-violet-500',
  },
  {
    badge: 'bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300',
    bar: 'bg-sky-500',
  },
  {
    badge: 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-500/15 dark:text-fuchsia-300',
    bar: 'bg-fuchsia-500',
  },
  {
    badge: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-500/15 dark:text-cyan-300',
    bar: 'bg-cyan-500',
  },
  {
    badge: 'bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300',
    bar: 'bg-rose-500',
  },
] as const

export function courseColor(courseId: string) {
  const index = Math.max(
    0,
    coursesData.findIndex((course) => course.id === courseId),
  )
  return PALETTE[index % PALETTE.length]!
}
