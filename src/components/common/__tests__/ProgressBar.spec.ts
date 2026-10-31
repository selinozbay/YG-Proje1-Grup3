import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProgressBar from '../ProgressBar.vue'

const bar = (value: number, showValue = true) =>
  mount(ProgressBar, { props: { value, label: 'İlerleme', showValue } })

describe('ProgressBar', () => {
  it('yüzdeyi yazar, çubuğun genişliğini ve ekran okuyucu değerini ayarlar', () => {
    const wrapper = bar(50)
    const progressbar = wrapper.find('[role="progressbar"]')
    expect(progressbar.attributes('aria-label')).toBe('İlerleme')
    expect(progressbar.attributes('aria-valuenow')).toBe('50')
    expect(progressbar.find('div').attributes('style')).toContain('width: 50%')
    expect(wrapper.text()).toBe('%50')
  })

  it('sıfır görevde (NaN ya da 0) %0 gösterir, 0–100 dışını sınıra çeker', () => {
    expect(bar(Number.NaN).text()).toBe('%0')
    expect(bar(-10).text()).toBe('%0')
    expect(bar(140).find('[role="progressbar"]').attributes('aria-valuenow')).toBe('100')
  })

  it('istenirse yüzde yazısını gizler', () => {
    expect(bar(30, false).text()).toBe('')
  })
})
