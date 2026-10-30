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
})
