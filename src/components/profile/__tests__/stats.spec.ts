import { describe, expect, it } from 'vitest'
import type { TaskStatus, TaskWithStatus } from '@/types/task'
import { getProfileStats } from '../stats'

const courses = [
  { id: 'a', title: 'A Dersi' },
  { id: 'b', title: 'B Dersi' },
  { id: 'c', title: 'C Dersi' },
]

let n = 0
const task = (courseId: string, status: TaskStatus): TaskWithStatus => ({
  id: `t${++n}`,
  courseId,
  weekNo: 1,
  title: 'Görev',
  description: '',
  tags: [],
  status,
})

describe('getProfileStats (#29)', () => {
  it('görevleri durumlarına göre sayar ve tamamlanma yüzdesini hesaplar', () => {
    const stats = getProfileStats(courses, [
      task('a', 'done'),
      task('a', 'in-progress'),
      task('b', 'todo'),
      task('b', 'todo'),
    ])
    expect(stats.tasks).toEqual({ total: 4, done: 1, inProgress: 1, todo: 2, percent: 25 })
  })

  it('bitmemiş görevi olan ders aktif, bütün görevleri biten ders tamamlanmış sayılır', () => {
    const stats = getProfileStats(courses, [
      task('a', 'done'),
      task('a', 'done'),
      task('b', 'in-progress'),
      task('c', 'todo'),
    ])
    expect(stats.activeCourses).toBe(2)
    expect(stats.completedCourses).toBe(1)
  })

  it('ders bazında ilerlemeyi ders sırasıyla verir; görevi olmayan ders %0 görünür', () => {
    const stats = getProfileStats(courses, [
      task('a', 'done'),
      task('a', 'todo'),
      task('b', 'done'),
    ])
    expect(stats.courses).toEqual([
      { id: 'a', title: 'A Dersi', done: 1, total: 2, percent: 50 },
      { id: 'b', title: 'B Dersi', done: 1, total: 1, percent: 100 },
      { id: 'c', title: 'C Dersi', done: 0, total: 0, percent: 0 },
    ])
  })

  it('hiç görev yoksa sıfırlar döner ve sıfıra bölme olmaz', () => {
    const stats = getProfileStats(courses, [])
    expect(stats.tasks).toEqual({ total: 0, done: 0, inProgress: 0, todo: 0, percent: 0 })
    expect(stats.activeCourses).toBe(0)
    expect(stats.completedCourses).toBe(0)
  })
})
