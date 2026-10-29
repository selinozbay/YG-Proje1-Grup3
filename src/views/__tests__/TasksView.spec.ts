import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia, type Pinia } from 'pinia'
import TasksView from '../TasksView.vue'
import { useCatalogStore } from '@/stores/catalog'

let pinia: Pinia

beforeEach(() => {
  pinia = createPinia()
  setActivePinia(pinia)
})

describe('Görevlerim sayfası', () => {
  it('bütün derslerin görevlerini tek listede kart olarak gösterir', () => {
    const wrapper = mount(TasksView, { global: { plugins: [pinia] } })
    const catalog = useCatalogStore()

    expect(wrapper.findAll('article')).toHaveLength(catalog.tasks.length)
    for (const course of catalog.courses) {
      expect(wrapper.text()).toContain(course.title)
    }
  })
})
