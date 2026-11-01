import { describe, it, expect } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import CourseCard from '../CourseCard.vue'
import { countStatuses, getCourseStatus } from '@/composables/useCourseProgress'
import type { TaskWithStatus } from '@/types/task'

const course = {
  id: 'veri-tabani',
  code: 'VT',
  title: 'Veri Tabanı Yönetim Sistemleri',
  instructor: 'Öğretim Elemanı',
  description: 'İlişkisel veri modeli, SQL sorguları ve veri bütünlüğü.',
}

const task = (overrides: Partial<TaskWithStatus>): TaskWithStatus => ({
  id: 'vt-w1-t1',
  courseId: 'veri-tabani',
  weekNo: 1,
  title: 'ER diyagramı çiz',
  description: '',
  dueDate: '2026-10-19',
  tags: [],
  status: 'done',
  ...overrides,
})

const tasks = [
  task({}),
  task({
    id: 'vt-w2-t1',
    weekNo: 2,
    title: 'Tabloları normalize et',
    dueDate: '2026-10-26',
    status: 'in-progress',
  }),
  task({
    id: 'vt-w3-t1',
    weekNo: 3,
    title: 'SQL sorguları yaz',
    dueDate: '2026-11-02',
    status: 'todo',
  }),
  task({
    id: 'custom-1',
    weekNo: 0,
    title: 'Kendi notlarım',
    dueDate: undefined,
    status: 'todo',
    custom: true,
  }),
]

const mountCard = (list = tasks, props: Record<string, unknown> = {}) => {
  const counts = countStatuses(list)
  return mount(CourseCard, {
    props: { item: { course, tasks: list, counts, status: getCourseStatus(counts) }, ...props },
    global: { stubs: { RouterLink: RouterLinkStub } },
  })
}

describe('CourseCard', () => {
  it('ders kodunu, adını, öğretim elemanını ve açıklamasını gösterir (#14)', () => {
    const wrapper = mountCard()
    expect(wrapper.find('[data-test="course-code"]').text()).toBe('VT')
    expect(wrapper.find('h2').text()).toBe('Veri Tabanı Yönetim Sistemleri')
    expect(wrapper.find('[data-test="course-instructor"]').text()).toBe('Öğretim Elemanı')
    expect(wrapper.text()).toContain('İlişkisel veri modeli')
  })

  it('başlık ders detayına götürür', () => {
    expect(mountCard().findComponent(RouterLinkStub).props('to')).toBe('/derslerim/veri-tabani')
  })

  it('ilerlemeyi, ders durumunu ve sıradaki görevi gösterir (#14)', () => {
    const wrapper = mountCard()
    expect(wrapper.find('[data-test="course-summary"]').text()).toBe('1 / 4 görev tamamlandı')
    expect(wrapper.find('[role="progressbar"]').attributes('aria-valuenow')).toBe('25')
    expect(wrapper.find('[data-test="course-status"]').text()).toBe('Devam ediyor')
    // Bitmemiş görevlerden son tarihi en yakın olanı.
    expect(wrapper.find('[data-test="next-task"]').text()).toBe(
      'Sıradaki görev: Tabloları normalize et · 26 Ekim',
    )
  })

  it('dersin görevlerini durumlarıyla açılır listede gösterir (#17)', () => {
    const wrapper = mountCard()
    const details = wrapper.find('[data-test="course-tasks"]')
    expect(details.element.tagName).toBe('DETAILS')
    expect(details.find('summary').text()).toContain('(4)')

    // Her satır: [hafta · başlık, durum rozeti]
    const rows = details.findAll('li').map((li) => {
      const [text, badge] = li.findAll(':scope > span')
      return [text!.text().replace(/\s+/g, ' '), badge!.text()]
    })
    expect(rows).toEqual([
      ['1. hafta · ER diyagramı çiz', 'Tamamlandı'],
      ['2. hafta · Tabloları normalize et', 'Devam ediyor'],
      ['3. hafta · SQL sorguları yaz', 'Yapılacak'],
      ['Kendi görevim · Kendi notlarım', 'Yapılacak'],
    ])
  })

  it('bütün görevler bitince durum "Tamamlandı" olur, sıradaki görev satırı kalkar', () => {
    const wrapper = mountCard(tasks.map((t) => ({ ...t, status: 'done' as const })))
    expect(wrapper.find('[data-test="course-status"]').text()).toBe('Tamamlandı')
    expect(wrapper.find('[data-test="next-task"]').exists()).toBe(false)
  })

  it('başlık seviyesi ayarlanabilir', () => {
    expect(mountCard(tasks, { headingLevel: 3 }).find('h3').exists()).toBe(true)
  })
})
