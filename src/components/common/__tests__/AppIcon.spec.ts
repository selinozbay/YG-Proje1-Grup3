import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppIcon from '../AppIcon.vue'

describe('AppIcon', () => {
  it('doğru svg ve path elemanlarını render eder', () => {
    const wrapper = mount(AppIcon, {
      props: {
        name: 'home',
      },
    })

    const svg = wrapper.find('svg')
    expect(svg.exists()).toBe(true)
    expect(svg.attributes('aria-hidden')).toBe('true')
    expect(wrapper.findAll('path').length).toBeGreaterThan(0)
  })

  it('farklı ikon isimleri ile hata vermeden render edilir', () => {
    const icons = ['logo', 'tasks', 'book', 'user', 'sun', 'moon'] as const
    for (const name of icons) {
      const wrapper = mount(AppIcon, {
        props: { name },
      })
      expect(wrapper.find('svg').exists()).toBe(true)
    }
  })
})
