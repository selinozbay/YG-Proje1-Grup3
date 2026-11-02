import { TASK_STATUS_LABELS } from '@/types/task'

/**
 * Durum dağılımı çubuğunun parçaları, çizim sırasıyla. Renkler görev durumu
 * rozetleriyle aynı tonlarda (yeşil, mavi); "yapılacak" kalan kısmı gösterdiği için nötr gri.
 * Renk tek başına anlam taşımaz: yanında her zaman ad ve sayı yazar.
 */
export const STATUS_SEGMENTS = [
  { key: 'done', label: TASK_STATUS_LABELS.done, swatch: 'bg-emerald-500', status: 'done' },
  {
    key: 'inProgress',
    label: TASK_STATUS_LABELS['in-progress'],
    swatch: 'bg-indigo-500 dark:bg-indigo-400',
    status: 'in-progress',
  },
  {
    key: 'todo',
    label: TASK_STATUS_LABELS.todo,
    swatch: 'bg-slate-300 dark:bg-slate-600',
    status: 'todo',
  },
] as const
