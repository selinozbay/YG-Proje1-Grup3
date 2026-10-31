/**
 * Bir haftanın ders akışındaki yeri (#42). Haftaların tarihi olmadığı için ilerlemeden çıkarılır:
 * - done: haftanın bütün görevleri tamamlandı
 * - current: tamamlanmamış ilk hafta ("şu an buradasın")
 * - upcoming: geri kalanlar
 */
export type WeekState = 'done' | 'current' | 'upcoming'

export const WEEK_STATE_LABELS: Record<WeekState, string> = {
  done: 'Tamamlandı',
  current: 'Şu anki hafta',
  upcoming: 'Sırada',
}

/** Rozet renkleri, görev durumlarıyla aynı tonlarda (aydınlık ve karanlık tema). */
export const WEEK_STATE_CLASSES: Record<WeekState, string> = {
  done: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300',
  current: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/15 dark:text-indigo-300',
  upcoming: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
}

/** Haftaların sıralı ilerlemelerinden (done / total) her haftanın durumunu çıkarır. */
export function getWeekStates(weeks: { done: number; total: number }[]): WeekState[] {
  const isDone = (w: { done: number; total: number }) => w.total > 0 && w.done === w.total
  // Görevi olmayan hafta şu anki hafta olamaz; yoksa akış o haftada takılı kalır.
  const currentIndex = weeks.findIndex((w) => w.total > 0 && !isDone(w))
  return weeks.map((w, i) => (isDone(w) ? 'done' : i === currentIndex ? 'current' : 'upcoming'))
}
