export type TaskStatus = 'todo' | 'in-progress' | 'done'

/** Arayüzde gösterilecek Türkçe durum adları. */
export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'Yapılacak',
  'in-progress': 'Devam ediyor',
  done: 'Tamamlandı',
}

/**
 * Ders kataloğundaki görev. Durum (status) burada yok: her kullanıcının durumu
 * ayrı saklanır (stores/progress.ts) ve görevle birleştirilerek kullanılır.
 */
export interface Task {
  id: string
  courseId: string
  weekNo: number
  title: string
  description: string
  dueDate?: string // ISO tarih, ör. "2026-11-02"
  tags: string[]
}

export interface TaskWithStatus extends Task {
  status: TaskStatus
}
