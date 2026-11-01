import { TASK_STATUS_LABELS } from '@/types/task'

/**
 * Durum dağılımı çubuğunun parçaları, çizim sırasıyla. Renkler görev durumu
 * rozetleriyle aynı tonlarda; "yapılacak" kalan kısmı gösterdiği için nötr gri.
 * Renk tek başına anlam taşımaz: yanında her zaman ad ve sayı yazar.
 */
export const STATUS_SEGMENTS = [
  { key: 'done', label: TASK_STATUS_LABELS.done, swatch: 'bg-emerald-500' },
  { key: 'inProgress', label: TASK_STATUS_LABELS['in-progress'], swatch: 'bg-amber-400' },
  { key: 'todo', label: TASK_STATUS_LABELS.todo, swatch: 'bg-slate-300 dark:bg-slate-600' },
] as const
