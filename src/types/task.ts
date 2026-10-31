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
  /** Kullanıcının kendi eklediği görev (#23). Bu görevlerin haftası yoktur (weekNo 0). */
  custom?: boolean
}

export interface TaskWithStatus extends Task {
  status: TaskStatus
}

/**
 * Kullanıcının ders görevleri dışında kendisinin eklediği görev (#23).
 * Kullanıcının kendi verisinde saklanır (Firestore users/{uid}.customTasks, demo modunda localStorage).
 * Firestore boş değeri (undefined) kabul etmediği için isteğe bağlı alanlar '' olarak tutulur.
 */
export interface CustomTask {
  id: string
  title: string
  description: string
  courseId: string // '' = bir derse bağlı değil
  dueDate: string // '' = son tarih yok, aksi halde "2026-11-02"
  createdAt: string // ISO zaman; liste eklenme sırasına göre dizilir
}

/** Görev ekleme / düzenleme formunun alanları. */
export type CustomTaskInput = Pick<CustomTask, 'title' | 'description' | 'courseId' | 'dueDate'>
