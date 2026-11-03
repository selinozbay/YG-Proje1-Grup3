import { computed, reactive, toValue, type MaybeRefOrGetter } from 'vue'
import Fuse from 'fuse.js'
import type { CourseProgress, CourseStatus } from './useCourseProgress'

export type CourseStatusFilter = CourseStatus | 'all'

export interface CourseFilters {
  status: CourseStatusFilter
  query: string
}

export const createEmptyCourseFilters = (): CourseFilters => ({ status: 'all', query: '' })

export const COURSE_STATUS_FILTERS: CourseStatusFilter[] = [
  'all',
  'not-started',
  'in-progress',
  'done',
]

/**
 * Dersleri duruma ve arama sözcüğüne göre süzer. Arama Fuse.js ile ders kodu,
 * adı, öğretim elemanı ve açıklamada yapılır; şapkalı harfleri ve küçük yazım
 * hatalarını tolere eder (Görevlerim'deki aramayla aynı ayarlar).
 */
export function filterCourses<T extends Pick<CourseProgress, 'course' | 'status'>>(
  items: T[],
  filters: CourseFilters,
): T[] {
  const matching = items.filter(
    (item) => filters.status === 'all' || item.status === filters.status,
  )

  const query = filters.query.trim()
  if (!query) return matching

  const fuse = new Fuse(matching, {
    keys: [
      { name: 'course.code', weight: 2 },
      { name: 'course.title', weight: 2 },
      'course.instructor',
      'course.description',
    ],
    // Görevlerim'deki 0.3 burada fazla gevşek: "veri", Web dersinin açıklamasındaki "ve J..."
    // ile eşleşiyordu. 0.2 dört harflik aramada hata kabul etmez, uzun aramalarda bir harfe izin verir.
    threshold: 0.2,
    ignoreLocation: true,
    ignoreDiacritics: true,
  })
  return fuse.search(query).map((result) => result.item)
}

/** Derslerim sayfasının filtre durumu ve süzülmüş ders listesi. */
export function useCourseFilters<T extends Pick<CourseProgress, 'course' | 'status'>>(
  source: MaybeRefOrGetter<T[]>,
) {
  const filters = reactive<CourseFilters>(createEmptyCourseFilters())

  const filteredCourses = computed(() => filterCourses(toValue(source), filters))

  /** Her durum düğmesinde, arama uygulanınca kaç ders kaldığı. */
  const statusCounts = computed(
    () =>
      Object.fromEntries(
        COURSE_STATUS_FILTERS.map((status) => [
          status,
          filterCourses(toValue(source), { ...filters, status }).length,
        ]),
      ) as Record<CourseStatusFilter, number>,
  )

  const isFiltered = computed(() => filters.status !== 'all' || filters.query.trim() !== '')

  function resetFilters() {
    Object.assign(filters, createEmptyCourseFilters())
  }

  return { filters, filteredCourses, statusCounts, isFiltered, resetFilters }
}
