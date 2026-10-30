import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { userDataService } from '@/services/userData'
import { useProgressStore } from '../progress'
import type { TaskWithStatus } from '@/types/task'

describe('useProgressStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('varsayılan olarak boş veya başlangıç durumundadır', () => {
    const progress = useProgressStore()
    expect(progress.taskStatuses).toEqual({})
    expect(progress.loading).toBe(false)
  })

  it('durumu atanmamış bir görev için statusOf() "todo" döner', () => {
    const progress = useProgressStore()
    expect(progress.statusOf('herhangi-bir-id')).toBe('todo')
  })

  it('summarize() fonksiyonu tamamlanan ve toplam sayısını doğru hesaplar', () => {
    const progress = useProgressStore()
    const mockTasks: TaskWithStatus[] = [
      {
        id: 't1',
        courseId: 'c1',
        weekNo: 1,
        title: 'Görev 1',
        description: 'Açıklama 1',
        tags: ['test'],
        status: 'done',
      },
      {
        id: 't2',
        courseId: 'c1',
        weekNo: 1,
        title: 'Görev 2',
        description: 'Açıklama 2',
        tags: ['test'],
        status: 'todo',
      },
      {
        id: 't3',
        courseId: 'c1',
        weekNo: 1,
        title: 'Görev 3',
        description: 'Açıklama 3',
        tags: ['test'],
        status: 'in-progress',
      },
      {
        id: 't4',
        courseId: 'c1',
        weekNo: 1,
        title: 'Görev 4',
        description: 'Açıklama 4',
        tags: ['test'],
        status: 'done',
      },
    ]

    const summary = progress.summarize(mockTasks)
    expect(summary.total).toBe(4)
    expect(summary.done).toBe(2)
    expect(summary.percent).toBe(50)
  })

  it('load() ve setStatus() kullanıcının görev durumunu günceller', async () => {
    const progress = useProgressStore()
    await progress.load('test-user-1')

    await progress.setStatus('yg-w1-t1', 'done')
    expect(progress.statusOf('yg-w1-t1')).toBe('done')

    await progress.setStatus('yg-w1-t1', 'in-progress')
    expect(progress.statusOf('yg-w1-t1')).toBe('in-progress')
  })

  it('kayıt başarısız olursa durum eski haline döner ve hata iletilir', async () => {
    const progress = useProgressStore()
    await progress.load('test-user-2')
    const spy = vi
      .spyOn(userDataService, 'setTaskStatus')
      .mockRejectedValueOnce(new Error('bağlantı yok'))

    await expect(progress.setStatus('yg-w1-t1', 'done')).rejects.toThrow('bağlantı yok')
    expect(progress.statusOf('yg-w1-t1')).toBe('todo')
    spy.mockRestore()
  })
})
