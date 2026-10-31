import { describe, it, expect, beforeEach, vi } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import { createPinia, setActivePinia, type Pinia } from 'pinia'
import WeekDetailView from '../WeekDetailView.vue'
import { userDataService } from '@/services/userData'
import { useCatalogStore } from '@/stores/catalog'
import { useProgressStore } from '@/stores/progress'

const COURSE_ID = 'yazilim-gelistirme'
let pinia: Pinia

beforeEach(async () => {
  localStorage.clear()
  vi.restoreAllMocks()
  pinia = createPinia()
  setActivePinia(pinia)
  await useProgressStore().load('ogrenci-1')
})

const mountWeek = (weekNo: number, courseId = COURSE_ID) =>
  mount(WeekDetailView, {
    props: { courseId, weekNo },
    global: { plugins: [pinia], stubs: { RouterLink: RouterLinkStub } },
  })

const weekTasks = (weekNo: number) =>
  useCatalogStore().tasks.filter((task) => task.courseId === COURSE_ID && task.weekNo === weekNo)

describe('Hafta detayı', () => {
  it('öğrenme hedeflerini kart içinde listeler (#44)', () => {
    const week = useCatalogStore().getWeek(COURSE_ID, 1)!
    const goals = mountWeek(1).find('[data-test="learning-goals"]')
    expect(goals.find('h2').text()).toBe('Öğrenme hedefleri')
    expect(goals.findAll('li').map((li) => li.text())).toEqual(week.learningGoals)
  })

  it('yalnızca o haftanın görevlerini düzenlenebilir kart olarak gösterir (#45)', () => {
    const wrapper = mountWeek(2)
    const cards = wrapper.findAll('article')
    expect(cards.map((card) => card.find('h3').text())).toEqual(
      weekTasks(2).map((task) => task.title),
    )
    expect(cards.every((card) => card.find('[data-test="status-select"]').exists())).toBe(true)
  })

  it('kartta durum değişince görev kaydedilir ve haftanın ilerlemesi güncellenir (#45, #46)', async () => {
    const wrapper = mountWeek(1)
    const total = weekTasks(1).length
    const progressbar = () => wrapper.find('[role="progressbar"]')

    expect(wrapper.find('[data-test="week-summary"]').text()).toBe(`0 / ${total} görev tamamlandı`)
    expect(progressbar().attributes('aria-valuenow')).toBe('0')

    await wrapper.findAll('[data-test="status-select"]')[0]!.setValue('done')
    await flushPromises()

    expect(useProgressStore().statusOf(weekTasks(1)[0]!.id)).toBe('done')
    expect(wrapper.find('[data-test="week-summary"]').text()).toBe(`1 / ${total} görev tamamlandı`)
    expect(progressbar().attributes('aria-valuenow')).toBe(String(Math.round((1 / total) * 100)))
  })

  it('kayıt başarısız olursa hata mesajı gösterir', async () => {
    vi.spyOn(userDataService, 'setTaskStatus').mockRejectedValueOnce(new Error('bağlantı yok'))
    const wrapper = mountWeek(1)

    await wrapper.findAll('[data-test="status-select"]')[0]!.setValue('done')
    await flushPromises()

    expect(wrapper.find('[role="alert"]').text()).toContain('kaydedilemedi')
    expect(wrapper.find('[data-test="week-summary"]').text()).toMatch(/^0 \//)
  })

  it('önceki ve sonraki haftaya bağlantı verir; ilk ve son haftada yalnızca biri vardır (#47)', () => {
    const weeks = useCatalogStore().getWeeks(COURSE_ID)
    const last = weeks[weeks.length - 1]!.weekNo
    const link = (wrapper: ReturnType<typeof mountWeek>, name: string) =>
      wrapper.findAllComponents(RouterLinkStub).find((l) => l.attributes('data-test') === name)

    const first = mountWeek(1)
    expect(link(first, 'previous-week')).toBeUndefined()
    expect(link(first, 'next-week')!.props('to')).toBe(`/derslerim/${COURSE_ID}/hafta/2`)

    const middle = mountWeek(2)
    expect(link(middle, 'previous-week')!.props('to')).toBe(`/derslerim/${COURSE_ID}/hafta/1`)
    expect(link(middle, 'next-week')!.props('to')).toBe(`/derslerim/${COURSE_ID}/hafta/3`)
    expect(link(middle, 'next-week')!.text()).toContain(`3. Hafta · ${weeks[2]!.title}`)

    const end = mountWeek(last)
    expect(link(end, 'previous-week')!.props('to')).toBe(
      `/derslerim/${COURSE_ID}/hafta/${last - 1}`,
    )
    expect(link(end, 'next-week')).toBeUndefined()
  })

  it('olmayan bir hafta için "Hafta bulunamadı" gösterir', () => {
    expect(mountWeek(99).find('h1').text()).toBe('Hafta bulunamadı')
    expect(mountWeek(1, 'olmayan-ders').find('h1').text()).toBe('Hafta bulunamadı')
  })
})
