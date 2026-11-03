import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskStatusSelect from '../TaskStatusSelect.vue'

describe('TaskStatusSelect', () => {
  it('üç durumu Türkçe gösterir ve mevcut durumu seçili tutar', () => {
    const wrapper = mount(TaskStatusSelect, {
      props: { modelValue: 'in-progress', label: 'Durum: Görev' },
    })
    const options = wrapper.findAll('option').map((option) => option.text())
    expect(options).toEqual(['Yapılacak', 'Devam ediyor', 'Tamamlandı'])
    expect((wrapper.find('select').element as HTMLSelectElement).value).toBe('in-progress')
    expect(wrapper.find('label > span[aria-hidden="true"]').text()).toBe('Devam ediyor')
  })

  it('ekran okuyucu için etiket taşır', () => {
    const wrapper = mount(TaskStatusSelect, {
      props: { modelValue: 'todo', label: 'Durum: Görev' },
    })
    expect(wrapper.find('label').text()).toContain('Durum: Görev')
  })

  it('seçim değişince yeni durumu bildirir', async () => {
    const wrapper = mount(TaskStatusSelect, {
      props: { modelValue: 'todo', label: 'Durum: Görev' },
    })
    await wrapper.find('select').setValue('done')
    expect(wrapper.emitted('update:modelValue')).toEqual([['done']])
  })

  it('açılan liste rozet rengini almaz, tema renginde açılır (#78)', () => {
    const wrapper = mount(TaskStatusSelect, {
      props: { modelValue: 'done', label: 'Durum: Görev' },
    })
    // Rozet rengi etikette; select ve seçenekleri tema renginde.
    expect(wrapper.find('label').classes()).toContain('bg-emerald-100')
    const select = wrapper.find('select')
    expect(select.classes()).not.toContain('bg-emerald-100')
    expect(select.classes()).toEqual(expect.arrayContaining(['bg-white', 'dark:bg-slate-900']))
    for (const option of wrapper.findAll('option')) {
      expect(option.classes()).toEqual(
        expect.arrayContaining([
          'bg-white',
          'text-slate-900',
          'dark:bg-slate-900',
          'dark:text-slate-100',
        ]),
      )
    }
  })
})
