import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import {
  countStatuses,
  getCourseStatus,
  useCourseProgress,
  type StatusCounts,
} from '../useCourseProgress'
import { useCatalogStore } from '@/stores/catalog'
import { useProgressStore } from '@/stores/progress'
import type { TaskStatus, TaskWithStatus } from '@/types/task'

const task = (id: string, status: TaskStatus, weekNo = 1): TaskWithStatus => ({
  id,
  courseId: 'veri-tabani',
  weekNo,
  title: id,
  description: '',
  tags: [],
  status,
})

const counts = (done: number, inProgress: number, todo: number): StatusCounts => {
  const total = done + inProgress + todo
  return { done, inProgress, todo, total, percent: total ? Math.round((done / total) * 100) : 0 }
}

describe('countStatuses', () => {
  it('durumları sayar ve tamamlanma yüzdesini yuvarlar', () => {
    expect(countStatuses([task('a', 'done'), task('b', 'in-progress'), task('c', 'todo')])).toEqual(
      { done: 1, inProgress: 1, todo: 1, total: 3, percent: 33 },
    )
  })

  it('görev yokken her şey sıfırdır, hata vermez', () => {
    expect(countStatuses([])).toEqual({ done: 0, inProgress: 0, todo: 0, total: 0, percent: 0 })
  })
})

describe('getCourseStatus', () => {
  it.each([
    ['hiç başlanmamış', counts(0, 0, 4), 'not-started'],
    ['görevi olmayan', counts(0, 0, 0), 'not-started'],
    ['bir görevi devam eden', counts(0, 1, 3), 'in-progress'],
    ['bir görevi tamamlanmış', counts(1, 0, 3), 'in-progress'],
    ['bütün görevleri tamamlanmış', counts(4, 0, 0), 'done'],
  ] as const)('%s ders: %s', (_, value, expected) => {
    expect(getCourseStatus(value)).toBe(expected)
  })
})

describe('useCourseProgress', () => {
  beforeEach(async () => {
    localStorage.clear()
    setActivePinia(createPinia())
    await useProgressStore().load('ogrenci-1')
  })

  it('her ders için kendi görevlerini hafta sırasıyla ve ilerlemesini verir', () => {
    const catalog = useCatalogStore()
    const courses = useCourseProgress()

    expect(courses.value.map((item) => item.course.id)).toEqual(
      catalog.courses.map((course) => course.id),
    )
    for (const item of courses.value) {
      expect(item.tasks.every((t) => t.courseId === item.course.id)).toBe(true)
      expect(item.tasks.length).toBe(
        catalog.tasks.filter((t) => t.courseId === item.course.id).length,
      )
      const weekNos = item.tasks.map((t) => t.weekNo)
      expect(weekNos).toEqual([...weekNos].sort((a, b) => a - b))
      expect(item.status).toBe('not-started')
    }
  })

  it('görev durumu değişince dersin ilerlemesi ve durumu güncellenir', async () => {
    const progress = useProgressStore()
    const courses = useCourseProgress()
    const vt = () => courses.value.find((item) => item.course.id === 'veri-tabani')!

    await progress.setStatus(vt().tasks[0]!.id, 'done')

    expect(vt().counts.done).toBe(1)
    expect(vt().status).toBe('in-progress')

    for (const t of vt().tasks) await progress.setStatus(t.id, 'done')
    expect(vt().counts.percent).toBe(100)
    expect(vt().status).toBe('done')
  })

  it('derse eklenen kendi görevi o dersin görevlerinde, haftalı görevlerden sonra yer alır', async () => {
    const progress = useProgressStore()
    const courses = useCourseProgress()
    const before = courses.value.find((item) => item.course.id === 'veri-tabani')!.counts.total

    await progress.saveCustomTask({
      title: 'SQL alıştırmaları',
      description: '',
      courseId: 'veri-tabani',
      dueDate: '',
    })

    const vt = courses.value.find((item) => item.course.id === 'veri-tabani')!
    expect(vt.counts.total).toBe(before + 1)
    expect(vt.tasks[vt.tasks.length - 1]!.title).toBe('SQL alıştırmaları')
  })
})
