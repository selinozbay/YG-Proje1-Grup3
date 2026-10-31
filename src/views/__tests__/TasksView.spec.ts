import { describe, it, expect, beforeEach, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia, type Pinia } from 'pinia'
import TasksView from '../TasksView.vue'
import { userDataService } from '@/services/userData'
import { useCatalogStore } from '@/stores/catalog'
import { useProgressStore } from '@/stores/progress'

const USER_ID = 'ogrenci-1'
let pinia: Pinia

beforeEach(async () => {
  localStorage.clear()
  vi.restoreAllMocks()
  pinia = createPinia()
  setActivePinia(pinia)
  await useProgressStore().load(USER_ID)
})

const mountPage = () => mount(TasksView, { global: { plugins: [pinia] } })
const cards = (wrapper: ReturnType<typeof mountPage>) => wrapper.findAll('article')

describe('Görevlerim sayfası', () => {
  it('bütün derslerin görevlerini tek listede kart olarak gösterir', () => {
    const wrapper = mountPage()
    const catalog = useCatalogStore()

    expect(cards(wrapper)).toHaveLength(catalog.tasks.length)
    for (const course of catalog.courses) {
      expect(wrapper.text()).toContain(course.title)
    }
  })

  it('kartta durum değişince görev kaydedilir ve özet güncellenir (#49)', async () => {
    const wrapper = mountPage()
    const progress = useProgressStore()
    const firstTask = progress.tasks[0]!

    await cards(wrapper)[0]!.find('[data-test="status-select"]').setValue('done')
    await flushPromises()

    expect(progress.statusOf(firstTask.id)).toBe('done')
    expect(wrapper.find('[data-test="summary"]').text()).toBe(
      `1 / ${progress.tasks.length} görev tamamlandı`,
    )
  })

  it('kayıt başarısız olursa eski durum geri gelir ve hata mesajı görünür (#49)', async () => {
    vi.spyOn(userDataService, 'setTaskStatus').mockRejectedValueOnce(new Error('bağlantı yok'))
    const wrapper = mountPage()
    const firstTask = useProgressStore().tasks[0]!

    await cards(wrapper)[0]!.find('[data-test="status-select"]').setValue('done')
    await flushPromises()

    expect(useProgressStore().statusOf(firstTask.id)).toBe('todo')
    expect(wrapper.find('[role="alert"]').text()).toContain('kaydedilemedi')
  })

  it('duruma göre filtreler ve düğmelerde görev sayısını gösterir (#24)', async () => {
    const progress = useProgressStore()
    await progress.setStatus(progress.tasks[0]!.id, 'done')
    const wrapper = mountPage()

    const doneButton = wrapper
      .findAll('button[aria-pressed]')
      .find((button) => button.text().startsWith('Tamamlandı'))!
    expect(doneButton.text()).toContain('1')

    await doneButton.trigger('click')
    expect(doneButton.attributes('aria-pressed')).toBe('true')
    expect(cards(wrapper)).toHaveLength(1)
  })

  it('derse ve haftaya göre filtreler; hafta seçenekleri seçilen derse göre değişir (#50)', async () => {
    const catalog = useCatalogStore()
    const wrapper = mountPage()
    const [courseSelect, weekSelect] = wrapper.findAll('select:not([data-test="status-select"])')

    await courseSelect!.setValue('veri-tabani')
    const courseTasks = catalog.tasks.filter((task) => task.courseId === 'veri-tabani')
    expect(cards(wrapper)).toHaveLength(courseTasks.length)

    const weekOptions = weekSelect!.findAll('option').map((option) => option.text())
    expect(weekOptions).toEqual([
      'Tüm haftalar',
      ...catalog.getWeeks('veri-tabani').map((week) => `${week.weekNo}. hafta`),
    ])

    await weekSelect!.setValue('2')
    expect(cards(wrapper)).toHaveLength(courseTasks.filter((task) => task.weekNo === 2).length)
    expect(cards(wrapper).every((card) => card.text().includes('2. hafta'))).toBe(true)
  })

  it('arama kutusuna yazıldıkça liste daralır (#26)', async () => {
    const wrapper = mountPage()
    const total = cards(wrapper).length

    await wrapper.find('input[type="search"]').setValue('SQL')

    const found = cards(wrapper)
    expect(found.length).toBeGreaterThan(0)
    expect(found.length).toBeLessThan(total)
    for (const card of found) expect(card.text().toLocaleLowerCase('tr-TR')).toContain('sql')
  })

  it('sonuç yoksa boş durum mesajı gösterir, filtreler temizlenince liste geri gelir (#51)', async () => {
    const wrapper = mountPage()
    const total = cards(wrapper).length

    await wrapper.find('input[type="search"]').setValue('böyle bir görev yok')
    const empty = wrapper.find('[data-test="empty-state"]')
    expect(empty.text()).toContain('Aradığın görev bulunamadı')
    expect(cards(wrapper)).toHaveLength(0)

    await empty.find('button').trigger('click')
    expect(cards(wrapper)).toHaveLength(total)
    expect((wrapper.find('input[type="search"]').element as HTMLInputElement).value).toBe('')
  })
})

describe('Görevlerim: kendi görevini ekleme, düzenleme, silme (#23)', () => {
  const customCards = (wrapper: ReturnType<typeof mountPage>) =>
    cards(wrapper).filter((card) => card.find('[data-test="custom-badge"]').exists())

  async function addTask(wrapper: ReturnType<typeof mountPage>, title: string) {
    await wrapper.find('[data-test="add-task"]').trigger('click')
    const form = wrapper.find('[data-test="custom-task-form"]')
    await form.find('input[type="text"]').setValue(title)
    await form.find('select').setValue('veri-tabani')
    await form.trigger('submit')
    await flushPromises()
  }

  it('Görev ekle formuyla eklenen görev listede, özette ve aramada görünür', async () => {
    const wrapper = mountPage()
    const total = useProgressStore().tasks.length

    await addTask(wrapper, 'Sunuma hazırlan')

    expect(wrapper.find('[data-test="custom-task-form"]').exists()).toBe(false)
    expect(customCards(wrapper).map((card) => card.find('h2').text())).toEqual(['Sunuma hazırlan'])
    expect(wrapper.find('[data-test="summary"]').text()).toBe(`0 / ${total + 1} görev tamamlandı`)
    expect(wrapper.find('[role="status"]').text()).toBe('Görev eklendi.')

    // Bulanık arama "sunumu" geçen görevi de getirebilir; en iyi eşleşme ilk sırada gelir.
    await wrapper.find('input[type="search"]').setValue('sunuma')
    expect(cards(wrapper)[0]!.find('h2').text()).toBe('Sunuma hazırlan')
  })

  it('ders filtresinde kendi görevi seçtiği derse göre görünür', async () => {
    const wrapper = mountPage()
    await addTask(wrapper, 'Sunuma hazırlan')

    const [courseSelect] = wrapper.findAll('select:not([data-test="status-select"])')
    await courseSelect!.setValue('veri-tabani')
    expect(customCards(wrapper)).toHaveLength(1)
    await courseSelect!.setValue('yazilim-gelistirme')
    expect(customCards(wrapper)).toHaveLength(0)
  })

  it('boş başlıkla görev eklenmez, uyarı gösterilir', async () => {
    const wrapper = mountPage()
    const total = cards(wrapper).length

    await wrapper.find('[data-test="add-task"]').trigger('click')
    await wrapper.find('[data-test="custom-task-form"]').trigger('submit')
    await flushPromises()

    expect(wrapper.text()).toContain('Görev başlığı boş olamaz.')
    expect(cards(wrapper)).toHaveLength(total)
  })

  it('kendi görevi düzenlenir ve silinir', async () => {
    const wrapper = mountPage()
    await addTask(wrapper, 'Sunuma hazırlan')

    await customCards(wrapper)[0]!.find('[data-test="edit-task"]').trigger('click')
    const form = wrapper.find('[data-test="custom-task-form"]')
    expect((form.find('input[type="text"]').element as HTMLInputElement).value).toBe(
      'Sunuma hazırlan',
    )
    await form.find('input[type="text"]').setValue('Sunum provası')
    await form.trigger('submit')
    await flushPromises()
    expect(customCards(wrapper).map((card) => card.find('h2').text())).toEqual(['Sunum provası'])

    const card = customCards(wrapper)[0]!
    await card.find('[data-test="delete-task"]').trigger('click')
    await card.find('[data-test="confirm-delete"]').trigger('click')
    await flushPromises()
    expect(customCards(wrapper)).toHaveLength(0)
    expect(wrapper.find('[role="status"]').text()).toBe('Görev silindi.')
  })

  it('kayıt başarısız olursa form açık kalır ve hata gösterilir', async () => {
    vi.spyOn(userDataService, 'saveCustomTask').mockRejectedValueOnce(new Error('bağlantı yok'))
    const wrapper = mountPage()

    await addTask(wrapper, 'Sunuma hazırlan')

    expect(wrapper.find('[data-test="custom-task-form"] [role="alert"]').text()).toContain(
      'kaydedilemedi',
    )
    expect(customCards(wrapper)).toHaveLength(0)
  })
})
