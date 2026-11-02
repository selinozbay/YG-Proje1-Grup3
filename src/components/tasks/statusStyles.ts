import type { TaskStatus } from '@/types/task'

/**
 * Görev durumunun rozet ve seçicide kullanılan renkleri (aydınlık ve karanlık tema).
 * Gri: yapılacak, mavi: devam ediyor, yeşil: tamamlandı. Rozetin içinde StatusIcon da durur;
 * durum renge bakmadan da şekilden anlaşılır.
 */
export const STATUS_CLASSES: Record<TaskStatus, string> = {
  todo: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  'in-progress': 'bg-indigo-50 text-indigo-800 dark:bg-indigo-500/15 dark:text-indigo-200',
  done: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300',
}
