import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import { createPinia, setActivePinia, type Pinia } from 'pinia'
import HomeView from '../HomeView.vue'
import OverallProgressCard from '@/components/home/OverallProgressCard.vue'
import { userDataService } from '@/services/userData'
import { useProgressStore } from '@/stores/progress'

let pinia: Pinia

beforeEach(async () => {
  // Bugün 31 Ekim 2026 kabul edilir; "bu hafta" ve "yaklaşan görevler" tarihe bağlı.
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date('2026-10-31T10:00:00'))
  localStorage.clear()
  pinia = createPinia()
  setActivePinia(pinia)
  await useProgressStore().load('ogrenci-1')
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

const mountPage = () =>
  mount(HomeView, { global: { plugins: [pinia], stubs: { RouterLink: RouterLinkStub } } })

describe('Ana Sayfa', () => {
  it('genel ilerlemeyi gösterir, "Geliştirilecek" kutusu yok (#9)', () => {
    const wrapper = mountPage()
    expect(wrapper.find('[data-test="overall-percent"]').text()).toBe('%0')
    expect(wrapper.find('[data-test="overall-summary"]').text()).toBe('0 / 24 görev tamamlandı')
    expect(
      wrapper.find('[data-test="overall-progress"] [role="img"]').attributes('aria-label'),
    ).toBe('Bütün görevlerin durumu: 0 tamamlandı, 0 devam ediyor, 24 yapılacak')
    expect(wrapper.text()).not.toContain('Geliştirilecek')
  })

  it('yaklaşan görevleri son tarihe göre sıralar, geçmişleri ayrıca sayar (#13)', () => {
    const wrapper = mountPage()
    const rows = wrapper.findAll('[data-test="upcoming-task"]')

    expect(rows).toHaveLength(5)
    const dates = rows.map((row) => row.find('time').attributes('datetime')!)
    expect(dates).toEqual([...dates].sort())
    expect(dates[0]).toBe('2026-11-02')
    expect(rows[0]!.find('[data-test="days-left"]').text()).toBe('2 gün kaldı')
    // 1. ve 2. haftaların 7 tarihli görevi (YG'nin 1. haftasında iki tane) 31 Ekim'de geçmiş.
    expect(wrapper.find('[data-test="overdue"]').text()).toContain('7 görevin son tarihi geçti')
  })

  it('yaklaşan görev buradan tamamlanınca listeden çıkar ve genel ilerleme artar (#13)', async () => {
    const wrapper = mountPage()
    const first = wrapper.find('[data-test="upcoming-task"]')
    const title = first.find('p').text()

    await first.find('[data-test="status-select"]').setValue('done')
    await flushPromises()

    expect(wrapper.find('[data-test="overall-summary"]').text()).toBe('1 / 24 görev tamamlandı')
    expect(wrapper.find('[data-test="overall-percent"]').text()).toBe('%4')
    expect(
      wrapper.findAll('[data-test="upcoming-task"]').map((row) => row.find('p').text()),
    ).not.toContain(title)
  })

  it('kayıt başarısız olursa durum geri gelir ve hata mesajı görünür', async () => {
    vi.spyOn(userDataService, 'setTaskStatus').mockRejectedValueOnce(new Error('bağlantı yok'))
    const wrapper = mountPage()

    await wrapper.find('[data-test="upcoming-task"] [data-test="status-select"]').setValue('done')
    await flushPromises()

    expect(wrapper.find('[data-test="overall-summary"]').text()).toBe('0 / 24 görev tamamlandı')
    expect(wrapper.find('[role="alert"]').text()).toContain('kaydedilemedi')
  })

  it('bu haftanın derslerini öğrenme hedefleri ve hafta bağlantısıyla gösterir (#48)', () => {
    const wrapper = mountPage()
    const items = wrapper.findAll('[data-test="this-week-item"]')

    expect(items).toHaveLength(3)
    expect(items[0]!.text()).toContain('YG · 3. hafta')
    expect(items[0]!.findAll('ul li').length).toBeGreaterThan(0)
    const link = items[0]!.findComponent(RouterLinkStub)
    expect(link.props('to')).toBe('/derslerim/yazilim-gelistirme/hafta/3')
  })

  it('derslerim bölümünde her ders kısa kart olarak ilerlemesiyle görünür (#12)', async () => {
    const progress = useProgressStore()
    await progress.setStatus(progress.tasks.find((t) => t.courseId === 'veri-tabani')!.id, 'done')
    const wrapper = mountPage()

    const cards = wrapper.findAll('[data-test="course-card"]')
    expect(cards).toHaveLength(3)
    expect(cards.every((card) => !card.find('[data-test="course-tasks"]').exists())).toBe(true)
    const vt = cards.find((card) => card.text().includes('Veri Tabanı'))!
    expect(vt.find('[data-test="course-summary"]').text()).toBe('1 / 8 görev tamamlandı')
  })
})

describe('Genel ilerleme kartı', () => {
  it('hiç görev yokken %0 gösterir, hata vermez (P1-12)', () => {
    const wrapper = mount(OverallProgressCard, {
      props: { counts: { done: 0, inProgress: 0, todo: 0, total: 0, percent: 0 } },
    })
    expect(wrapper.find('[data-test="overall-percent"]').text()).toBe('%0')
    expect(wrapper.find('[data-test="overall-summary"]').text()).toBe('0 / 0 görev tamamlandı')
  })
})
