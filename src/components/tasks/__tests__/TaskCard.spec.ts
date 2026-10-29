import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskCard from '../TaskCard.vue'
import type { TaskWithStatus } from '@/types/task'

const task: TaskWithStatus = {
  id: 'yg-w1-t1',
  courseId: 'yazilim-gelistirme',
  weekNo: 1,
  title: 'Kullanıcı hikâyelerini yaz',
  description: 'En az beş kullanıcı hikâyesi hazırlayın.',
  dueDate: '2026-10-21',
  tags: ['analiz', 'planlama'],
  status: 'todo',
}

const mountCard = (overrides: Partial<TaskWithStatus> = {}) =>
  mount(TaskCard, { props: { task: { ...task, ...overrides }, courseTitle: 'Yazılım Geliştirme' } })

describe('TaskCard', () => {
  it('başlığı, dersi, haftayı, açıklamayı ve etiketleri gösterir', () => {
    const wrapper = mountCard()
    expect(wrapper.find('h2').text()).toBe('Kullanıcı hikâyelerini yaz')
    expect(wrapper.text()).toContain('Yazılım Geliştirme · 1. hafta')
    expect(wrapper.text()).toContain('En az beş kullanıcı hikâyesi hazırlayın.')
    expect(wrapper.findAll('li').map((li) => li.text())).toEqual(['#analiz', '#planlama'])
  })

  it('son tarihi Türkçe yazar', () => {
    const time = mountCard().find('[data-test="due-date"]')
    expect(time.attributes('datetime')).toBe('2026-10-21')
    expect(time.text()).toBe('Son tarih: 21 Ekim 2026')
  })

  it('son tarihi olmayan görevde tarih satırı görünmez', () => {
    const wrapper = mountCard({ dueDate: undefined })
    expect(wrapper.find('[data-test="due-date"]').exists()).toBe(false)
  })

  it.each([
    ['todo', 'Yapılacak'],
    ['in-progress', 'Devam ediyor'],
    ['done', 'Tamamlandı'],
  ] as const)('"%s" durumunu "%s" olarak gösterir', (status, label) => {
    expect(mountCard({ status }).find('[data-test="status"]').text()).toBe(label)
  })
})
