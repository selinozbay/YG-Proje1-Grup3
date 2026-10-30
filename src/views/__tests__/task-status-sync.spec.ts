// #25: Bir görevin durumu değişince onu gösteren bütün sayfalar aynı anda güncellenir.
// Sayfalar görevleri aynı yerden (stores/progress.ts) okuduğu için ayrıca bir eşitleme gerekmez.
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import { createPinia, setActivePinia, type Pinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useCatalogStore } from '@/stores/catalog'
import { useProgressStore } from '@/stores/progress'
import HomeView from '@/views/HomeView.vue'
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

describe('Görev durumunun sayfalar arasında eşit kalması (#25)', () => {
  it('durum bir yerde değişince Ana Sayfa ve Hafta detayı birlikte güncellenir', async () => {
    const progress = useProgressStore()
    await progress.load(USER_ID)
    const total = useCatalogStore().tasks.length
    const task = useCatalogStore().tasks.find((t) => t.id === TASK_ID)
    expect(task).toBeDefined()

    const home = mount(HomeView, mountOptions())
    const week = mount(WeekDetailView, {
      ...mountOptions(),
      props: { courseId: 'yazilim-gelistirme', weekNo: 1 },
    })
    expect(home.text()).toContain(`0 / ${total} görev tamamlandı`)
    expect(week.text()).toContain(`${task?.title} — Yapılacak`)

    await progress.setStatus(TASK_ID, 'done')
    await flushPromises()

    expect(home.text()).toContain(`1 / ${total} görev tamamlandı`)
    expect(week.text()).toContain(`${task?.title} — Tamamlandı`)
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
