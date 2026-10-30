import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import tasksData from '@/data/tasks.json'
import type { TaskWithStatus } from '@/types/task'
import { createEmptyFilters, filterTasks, useTaskFilters } from '../useTaskFilters'

const task = (id: string, overrides: Partial<TaskWithStatus> = {}): TaskWithStatus => ({
  id,
  courseId: 'yazilim-gelistirme',
  weekNo: 1,
  title: id,
  description: '',
  tags: [],
  status: 'todo',
  ...overrides,
})

const tasks: TaskWithStatus[] = [
  task('a', { title: 'Kullanıcı hikâyelerini yaz', status: 'done' }),
  task('b', { title: 'Sayfa taslaklarını çiz', weekNo: 2, status: 'in-progress' }),
  task('c', {
    courseId: 'veri-tabani',
    title: 'JOIN alıştırmalarını çöz',
    description: 'Soruları SQL ile yanıtlayın.',
    tags: ['sql'],
  }),
  task('d', {
    courseId: 'veri-tabani',
    weekNo: 2,
    title: 'Anahtarları belirle',
    tags: ['modelleme'],
  }),
]

const ids = (list: TaskWithStatus[]) => list.map((item) => item.id).sort()

describe('filterTasks', () => {
  it('filtre yoksa bütün görevleri döner', () => {
    expect(ids(filterTasks(tasks, createEmptyFilters()))).toEqual(['a', 'b', 'c', 'd'])
  })

  it('duruma göre süzer', () => {
    const filters = { ...createEmptyFilters(), status: 'todo' as const }
    expect(ids(filterTasks(tasks, filters))).toEqual(['c', 'd'])
  })

  it('derse ve haftaya göre süzer', () => {
    expect(ids(filterTasks(tasks, { ...createEmptyFilters(), courseId: 'veri-tabani' }))).toEqual([
      'c',
      'd',
    ])
    expect(ids(filterTasks(tasks, { ...createEmptyFilters(), weekNo: 2 }))).toEqual(['b', 'd'])
  })

  it('başlık, açıklama ve etiketlerde arar; büyük/küçük harf fark etmez', () => {
    expect(ids(filterTasks(tasks, { ...createEmptyFilters(), query: 'sql' }))).toEqual(['c'])
    expect(ids(filterTasks(tasks, { ...createEmptyFilters(), query: 'modelleme' }))).toEqual(['d'])
  })

  it('şapkasız ve küçük yazım hatalı aramayı da bulur', () => {
    expect(ids(filterTasks(tasks, { ...createEmptyFilters(), query: 'hikaye' }))).toEqual(['a'])
    expect(ids(filterTasks(tasks, { ...createEmptyFilters(), query: 'taslaklrını' }))).toEqual([
      'b',
    ])
  })

  it('aramayı diğer filtrelerle birlikte uygular', () => {
    const filters = { ...createEmptyFilters(), courseId: 'yazilim-gelistirme', query: 'sql' }
    expect(filterTasks(tasks, filters)).toEqual([])
  })

  it('örnek veride "SQL" araması yalnızca SQL ile ilgili görevleri getirir', () => {
    const all = tasksData.map((item) => ({ ...item, status: 'todo' as const }))
    const found = filterTasks(all, { ...createEmptyFilters(), query: 'SQL' })
    expect(found.length).toBeGreaterThanOrEqual(2)
    for (const item of found) {
      const text = `${item.title} ${item.description} ${item.tags.join(' ')}`
      expect(text.toLocaleLowerCase('tr-TR'), item.id).toContain('sql')
    }
  })
})

describe('useTaskFilters', () => {
  it('durum sayılarını diğer filtrelere göre hesaplar ve sıfırlanabilir', () => {
    const source = ref(tasks)
    const { filters, filteredTasks, statusCounts, isFiltered, resetFilters } =
      useTaskFilters(source)

    expect(statusCounts.value).toEqual({ all: 4, todo: 2, 'in-progress': 1, done: 1 })
    expect(isFiltered.value).toBe(false)

    filters.courseId = 'veri-tabani'
    expect(statusCounts.value).toEqual({ all: 2, todo: 2, 'in-progress': 0, done: 0 })
    expect(isFiltered.value).toBe(true)

    resetFilters()
    expect(filteredTasks.value).toHaveLength(4)
    expect(isFiltered.value).toBe(false)
  })
})
