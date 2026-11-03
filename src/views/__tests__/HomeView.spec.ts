import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import { createPinia, setActivePinia, type Pinia } from 'pinia'
import HomeView from '../HomeView.vue'
import TermOverview from '@/components/home/TermOverview.vue'
import { userDataService } from '@/services/userData'
import { useProgressStore } from '@/stores/progress'

let pinia: Pinia

beforeEach(async () => {
  // Bugün 31 Ekim 2026 kabul edilir; dönem çizelgesi ve yaklaşan görevler tarihe bağlı.
  // Örnek verideki haftalar: 15–21 Ekim, 22–28 Ekim, 29 Ekim–4 Kasım, 5–11 Kasım.
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

const text = (wrapper: ReturnType<typeof mountPage>, test: string) =>
  wrapper.find(`[data-test="${test}"]`).text()

describe('Ana Sayfa', () => {
  it('selamlamayı, tarihi ve genel ilerlemeyi gösterir, "Geliştirilecek" kutusu yok (#9)', () => {
    const wrapper = mountPage()
    expect(wrapper.find('h1').text()).toBe('Merhaba')
    expect(wrapper.text()).toContain('31 Ekim Cumartesi')
    expect(text(wrapper, 'overall-percent')).toBe('%0')
    expect(text(wrapper, 'overall-summary')).toBe('0 / 24 görev')
    expect(wrapper.text()).not.toContain('Geliştirilecek')
  })

  it('dönem çizelgesinde haftaları, bu haftayı, gecikenleri ve geçen süreyi gösterir (#11)', () => {
    const wrapper = mountPage()
    const weeks = wrapper.findAll('[data-test="term-week"]')

    expect(weeks).toHaveLength(4)
    expect(weeks[0]!.text()).toContain('15 – 21 Ekim')
    expect(weeks[2]!.text()).toContain('29 Ekim – 4 Kasım')
    expect(weeks[2]!.attributes('aria-current')).toBe('step')
    expect(weeks[2]!.text()).toContain('Bu hafta')
    // 1. haftanın tarihli 4 görevi bitmemiş ve süresi geçmiş.
    expect(weeks[0]!.find('[data-test="week-overdue"]').text()).toBe('4 gecikti')
    expect(weeks[3]!.find('[data-test="week-overdue"]').exists()).toBe(false)
    // 15 Ekim–11 Kasım arası 28 gün; 31 Ekim dahil 17 gün geçti.
    expect(text(wrapper, 'elapsed')).toBe('%61')
  })

  it('dönem çizelgesinde her dersin her haftası o haftanın sayfasına götürür (#11)', () => {
    const wrapper = mountPage()
    const week3 = wrapper.findAll('[data-test="term-week"]')[2]!
    const cells = week3.findAllComponents(RouterLinkStub)

    // Satırlar katalog sırasıyla dersler; hücrenin adında ders, hafta ve ilerleme yazar.
    expect(cells).toHaveLength(3)
    expect(cells[0]!.props('to')).toBe('/derslerim/yazilim-gelistirme/hafta/3')
    expect(cells[0]!.attributes('aria-label')).toBe(
      'Yazılım Geliştirme 3. hafta: 0 / 2 görev tamamlandı',
    )
    // Her görev bir durum simgesiyle çizilir: 3. haftada her derste 2 görev var.
    expect(cells[0]!.findAll('svg[data-status]')).toHaveLength(2)
  })

  it('yaklaşan görevleri güne göre gruplar, geçmişleri ayrıca sayar (#13)', () => {
    const wrapper = mountPage()
    const rows = wrapper.findAll('[data-test="upcoming-task"]')

    expect(rows).toHaveLength(6)
    const days = wrapper.findAll('[data-test="upcoming-tasks"] h3 time')
    const dates = days.map((day) => day.attributes('datetime')!)
    expect(dates).toEqual([...dates].sort())
    expect(days[0]!.text()).toBe('2 Kasım Pazartesi')
    expect(wrapper.find('[data-test="days-left"]').text()).toBe('2 gün kaldı')
    expect(rows[0]!.text()).toContain('Veri Tabanı Yönetim Sistemleri, 3. hafta')
    // 1. ve 2. haftaların tarihli 7 görevi 31 Ekim'de geçmiş.
    expect(text(wrapper, 'overdue')).toContain('7 görevin son tarihi geçti')
  })

  it('yaklaşan görev buradan tamamlanınca listeden çıkar, ilerleme ve hafta güncellenir (#13)', async () => {
    const wrapper = mountPage()
    const first = wrapper.find('[data-test="upcoming-task"]')
    const title = first.find('p').text()

    await first.find('[data-test="status-select"]').setValue('done')
    await flushPromises()

    expect(text(wrapper, 'overall-summary')).toBe('1 / 24 görev')
    expect(text(wrapper, 'overall-percent')).toBe('%4')
    expect(wrapper.findAll('[data-test="term-week"]')[2]!.text()).toContain('1 / 6 görev')
    const titles = wrapper.findAll('[data-test="upcoming-task"]').map((row) => row.find('p').text())
    expect(titles).not.toContain(title)
  })

  it('kayıt başarısız olursa durum geri gelir ve hata mesajı görünür', async () => {
    vi.spyOn(userDataService, 'setTaskStatus').mockRejectedValueOnce(new Error('bağlantı yok'))
    const wrapper = mountPage()

    await wrapper.find('[data-test="upcoming-task"] [data-test="status-select"]').setValue('done')
    await flushPromises()

    expect(text(wrapper, 'overall-summary')).toBe('0 / 24 görev')
    expect(wrapper.find('[role="alert"]').text()).toContain('kaydedilemedi')
  })

  it('derslerin ilerlemesini ve bu haftanın konusunu hedefleriyle gösterir (#12, #48)', async () => {
    const progress = useProgressStore()
    await progress.setStatus(progress.tasks.find((t) => t.courseId === 'veri-tabani')!.id, 'done')
    const wrapper = mountPage()

    const courses = wrapper.findAll('[data-test="home-course"]')
    expect(courses).toHaveLength(3)
    const vt = courses.find((row) => row.text().includes('Veri Tabanı'))!
    expect(vt.find('[data-test="course-summary"]').text()).toBe('1 / 8')

    const weeks = wrapper.findAll('[data-test="this-week-item"]')
    expect(weeks).toHaveLength(3)
    expect(weeks[0]!.text()).toContain('3. hafta:')
    expect(weeks[0]!.findAll('li').length).toBeGreaterThan(0)
    const link = weeks[0]!.findComponent(RouterLinkStub)
    expect(link.props('to')).toBe('/derslerim/yazilim-gelistirme/hafta/3')
  })
})

describe('Dönem çizelgesi', () => {
  it('hiç görev yokken %0 gösterir, hata vermez (P1-12)', () => {
    const wrapper = mount(TermOverview, {
      props: {
        weeks: [],
        elapsedPercent: 0,
        counts: { done: 0, inProgress: 0, todo: 0, total: 0, percent: 0 },
      },
    })
    expect(wrapper.find('[data-test="overall-percent"]').text()).toBe('%0')
    expect(wrapper.find('[data-test="overall-summary"]').text()).toBe('0 / 0 görev')
    expect(wrapper.findAll('[data-test="term-week"]')).toHaveLength(0)
  })
})
