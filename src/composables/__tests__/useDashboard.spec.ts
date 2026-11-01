import { describe, it, expect } from 'vitest'
import {
  addDays,
  countOverdue,
  daysLeftText,
  getCurrentWeeks,
  getElapsedPercent,
  getTermWeeks,
  getUpcomingTasks,
  groupByDueDate,
} from '../useDashboard'
import coursesData from '@/data/courses.json'
import weeksData from '@/data/weeks.json'
import tasksData from '@/data/tasks.json'
import type { TaskStatus, TaskWithStatus } from '@/types/task'

// Örnek veride her dersin 4 haftası var; haftaların son tarihleri:
// VT 19.10 / 26.10 / 2.11 / 9.11, WP 20.10 / 27.10 / 3.11 / 10.11, YG 21.10 / 28.10 / 4.11 / 11.11
const current = (today: string) =>
  getCurrentWeeks(coursesData, weeksData, tasksData, today).map(
    (item) => `${item.course.code}-${item.week.weekNo}@${item.deadline}`,
  )

describe('getCurrentWeeks (#48)', () => {
  it('son tarihi bugün ya da sonra olan ilk haftayı seçer', () => {
    expect(current('2026-10-31')).toEqual(['YG-3@2026-11-04', 'WP-3@2026-11-03', 'VT-3@2026-11-02'])
  })

  it('son tarih günü hafta hâlâ "bu hafta" sayılır, ertesi gün sonraki haftaya geçilir', () => {
    expect(current('2026-11-02')).toContain('VT-3@2026-11-02')
    expect(current('2026-11-03')).toContain('VT-4@2026-11-09')
  })

  it('dönem başlamadan ilk haftayı, bütün haftaları geçen dersi hiç göstermez', () => {
    expect(current('2026-10-01')).toEqual(['YG-1@2026-10-21', 'WP-1@2026-10-20', 'VT-1@2026-10-19'])
    expect(current('2026-11-10')).toEqual(['YG-4@2026-11-11', 'WP-4@2026-11-10'])
    expect(current('2026-12-01')).toEqual([])
  })
})

const task = (
  id: string,
  dueDate: string | undefined,
  status: TaskStatus = 'todo',
): TaskWithStatus => ({
  id,
  courseId: 'veri-tabani',
  weekNo: 1,
  title: id,
  description: '',
  ...(dueDate ? { dueDate } : {}),
  tags: [],
  status,
})

describe('getUpcomingTasks ve countOverdue (#13)', () => {
  const tasks = [
    task('gecmis', '2026-10-20'),
    task('sonra', '2026-11-09'),
    task('bugun', '2026-10-31'),
    task('bitti', '2026-11-01', 'done'),
    task('tarihsiz', undefined),
    task('yakin', '2026-11-02', 'in-progress'),
  ]

  it('bitmemiş ve son tarihi gelmemiş görevleri tarihe göre sıralar', () => {
    expect(getUpcomingTasks(tasks, '2026-10-31').map((t) => t.id)).toEqual([
      'bugun',
      'yakin',
      'sonra',
    ])
  })

  it('en fazla verilen sayıda görev döner', () => {
    expect(getUpcomingTasks(tasks, '2026-10-31', 2).map((t) => t.id)).toEqual(['bugun', 'yakin'])
  })

  it('son tarihi geçmiş, bitmemiş görevleri sayar', () => {
    expect(countOverdue(tasks, '2026-10-31')).toBe(1)
    expect(countOverdue(tasks, '2026-11-05')).toBe(3)
  })
})

describe('daysLeftText', () => {
  it.each([
    ['2026-10-31', 'Bugün'],
    ['2026-11-01', 'Yarın'],
    ['2026-11-04', '4 gün kaldı'],
  ])('%s → %s', (due, text) => {
    expect(daysLeftText(due, '2026-10-31')).toBe(text)
  })
})

describe('getTermWeeks ve getElapsedPercent (dönem çizelgesi)', () => {
  const withStatus = (status: TaskStatus = 'todo'): TaskWithStatus[] =>
    tasksData.map((t) => ({ ...t, status }))

  it('haftaların tarihini görevlerin son tarihinden çıkarır', () => {
    const weeks = getTermWeeks(withStatus(), '2026-10-31')
    expect(weeks.map((w) => `${w.weekNo}:${w.start}..${w.end}`)).toEqual([
      '1:2026-10-15..2026-10-21',
      '2:2026-10-22..2026-10-28',
      '3:2026-10-29..2026-11-04',
      '4:2026-11-05..2026-11-11',
    ])
    expect(weeks.map((w) => w.state)).toEqual(['past', 'past', 'current', 'upcoming'])
    expect(weeks.map((w) => w.total)).toEqual([6, 6, 6, 6])
  })

  it('bitmemiş ve süresi geçmiş görevleri haftasına sayar; bitenler sayılmaz', () => {
    expect(getTermWeeks(withStatus(), '2026-10-31').map((w) => w.overdue)).toEqual([4, 3, 0, 0])
    expect(getTermWeeks(withStatus('done'), '2026-10-31').map((w) => w.overdue)).toEqual([
      0, 0, 0, 0,
    ])
  })

  it('geçen süreyi bugün dahil hesaplar, dönem dışında 0 ya da 100 olur', () => {
    const weeks = getTermWeeks(withStatus(), '2026-10-31')
    expect(getElapsedPercent(weeks, '2026-10-31')).toBe(61)
    expect(getElapsedPercent(weeks, '2026-10-01')).toBe(0)
    expect(getElapsedPercent(weeks, '2026-12-01')).toBe(100)
    expect(getElapsedPercent([], '2026-10-31')).toBe(0)
  })

  it('addDays ay sonunu doğru geçer', () => {
    expect(addDays('2026-10-28', 4)).toBe('2026-11-01')
    expect(addDays('2026-10-21', -6)).toBe('2026-10-15')
  })
})

describe('groupByDueDate', () => {
  it('aynı günün görevlerini sırasını bozmadan bir araya toplar', () => {
    const groups = groupByDueDate([
      task('a', '2026-11-02'),
      task('b', '2026-11-02'),
      task('c', '2026-11-03'),
    ])
    expect(groups.map((g) => [g.date, g.tasks.map((t) => t.id)])).toEqual([
      ['2026-11-02', ['a', 'b']],
      ['2026-11-03', ['c']],
    ])
  })
})
