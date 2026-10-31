import { computed, reactive, type MaybeRefOrGetter, toValue } from 'vue'
import Fuse from 'fuse.js'
import type { TaskStatus, TaskWithStatus } from '@/types/task'

export type StatusFilter = TaskStatus | 'all'
export type WeekFilter = number | 'all'

export interface TaskFilters {
  status: StatusFilter
  courseId: string // 'all' = tüm dersler
  weekNo: WeekFilter
  query: string
}

export const createEmptyFilters = (): TaskFilters => ({
  status: 'all',
  courseId: 'all',
  weekNo: 'all',
  query: '',
})

const STATUS_FILTERS: StatusFilter[] = ['all', 'todo', 'in-progress', 'done']

/**
 * Görevleri duruma, derse, haftaya ve arama sözcüğüne göre süzer.
 * Arama Fuse.js ile yapılır: başlık, açıklama ve etiketlerde arar, küçük yazım
 * hatalarını ve şapkalı harfleri tolere eder ("hikaye" → "hikâye").
 */
export function filterTasks(tasks: TaskWithStatus[], filters: TaskFilters): TaskWithStatus[] {
  const matching = tasks.filter(
    (task) =>
      (filters.status === 'all' || task.status === filters.status) &&
      (filters.courseId === 'all' || task.courseId === filters.courseId) &&
      (filters.weekNo === 'all' || task.weekNo === filters.weekNo),
  )

  const query = filters.query.trim()
  if (!query) return matching

  const fuse = new Fuse(matching, {
    keys: [{ name: 'title', weight: 2 }, 'description', 'tags'],
    // 0.3: üç harflik bir aramada ("SQL") hata kabul edilmez, uzun aramalarda bir-iki harf hatası geçer.
    threshold: 0.3,
    ignoreLocation: true,
    ignoreDiacritics: true,
  })
  return fuse.search(query).map((result) => result.item)
}

/** Görevlerim sayfasının filtre durumu ve süzülmüş liste. */
export function useTaskFilters(source: MaybeRefOrGetter<TaskWithStatus[]>) {
  const filters = reactive<TaskFilters>(createEmptyFilters())

  const filteredTasks = computed(() => filterTasks(toValue(source), filters))

  /** Her durum düğmesinde, diğer filtreler uygulanınca kaç görev kaldığı. */
  const statusCounts = computed(
    () =>
      Object.fromEntries(
        STATUS_FILTERS.map((status) => [
          status,
          filterTasks(toValue(source), { ...filters, status }).length,
        ]),
      ) as Record<StatusFilter, number>,
  )

  const isFiltered = computed(
    () =>
      filters.status !== 'all' ||
      filters.courseId !== 'all' ||
      filters.weekNo !== 'all' ||
      filters.query.trim() !== '',
  )

  function resetFilters() {
    Object.assign(filters, createEmptyFilters())
  }

  return { filters, filteredTasks, statusCounts, isFiltered, resetFilters }
}
