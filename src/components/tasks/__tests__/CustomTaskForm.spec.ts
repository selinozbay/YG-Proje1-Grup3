import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CustomTaskForm from '../CustomTaskForm.vue'

const courses = [
  { id: 'yazilim-gelistirme', title: 'Yazılım Geliştirme' },
  { id: 'veri-tabani', title: 'Veri Tabanı Yönetim Sistemleri' },
]

const mountForm = (props = {}) =>
  mount(CustomTaskForm, { props: { courses, mode: 'create' as const, ...props } })

describe('CustomTaskForm (#23)', () => {
  it('başlık boşken kaydetmez, alanın altında Türkçe uyarı gösterir', async () => {
    const wrapper = mountForm()
    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('submit')).toBeUndefined()
    const title = wrapper.find('input[type="text"]')
    expect(title.attributes('aria-invalid')).toBe('true')
    const errorId = title.attributes('aria-describedby')!
    expect(wrapper.find(`[id="${errorId}"]`).text()).toBe('Görev başlığı boş olamaz.')
  })

  it('çok uzun başlıkta uyarı verir', async () => {
    const wrapper = mountForm()
    await wrapper.find('input[type="text"]').setValue('a'.repeat(101))
    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(wrapper.text()).toContain('Başlık en fazla 100 karakter olabilir.')
  })

  it('geçerli girişte boşlukları kırpıp bilgileri gönderir', async () => {
    const wrapper = mountForm()
    await wrapper.find('input[type="text"]').setValue('  Sunuma hazırlan ')
    await wrapper.find('textarea').setValue('Slaytları bitir')
    await wrapper.find('select').setValue('veri-tabani')
    await wrapper.find('input[type="date"]').setValue('2026-11-10')
    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('submit')).toEqual([
      [
        {
          title: 'Sunuma hazırlan',
          description: 'Slaytları bitir',
          courseId: 'veri-tabani',
          dueDate: '2026-11-10',
        },
      ],
    ])
  })

  it('düzenlemede mevcut bilgilerle açılır', () => {
    const wrapper = mountForm({
      mode: 'edit',
      initial: { title: 'Eski', description: 'Açıklama', courseId: 'veri-tabani', dueDate: '' },
    })
    expect(wrapper.find('h2').text()).toBe('Görevi düzenle')
    expect((wrapper.find('input[type="text"]').element as HTMLInputElement).value).toBe('Eski')
    expect((wrapper.find('select').element as HTMLSelectElement).value).toBe('veri-tabani')
    expect(wrapper.find('button[type="submit"]').text()).toBe('Değişiklikleri kaydet')
  })

  it('Vazgeç düğmesi formu kapatma isteği gönderir; kayıt hatası gösterilir', async () => {
    const wrapper = mountForm({ error: 'Görev kaydedilemedi.' })
    expect(wrapper.find('[role="alert"]').text()).toBe('Görev kaydedilemedi.')

    await wrapper
      .findAll('button')
      .find((b) => b.text() === 'Vazgeç')!
      .trigger('click')
    expect(wrapper.emitted('cancel')).toHaveLength(1)
  })
})
