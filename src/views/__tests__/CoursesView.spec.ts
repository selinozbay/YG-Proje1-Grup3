import { describe, it, expect, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import { createPinia, setActivePinia, type Pinia } from 'pinia'
import CoursesView from '../CoursesView.vue'
import { useCatalogStore } from '@/stores/catalog'
import { useProgressStore } from '@/stores/progress'

let pinia: Pinia

beforeEach(async () => {
  localStorage.clear()
  pinia = createPinia()
  setActivePinia(pinia)
  await useProgressStore().load('ogrenci-1')
})

const mountPage = () =>
  mount(CoursesView, { global: { plugins: [pinia], stubs: { RouterLink: RouterLinkStub } } })

const cards = (wrapper: ReturnType<typeof mountPage>) =>
  wrapper.findAll('[data-test="course-card"]')
const cardOf = (wrapper: ReturnType<typeof mountPage>, code: string) =>
  cards(wrapper).find((card) => card.find('[data-test="course-code"]').text() === code)!

describe('Derslerim sayfası', () => {
  it('her ders için kart gösterir, "Geliştirilecek" kutusu yok (#14)', () => {
    const wrapper = mountPage()
    const catalog = useCatalogStore()

    expect(cards(wrapper)).toHaveLength(catalog.courses.length)
    for (const course of catalog.courses) expect(wrapper.text()).toContain(course.title)
    expect(wrapper.find('[data-test="course-count"]').text()).toBe(`${catalog.courses.length} ders`)
    expect(wrapper.text()).not.toContain('Geliştirilecek')
  })

  it('grafikte her dersin durum dağılımı satırı var (#18)', () => {
    const wrapper = mountPage()
    const rows = wrapper.findAll('[data-test="course-chart-row"]')
    expect(rows).toHaveLength(3)
    expect(rows[0]!.find('[role="img"]').attributes('aria-label')).toBe(
      'Yazılım Geliştirme görev durumu: 0 tamamlandı, 0 devam ediyor, 8 yapılacak',
    )
  })

  it('bir görev tamamlanınca kart ve grafik kendiliğinden güncellenir (#17)', async () => {
    const wrapper = mountPage()
    const progress = useProgressStore()
    const vtTask = progress.tasks.find((t) => t.courseId === 'veri-tabani')!

    await progress.setStatus(vtTask.id, 'done')
    await flushPromises()

    const card = cardOf(wrapper, 'VT')
    expect(card.find('[data-test="course-summary"]').text()).toBe('1 / 8 görev tamamlandı')
    expect(card.find('[data-test="course-status"]').text()).toBe('Devam ediyor')
    expect(wrapper.find('[data-test="course-chart"]').text()).toContain('1 / 8 · %13')
  })

  it('duruma göre filtreler ve düğmelerde ders sayısını gösterir (#19)', async () => {
    const progress = useProgressStore()
    await progress.setStatus(
      progress.tasks.find((t) => t.courseId === 'web-programlama')!.id,
      'in-progress',
    )
    const wrapper = mountPage()

    const button = (name: RegExp) => wrapper.findAll('button').find((b) => name.test(b.text()))!
    expect(button(/^Devam ediyor/).text()).toBe('Devam ediyor 1')
    expect(button(/^Başlanmadı/).text()).toBe('Başlanmadı 2')

    await button(/^Devam ediyor/).trigger('click')
    expect(button(/^Devam ediyor/).attributes('aria-pressed')).toBe('true')
    expect(cards(wrapper).map((c) => c.find('[data-test="course-code"]').text())).toEqual(['WP'])
    expect(wrapper.find('[data-test="course-count"]').text()).toBe('1 / 3 ders')
  })

  it('arama yazarken listeyi daraltır; sonuç yoksa mesaj ve temizleme düğmesi çıkar (#19)', async () => {
    const wrapper = mountPage()
    const input = wrapper.find('input[type="search"]')

    await input.setValue('veri tabani')
    expect(cards(wrapper).map((c) => c.find('[data-test="course-code"]').text())).toEqual(['VT'])

    await input.setValue('kimya')
    expect(cards(wrapper)).toHaveLength(0)
    expect(wrapper.find('[data-test="empty-state"]').text()).toContain(
      'Aramana uyan ders bulunamadı',
    )

    await wrapper.find('[data-test="empty-state"] button').trigger('click')
    expect(cards(wrapper)).toHaveLength(3)
    expect((input.element as HTMLInputElement).value).toBe('')
  })
})
