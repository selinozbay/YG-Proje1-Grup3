import { describe, it, expect, beforeEach, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia, type Pinia } from 'pinia'
import ProfileView from '../ProfileView.vue'
import { STORAGE_KEYS } from '@/config'
import { useAuthStore } from '@/stores/auth'
import { useCatalogStore } from '@/stores/catalog'
import { usePreferencesStore } from '@/stores/preferences'
import { useProgressStore } from '@/stores/progress'

vi.mock('vue-router', () => ({ useRouter: () => ({ replace: vi.fn() }) }))

// jsdom'da matchMedia yok; tema store'u "Sistem" seçeneği için kullanır. Sistem aydınlık sayılır.
window.matchMedia = (query: string) =>
  ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }) as unknown as MediaQueryList

let pinia: Pinia

beforeEach(async () => {
  localStorage.clear()
  document.documentElement.classList.remove('dark')
  pinia = createPinia()
  setActivePinia(pinia)
  useAuthStore().user = {
    uid: 'ogrenci-1',
    email: '123456@ogr.ktu.edu.tr',
    displayName: 'Ayşe Yılmaz',
  }
  await useProgressStore().load('ogrenci-1')
})

const mountProfile = () => mount(ProfileView, { global: { plugins: [pinia] } })

describe('Profil — hesap bilgileri (#30)', () => {
  it('ad soyad, e-posta ve baş harfleri kartta gösterir', () => {
    const card = mountProfile().find('[data-test="account-card"]')
    expect(card.text()).toContain('Ayşe Yılmaz')
    expect(card.text()).toContain('123456@ogr.ktu.edu.tr')
    expect(card.find('[data-test="avatar"]').text()).toBe('AY')
  })

  it('şifre sıfırlama bağlantısını kullanıcının e-postasına gönderir ve bildirir', async () => {
    const auth = useAuthStore()
    const reset = vi.spyOn(auth, 'resetPassword').mockResolvedValue()
    const wrapper = mountProfile()

    await wrapper.find('[data-test="reset-password"]').trigger('click')
    await flushPromises()

    expect(reset).toHaveBeenCalledWith('123456@ogr.ktu.edu.tr')
    expect(wrapper.find('[role="status"]').text()).toContain('123456@ogr.ktu.edu.tr')
  })

  it('bağlantı gönderilemezse Türkçe hata gösterir', async () => {
    const auth = useAuthStore()
    vi.spyOn(auth, 'resetPassword').mockRejectedValue({ code: 'auth/network-request-failed' })
    const wrapper = mountProfile()

    await wrapper.find('[data-test="reset-password"]').trigger('click')
    await flushPromises()

    expect(wrapper.find('[data-test="account-card"] [role="alert"]').text()).toBe(
      'Bağlantı kurulamadı. İnternet bağlantınızı kontrol edin.',
    )
  })
})

describe('Profil — tema seçimi (#52)', () => {
  const radio = (wrapper: ReturnType<typeof mountProfile>, value: string) =>
    wrapper.find(`input[type="radio"][value="${value}"]`)

  it('Aydınlık, Karanlık ve Sistem seçenekleri var; varsayılan Aydınlık', () => {
    const wrapper = mountProfile()
    const labels = wrapper.findAll('[data-test="theme-option"]').map((o) => o.text())
    expect(labels).toEqual([
      expect.stringContaining('Aydınlık'),
      expect.stringContaining('Karanlık'),
      expect.stringContaining('Sistem'),
    ])
    expect((radio(wrapper, 'light').element as HTMLInputElement).checked).toBe(true)
  })

  it('Karanlık seçilince tema değişir ve tercih kaydedilir', async () => {
    const wrapper = mountProfile()
    await radio(wrapper, 'dark').setValue(true)

    expect(usePreferencesStore().theme).toBe('dark')
    expect(localStorage.getItem(STORAGE_KEYS.theme)).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('kayıtlı tercih sayfa yeniden açılınca seçili gelir (P1-13)', () => {
    localStorage.setItem(STORAGE_KEYS.theme, 'system')
    setActivePinia((pinia = createPinia()))
    useAuthStore().user = { uid: 'ogrenci-1', email: 'a@b.c', displayName: null }

    const wrapper = mountProfile()
    expect((radio(wrapper, 'system').element as HTMLInputElement).checked).toBe(true)
  })
})

describe('Profil — istatistikler (#29)', () => {
  it('tamamlanan görev ve aktif ders sayısını gösterir, görev tamamlanınca güncellenir', async () => {
    const wrapper = mountProfile()
    const total = useProgressStore().tasks.length
    const courseCount = useCatalogStore().courses.length
    const stat = (name: string) => wrapper.find(`[data-test="stat-${name}"]`).text()

    expect(stat('done')).toContain(`0 / ${total}`)
    expect(stat('active-courses')).toContain(String(courseCount))

    await useProgressStore().setStatus(useProgressStore().tasks[0]!.id, 'done')
    await flushPromises()

    expect(stat('done')).toContain(`1 / ${total}`)
  })

  it('derslere göre ilerlemeyi her ders için bir çubukla gösterir', () => {
    const rows = mountProfile().findAll('[data-test="course-progress"]')
    expect(rows.map((row) => row.text())).toEqual(
      useCatalogStore().courses.map((course) => expect.stringContaining(course.title)),
    )
    expect(rows.every((row) => row.find('[role="progressbar"]').exists())).toBe(true)
  })

  it('"Geliştirilecek" kutusu kaldırıldı, hesap silme bölümü duruyor (#27)', () => {
    const wrapper = mountProfile()
    expect(wrapper.text()).not.toContain('Geliştirilecek')
    expect(wrapper.text()).toContain('Hesabımı ve verilerimi sil')
  })
})

describe('Profil — hesap silme (KVKK)', () => {
  // Onay penceresi body'ye taşındığı için sayfa belgeye bağlanarak açılır. Önceki testlerin
  // pencereleri de body'de kaldığı için her zaman en son eklenen pencereye bakılır.
  const mountAttached = () =>
    mount(ProfileView, { global: { plugins: [pinia] }, attachTo: document.body })
  const lastDialog = () => {
    const dialogs = document.querySelectorAll('dialog')
    return dialogs[dialogs.length - 1]!
  }
  const button = (test: string) =>
    lastDialog().querySelector<HTMLButtonElement>(`[data-test="${test}"]`)!

  it('önce onay penceresi açar; Vazgeç denirse hesap silinmez', async () => {
    const remove = vi.spyOn(useAuthStore(), 'deleteAccount').mockResolvedValue()
    const wrapper = mountAttached()

    await wrapper.find('[data-test="delete-account"]').trigger('click')
    await flushPromises()
    const dialog = lastDialog()
    expect(dialog.hasAttribute('open')).toBe(true)
    expect(dialog.querySelector('h2')!.textContent).toBe('Hesabınız silinsin mi?')

    button('confirm-cancel').click()
    await flushPromises()
    expect(remove).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it('onaylanınca hesabı ve verileri siler', async () => {
    const remove = vi.spyOn(useAuthStore(), 'deleteAccount').mockResolvedValue()
    const wrapper = mountAttached()

    await wrapper.find('[data-test="delete-account"]').trigger('click')
    await flushPromises()
    button('confirm-ok').click()
    await flushPromises()

    expect(remove).toHaveBeenCalledOnce()
    wrapper.unmount()
  })

  it('silinemezse sayfada Türkçe hata gösterir', async () => {
    vi.spyOn(useAuthStore(), 'deleteAccount').mockRejectedValue({
      code: 'auth/network-request-failed',
    })
    const wrapper = mountAttached()

    await wrapper.find('[data-test="delete-account"]').trigger('click')
    await flushPromises()
    button('confirm-ok').click()
    await flushPromises()

    expect(wrapper.find('[role="alert"]').text()).toBe(
      'Bağlantı kurulamadı. İnternet bağlantınızı kontrol edin.',
    )
    wrapper.unmount()
  })
})
