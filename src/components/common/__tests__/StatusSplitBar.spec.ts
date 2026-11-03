import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatusSplitBar from '../StatusSplitBar.vue'
import StatusLegend from '../StatusLegend.vue'

const counts = { done: 3, inProgress: 1, todo: 4, total: 8, percent: 38 }

describe('StatusSplitBar', () => {
  it('her durumu sayısıyla orantılı bir parça olarak çizer', () => {
    const wrapper = mount(StatusSplitBar, { props: { counts, label: 'Veri Tabanı görev durumu' } })

    const grow = (key: string) =>
      (wrapper.find(`[data-test="segment-${key}"]`).element as HTMLElement).style.flexGrow
    expect(grow('done')).toBe('3')
    expect(grow('inProgress')).toBe('1')
    expect(grow('todo')).toBe('4')
    expect(wrapper.find('[data-test="segment-done"]').attributes('title')).toBe(
      'Tamamlandı: 3 (%38)',
    )
  })

  it('ekran okuyucu için bütün sayıları adıyla birlikte okutur', () => {
    const wrapper = mount(StatusSplitBar, { props: { counts, label: 'Veri Tabanı görev durumu' } })
    const bar = wrapper.find('[role="img"]')
    expect(bar.attributes('aria-label')).toBe(
      'Veri Tabanı görev durumu: 3 tamamlandı, 1 devam ediyor, 4 yapılacak',
    )
  })

  it('sıfır olan durumu çizmez; hiç görev yoksa yalnızca boş çubuk görünür', () => {
    const some = mount(StatusSplitBar, {
      props: { counts: { done: 2, inProgress: 0, todo: 0, total: 2, percent: 100 }, label: 'x' },
    })
    expect(some.find('[data-test="segment-inProgress"]').exists()).toBe(false)
    expect(some.findAll('span')).toHaveLength(1)

    const empty = mount(StatusSplitBar, {
      props: { counts: { done: 0, inProgress: 0, todo: 0, total: 0, percent: 0 }, label: 'x' },
    })
    expect(empty.findAll('span')).toHaveLength(0)
    expect(empty.find('[role="img"]').classes()).toContain('bg-slate-200')
  })
})

describe('StatusLegend', () => {
  it('sayı verilmezse yalnızca durum adlarını, verilirse sayılarını da yazar', () => {
    expect(mount(StatusLegend).text()).toBe('TamamlandıDevam ediyorYapılacak')

    const withCounts = mount(StatusLegend, { props: { counts } })
    expect(withCounts.find('[data-test="legend-done"]').text()).toBe('3')
    expect(withCounts.find('[data-test="legend-todo"]').text()).toBe('4')
  })
})
