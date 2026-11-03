import { describe, it, expect } from 'vitest'
import { nextTick, ref } from 'vue'
import { createEmptyCourseFilters, filterCourses, useCourseFilters } from '../useCourseFilters'
import type { CourseStatus } from '../useCourseProgress'
import coursesData from '@/data/courses.json'

// Örnek veriden dersler: YG (Yazılım Geliştirme), WP (Web Programlama), VT (Veri Tabanı...).
const statuses: Record<string, CourseStatus> = {
  'yazilim-gelistirme': 'in-progress',
  'web-programlama': 'not-started',
  'veri-tabani': 'done',
}
const items = coursesData.map((course) => ({ course, status: statuses[course.id]! }))

const ids = (list: { course: { id: string } }[]) => list.map((item) => item.course.id)
const search = (query: string) => ids(filterCourses(items, { status: 'all', query }))

describe('filterCourses', () => {
  it('filtre yokken bütün dersleri sırasıyla döner', () => {
    expect(ids(filterCourses(items, createEmptyCourseFilters()))).toEqual(ids(items))
  })

  it.each([
    ['not-started', ['web-programlama']],
    ['in-progress', ['yazilim-gelistirme']],
    ['done', ['veri-tabani']],
  ] as const)('"%s" durumundaki dersleri döner', (status, expected) => {
    expect(ids(filterCourses(items, { status, query: '' }))).toEqual(expected)
  })

  it('ders koduyla, adıyla ve açıklamasıyla arar', () => {
    expect(search('VT')).toEqual(['veri-tabani'])
    expect(search('web')).toEqual(['web-programlama'])
    expect(search('SQL')).toEqual(['veri-tabani'])
  })

  it('şapkalı ve noktalı harfleri ve küçük yazım hatalarını tolere eder', () => {
    expect(search('veri tabani')).toEqual(['veri-tabani'])
    expect(search('yazilim')).toEqual(['yazilim-gelistirme'])
    expect(search('programlma')).toEqual(['web-programlama'])
  })

  it('arama ve durum filtresi birlikte uygulanır; uyan yoksa boş döner', () => {
    expect(ids(filterCourses(items, { status: 'done', query: 'web' }))).toEqual([])
    expect(search('kimya')).toEqual([])
  })
})

describe('useCourseFilters', () => {
  it('durum düğmelerinin sayılarını aramaya göre günceller ve sıfırlanabilir', async () => {
    const source = ref(items)
    const { filters, filteredCourses, statusCounts, isFiltered, resetFilters } =
      useCourseFilters(source)

    expect(statusCounts.value).toEqual({ all: 3, 'not-started': 1, 'in-progress': 1, done: 1 })
    expect(isFiltered.value).toBe(false)

    filters.query = 'veri'
    await nextTick()
    expect(ids(filteredCourses.value)).toEqual(['veri-tabani'])
    expect(statusCounts.value).toEqual({ all: 1, 'not-started': 0, 'in-progress': 0, done: 1 })
    expect(isFiltered.value).toBe(true)

    resetFilters()
    expect(filteredCourses.value).toHaveLength(3)
    expect(isFiltered.value).toBe(false)
  })
})
