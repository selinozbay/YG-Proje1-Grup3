// #25: Bir görevin durumu değişince onu gösteren bütün sayfalar aynı anda güncellenir.
// Sayfalar görevleri aynı yerden (stores/progress.ts) okuduğu için ayrıca bir eşitleme gerekmez.
import { flushPromises, mount, RouterLinkStub, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia, type Pinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useCatalogStore } from '@/stores/catalog'
import { useProgressStore } from '@/stores/progress'
import TasksView from '@/views/TasksView.vue'
import WeekDetailView from '@/views/WeekDetailView.vue'

const TASK_ID = 'yg-w1-t1'
const USER_ID = 'ogrenci-1'

let pinia: Pinia
const mountOptions = () => ({ global: { plugins: [pinia], stubs: { RouterLink: RouterLinkStub } } })

beforeEach(() => {
  localStorage.clear()
  pinia = createPinia()
  setActivePinia(pinia)
})

/** Sayfadaki o görevin kartında seçili durum. */
const statusOnPage = (page: VueWrapper, title: string) => {
  const card = page.findAll('article').find((article) => article.text().includes(title))
  return (card?.find('[data-test="status-select"]').element as HTMLSelectElement | undefined)?.value
}

describe('Görev durumunun sayfalar arasında eşit kalması (#25)', () => {
  it('durum bir sayfada değişince Görevlerim ve Hafta detayı birlikte güncellenir', async () => {
    const progress = useProgressStore()
    await progress.load(USER_ID)
    const total = useCatalogStore().tasks.length
    const task = useCatalogStore().tasks.find((t) => t.id === TASK_ID)!

    const tasksPage = mount(TasksView, mountOptions())
    const week = mount(WeekDetailView, {
      ...mountOptions(),
      props: { courseId: 'yazilim-gelistirme', weekNo: 1 },
    })
    expect(statusOnPage(tasksPage, task.title)).toBe('todo')
    expect(statusOnPage(week, task.title)).toBe('todo')

    // Görevlerim'de değiştir → Hafta detayı da güncellenir
    const card = tasksPage.findAll('article').find((a) => a.text().includes(task.title))!
    await card.find('[data-test="status-select"]').setValue('done')
    await flushPromises()

    expect(statusOnPage(week, task.title)).toBe('done')
    expect(week.find('[data-test="week-summary"]').text()).toMatch(/^1 \//)
    expect(tasksPage.find('[data-test="summary"]').text()).toBe(`1 / ${total} görev tamamlandı`)

    // Hafta detayında geri al → Görevlerim de güncellenir
    const weekCard = week.findAll('article').find((a) => a.text().includes(task.title))!
    await weekCard.find('[data-test="status-select"]').setValue('in-progress')
    await flushPromises()

    expect(statusOnPage(tasksPage, task.title)).toBe('in-progress')
  })

  it('kaydedilen durum sayfa yenilenince korunur', async () => {
    await useProgressStore().load(USER_ID)
    await useProgressStore().setStatus(TASK_ID, 'in-progress')

    // Sayfa yenilenmesi: store'lar sıfırdan kurulur ve veri yeniden okunur
    setActivePinia(createPinia())
    const reloaded = useProgressStore()
    await reloaded.load(USER_ID)

    expect(reloaded.statusOf(TASK_ID)).toBe('in-progress')
  })
})
