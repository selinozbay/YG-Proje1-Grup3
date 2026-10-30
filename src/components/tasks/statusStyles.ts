import type { TaskStatus } from '@/types/task'

/** Görev durumunun rozet ve seçicide kullanılan renkleri (aydınlık ve karanlık tema). */
export const STATUS_CLASSES: Record<TaskStatus, string> = {
  todo: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  'in-progress': 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
  done: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300',
}
