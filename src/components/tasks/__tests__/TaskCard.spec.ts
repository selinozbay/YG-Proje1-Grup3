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

  it('kendi görevinde "Kendi görevim" etiketi gösterir, hafta yazmaz', () => {
    const wrapper = mountCard({ custom: true, weekNo: 0, tags: [] })
    expect(wrapper.find('[data-test="custom-badge"]').text()).toBe('Kendi görevim')
    expect(wrapper.text()).toContain('Yazılım Geliştirme')
    expect(wrapper.text()).not.toContain('hafta')
  })

  it('ders görevinde Düzenle / Sil yoktur; kendi görevinde düzenlenebilir modda vardır', () => {
    const editable = (custom: boolean) =>
      mount(TaskCard, {
        props: { task: { ...task, custom }, courseTitle: 'Yazılım Geliştirme', editable: true },
      })
    expect(editable(false).find('[data-test="edit-task"]').exists()).toBe(false)
    expect(editable(true).find('[data-test="edit-task"]').exists()).toBe(true)
    expect(mountCard({ custom: true }).find('[data-test="edit-task"]').exists()).toBe(false)
  })

  it('Sil önce onay ister; Vazgeç silmez, Evet, sil silme isteği gönderir', async () => {
    const wrapper = mount(TaskCard, {
      props: { task: { ...task, custom: true }, courseTitle: '', editable: true },
    })

    await wrapper.find('[data-test="edit-task"]').trigger('click')
    expect(wrapper.emitted('edit')).toHaveLength(1)

    await wrapper.find('[data-test="delete-task"]').trigger('click')
    expect(wrapper.text()).toContain('Bu görev silinsin mi?')
    await wrapper.find('[data-test="cancel-delete"]').trigger('click')
    expect(wrapper.emitted('delete')).toBeUndefined()

    await wrapper.find('[data-test="delete-task"]').trigger('click')
    await wrapper.find('[data-test="confirm-delete"]').trigger('click')
    expect(wrapper.emitted('delete')).toHaveLength(1)
  })

  it('istenirse başlığı h3 olarak verir', () => {
    const wrapper = mount(TaskCard, {
      props: { task, courseTitle: 'Yazılım Geliştirme', headingLevel: 3 },
    })
    expect(wrapper.find('h3').text()).toBe('Kullanıcı hikâyelerini yaz')
    expect(wrapper.find('h2').exists()).toBe(false)
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

  it('düzenlenebilir kartta rozet yerine durum seçici gösterir ve değişikliği bildirir', async () => {
    const wrapper = mount(TaskCard, {
      props: {
        task: { ...task, status: 'in-progress' },
        courseTitle: 'Yazılım Geliştirme',
        editable: true,
      },
    })
    expect(wrapper.find('[data-test="status"]').exists()).toBe(false)

    const select = wrapper.find('[data-test="status-select"]')
    expect((select.element as HTMLSelectElement).value).toBe('in-progress')

    await select.setValue('done')
    expect(wrapper.emitted('status-change')).toEqual([['done']])
  })
})
