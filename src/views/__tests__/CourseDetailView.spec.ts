import { describe, it, expect, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import { createPinia, setActivePinia, type Pinia } from 'pinia'
import CourseDetailView from '../CourseDetailView.vue'
import { useCatalogStore } from '@/stores/catalog'
import { useProgressStore } from '@/stores/progress'

const COURSE_ID = 'yazilim-gelistirme'
let pinia: Pinia

beforeEach(async () => {
  localStorage.clear()
  pinia = createPinia()
  setActivePinia(pinia)
  await useProgressStore().load('ogrenci-1')
})

const mountCourse = (courseId = COURSE_ID) =>
  mount(CourseDetailView, {
    props: { courseId },
    global: { plugins: [pinia], stubs: { RouterLink: RouterLinkStub } },
  })

const weeks = () => useCatalogStore().getWeeks(COURSE_ID)
const weekTasks = (weekNo: number) =>
  useCatalogStore().tasks.filter((task) => task.courseId === COURSE_ID && task.weekNo === weekNo)

async function completeWeek(weekNo: number) {
  for (const task of weekTasks(weekNo)) await useProgressStore().setStatus(task.id, 'done')
  await flushPromises()
}

describe('Ders detayı', () => {
  it('her hafta için hafta no, başlık ve açıklama içeren bir kart gösterir (#40)', () => {
    const cards = mountCourse().findAll('[data-test="week-card"]')

    expect(cards).toHaveLength(weeks().length)
    weeks().forEach((week, i) => {
      expect(cards[i]!.text()).toContain(`${week.weekNo}. Hafta`)
      expect(cards[i]!.find('h3').text()).toBe(week.title)
      expect(cards[i]!.text()).toContain(week.description)
    })
  })

  it('karta tıklayınca hafta detayı açılır (#40)', () => {
    const links = mountCourse()
      .findAll('[data-test="week-card"]')
      .map((card) => card.findComponent(RouterLinkStub).props('to'))

    expect(links).toEqual(weeks().map((week) => `/derslerim/${COURSE_ID}/hafta/${week.weekNo}`))
  })

  it('her kartta o haftanın ilerlemesi görünür ve görev tamamlanınca güncellenir (#41)', async () => {
    const wrapper = mountCourse()
    const firstCard = () => wrapper.findAll('[data-test="week-card"]')[0]!
    const total = weekTasks(1).length

    expect(firstCard().text()).toContain(`0 / ${total} görev`)
    expect(firstCard().find('[role="progressbar"]').attributes('aria-valuenow')).toBe('0')

    await useProgressStore().setStatus(weekTasks(1)[0]!.id, 'done')
    await flushPromises()

    expect(firstCard().text()).toContain(`1 / ${total} görev`)
    expect(firstCard().find('[role="progressbar"]').attributes('aria-valuenow')).toBe(
      String(Math.round((1 / total) * 100)),
    )
  })

  it('zaman çizelgesi haftaları sırayla gösterir ve şu anki haftayı işaretler (#42)', async () => {
    const wrapper = mountCourse()
    const steps = () => wrapper.findAll('[data-test="timeline-step"]')
    const currentStep = () => wrapper.find('[data-test="timeline-step"] [aria-current="step"]')

    expect(steps().map((step) => step.text())).toEqual(
      weeks().map((week) => expect.stringContaining(`${week.weekNo}. Hafta`)),
    )
    expect(currentStep().text()).toContain('1. Hafta')

    await completeWeek(1)

    expect(currentStep().text()).toContain('2. Hafta')
    expect(steps()[0]!.text()).toContain('Tamamlandı')
    expect(wrapper.findAll('[data-test="week-card"]')[1]!.text()).toContain('Şu anki hafta')
  })

  it('üstteki geri bağlantısı Derslerim sayfasına döner', () => {
    const back = mountCourse().find('[data-test="back-link"]')
    expect(back.text()).toBe('Derslerim')
    expect(back.findComponent(RouterLinkStub).props('to')).toBe('/derslerim')
  })

  it('"Geliştirilecek" kutusu kaldırıldı (#39)', () => {
    expect(mountCourse().text()).not.toContain('Geliştirilecek')
  })

  it('olmayan derste "Ders bulunamadı" gösterir', () => {
    const wrapper = mountCourse('yok-ders')
    expect(wrapper.find('h1').text()).toBe('Ders bulunamadı')
    expect(wrapper.find('[data-test="week-card"]').exists()).toBe(false)
  })
})
