import { computed } from 'vue'
import { useCatalogStore } from '@/stores/catalog'
import { useProgressStore } from '@/stores/progress'
import type { Course } from '@/types/course'
import type { TaskWithStatus } from '@/types/task'

/** Görevlerin durumlara göre sayısı ve tamamlanma yüzdesi (0-100). */
export interface StatusCounts {
  done: number
  inProgress: number
  todo: number
  total: number
  percent: number
}

/** Dersin genel durumu, görevlerinin durumundan çıkarılır. */
export type CourseStatus = 'not-started' | 'in-progress' | 'done'

export const COURSE_STATUS_LABELS: Record<CourseStatus, string> = {
  'not-started': 'Başlanmadı',
  'in-progress': 'Devam ediyor',
  done: 'Tamamlandı',
}

export function countStatuses(tasks: TaskWithStatus[]): StatusCounts {
  const count = (status: TaskWithStatus['status']) =>
    tasks.filter((task) => task.status === status).length
  const done = count('done')
  const total = tasks.length
  return {
    done,
    inProgress: count('in-progress'),
    todo: count('todo'),
    total,
    percent: total === 0 ? 0 : Math.round((done / total) * 100),
  }
}

/**
 * - done: görevi olan ve hepsi tamamlanmış ders
 * - in-progress: en az bir görevi başlamış ya da tamamlanmış ders
 * - not-started: hiçbir görevine başlanmamış (ya da görevi olmayan) ders
 */
export function getCourseStatus(counts: StatusCounts): CourseStatus {
  if (counts.total > 0 && counts.done === counts.total) return 'done'
  if (counts.done > 0 || counts.inProgress > 0) return 'in-progress'
  return 'not-started'
}

export interface CourseProgress {
  course: Course
  /** Dersin görevleri (kullanıcının o derse eklediği kendi görevleri dahil), hafta sırasıyla. */
  tasks: TaskWithStatus[]
  counts: StatusCounts
  status: CourseStatus
}

/** Haftası olan görevler önce (hafta sırasıyla), kendi görevleri (hafta 0) sonda. */
const byWeek = (a: TaskWithStatus, b: TaskWithStatus) =>
  (a.weekNo || Number.MAX_SAFE_INTEGER) - (b.weekNo || Number.MAX_SAFE_INTEGER)

/**
 * Her dersin görevleri ve ilerlemesi. Derslerim ve Ana Sayfa ortak kullanır;
 * bir görevin durumu nerede değişirse değişsin burası kendiliğinden güncellenir.
 */
export function useCourseProgress() {
  const catalog = useCatalogStore()
  const progress = useProgressStore()

  return computed<CourseProgress[]>(() =>
    catalog.courses.map((course) => {
      const tasks = progress.tasks.filter((task) => task.courseId === course.id).sort(byWeek)
      const counts = countStatuses(tasks)
      return { course, tasks, counts, status: getCourseStatus(counts) }
    }),
  )
}
