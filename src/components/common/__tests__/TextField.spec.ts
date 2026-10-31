import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TextField from '../TextField.vue'

const field = (props: Record<string, unknown> = {}) =>
  mount(TextField, { props: { label: 'Şifre', modelValue: '', ...props } })

describe('TextField (#3)', () => {
  it('etiketi kutuya bağlar ve yazılanı v-model ile iletir', async () => {
    const wrapper = field({ label: 'E-posta', type: 'email' })
    const input = wrapper.find('input')
    expect(wrapper.find('label').attributes('for')).toBe(input.attributes('id'))

    await input.setValue('ogrenci@example.com')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['ogrenci@example.com'])
  })

  it('şifre alanında göster/gizle düğmesi kutunun türünü değiştirir', async () => {
    const wrapper = field({ type: 'password' })
    const toggle = wrapper.find('button')
    expect(toggle.attributes('type')).toBe('button') // formu göndermemeli
    expect(wrapper.find('input').attributes('type')).toBe('password')

    await toggle.trigger('click')
    expect(wrapper.find('input').attributes('type')).toBe('text')
    expect(toggle.attributes('aria-label')).toBe('Şifreyi gizle')
    expect(toggle.attributes('aria-pressed')).toBe('true')
  })

  it('şifre dışındaki alanlarda göster/gizle düğmesi yoktur', () => {
    expect(field({ type: 'email' }).find('button').exists()).toBe(false)
  })

  it('hata ve ipucu yazısını ekran okuyucuya bağlar', () => {
    const wrapper = field({ error: 'Şifre çok kısa.', hint: 'En az 6 karakter.' })
    const input = wrapper.find('input')
    expect(input.attributes('aria-invalid')).toBe('true')

    const describedBy = input.attributes('aria-describedby')?.split(' ') ?? []
    const texts = describedBy.map((id) => wrapper.find(`[id="${id}"]`).text())
    expect(texts).toEqual(['Şifre çok kısa.', 'En az 6 karakter.'])
  })
})
