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

describe('Kullanıcının kendi görevleri (#23)', () => {
  const USER = 'ogrenci-kendi'
  const newTask = {
    title: '  Sunuma hazırlan  ',
    description: 'Slaytları bitir',
    courseId: 'yazilim-gelistirme',
    dueDate: '2026-11-10',
  }

  beforeEach(async () => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.restoreAllMocks()
    await useProgressStore().load(USER)
  })

  it('eklenen görev ders görevlerinin ardından listeye "kendi görevi" olarak girer', async () => {
    const progress = useProgressStore()
    const before = progress.tasks.length

    const id = await progress.saveCustomTask(newTask)

    expect(progress.tasks).toHaveLength(before + 1)
    const added = progress.tasks[progress.tasks.length - 1]!
    expect(added).toMatchObject({
      id,
      title: 'Sunuma hazırlan',
      description: 'Slaytları bitir',
      courseId: 'yazilim-gelistirme',
      dueDate: '2026-11-10',
      weekNo: 0,
      tags: [],
      custom: true,
      status: 'todo',
    })
    expect(id).toMatch(/^custom-/)
  })

  it('kendi görevinin durumu değiştirilir ve genel ilerlemeye sayılır', async () => {
    const progress = useProgressStore()
    const id = await progress.saveCustomTask(newTask)

    await progress.setStatus(id, 'done')

    expect(progress.overall.done).toBe(1)
    expect(progress.overall.total).toBe(progress.tasks.length)
  })

  it('kaydedilen görev sayfa yenilenince geri gelir', async () => {
    const id = await useProgressStore().saveCustomTask(newTask)

    setActivePinia(createPinia())
    const reloaded = useProgressStore()
    await reloaded.load(USER)

    expect(reloaded.tasks.find((task) => task.id === id)?.title).toBe('Sunuma hazırlan')
  })

  it('düzenlenen görev aynı id ve eklenme zamanıyla güncellenir; boşaltılan alanlar silinir', async () => {
    const progress = useProgressStore()
    const id = await progress.saveCustomTask(newTask)
    const createdAt = progress.customTasks[id]!.createdAt

    await progress.saveCustomTask({ ...newTask, title: 'Sunum provası', dueDate: '' }, id)

    expect(Object.keys(progress.customTasks)).toEqual([id])
    expect(progress.customTasks[id]).toMatchObject({
      title: 'Sunum provası',
      dueDate: '',
      createdAt,
    })
    expect(progress.tasks.find((task) => task.id === id)?.dueDate).toBeUndefined()
  })

  it('silinen görev ve durumu listeden ve kayıttan kalkar', async () => {
    const progress = useProgressStore()
    const id = await progress.saveCustomTask(newTask)
    await progress.setStatus(id, 'in-progress')

    await progress.deleteCustomTask(id)

    expect(progress.tasks.some((task) => task.id === id)).toBe(false)
    expect(progress.taskStatuses[id]).toBeUndefined()
    setActivePinia(createPinia())
    const reloaded = useProgressStore()
    await reloaded.load(USER)
    expect(reloaded.customTasks).toEqual({})
    expect(reloaded.taskStatuses[id]).toBeUndefined()
  })

  it('kayıt başarısız olursa eklenen görev geri alınır ve hata iletilir', async () => {
    const progress = useProgressStore()
    vi.spyOn(userDataService, 'saveCustomTask').mockRejectedValueOnce(new Error('bağlantı yok'))

    await expect(progress.saveCustomTask(newTask)).rejects.toThrow('bağlantı yok')
    expect(progress.customTasks).toEqual({})
  })

  it('silme başarısız olursa görev ve durumu geri gelir', async () => {
    const progress = useProgressStore()
    const id = await progress.saveCustomTask(newTask)
    await progress.setStatus(id, 'done')
    vi.spyOn(userDataService, 'deleteCustomTask').mockRejectedValueOnce(new Error('bağlantı yok'))

    await expect(progress.deleteCustomTask(id)).rejects.toThrow('bağlantı yok')
    expect(progress.customTasks[id]).toBeDefined()
    expect(progress.statusOf(id)).toBe('done')
  })

  it('çıkış yapınca kendi görevleri de bellekten silinir', async () => {
    const progress = useProgressStore()
    await progress.saveCustomTask(newTask)

    progress.reset()

    expect(progress.customTasks).toEqual({})
    expect(progress.tasks.some((task) => task.custom)).toBe(false)
  })
})
