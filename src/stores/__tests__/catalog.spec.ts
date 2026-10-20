import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useCatalogStore } from '../catalog'

describe('useCatalogStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('ders ve hafta listesini başarıyla yükler', () => {
    const catalog = useCatalogStore()
    expect(catalog.courses.length).toBeGreaterThan(0)
    expect(catalog.weeks.length).toBeGreaterThan(0)
    expect(catalog.tasks.length).toBeGreaterThan(0)
  })

  it('getCourse() geçerli ders id ile doğru dersi döner', () => {
    const catalog = useCatalogStore()
    const firstCourse = catalog.courses[0]!
    const found = catalog.getCourse(firstCourse.id)
    expect(found).toBeDefined()
    expect(found?.id).toBe(firstCourse.id)
    expect(found?.title).toBe(firstCourse.title)
  })

  it('getCourse() geçersiz id verildiğinde undefined döner', () => {
    const catalog = useCatalogStore()
    const found = catalog.getCourse('olmayan-ders-id')
    expect(found).toBeUndefined()
  })

  it('getWeeks() verilen derse ait haftaları küçükten büyüğe sıralı döner', () => {
    const catalog = useCatalogStore()
    const firstCourse = catalog.courses[0]!
    const weeks = catalog.getWeeks(firstCourse.id)
    expect(weeks.length).toBeGreaterThan(0)
    for (let i = 1; i < weeks.length; i++) {
      expect(weeks[i]!.weekNo).toBeGreaterThanOrEqual(weeks[i - 1]!.weekNo)
    }
  })
})
