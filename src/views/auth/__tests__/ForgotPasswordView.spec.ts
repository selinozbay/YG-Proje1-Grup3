import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

// Sayfanın Firebase açıkken ne yazdığını denemek için `isFirebaseEnabled` değiştirilebilir.
const firebase = vi.hoisted(() => ({ enabled: false }))
vi.mock('@/firebase', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/firebase')>()
  return {
    ...original,
    get isFirebaseEnabled() {
      return firebase.enabled
    },
  }
})

const mountPage = async () => {
  const { default: ForgotPasswordView } = await import('../ForgotPasswordView.vue')
  const auth = useAuthStore()
  vi.spyOn(auth, 'resetPassword').mockResolvedValue()
  const wrapper = mount(ForgotPasswordView, { global: { stubs: { RouterLink: RouterLinkStub } } })
  await wrapper.find('input[type="email"]').setValue('123456@ogr.ktu.edu.tr')
  await wrapper.find('form').trigger('submit')
  await flushPromises()
  return wrapper
}

describe('Şifremi unuttum', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('e-posta gönderilince Gereksiz klasörüne de bakılmasını söyler', async () => {
    firebase.enabled = true
    const status = (await mountPage()).find('[role="status"]')
    expect(status.text()).toContain('şifre sıfırlama bağlantısı gönderildi')
    expect(status.text()).toContain('Gereksiz (Spam) klasörüne de bakın')
  })

  it('demo modunda e-posta gönderilmediğini söyler, Gereksiz uyarısı çıkmaz', async () => {
    firebase.enabled = false
    const status = (await mountPage()).find('[role="status"]')
    expect(status.text()).toContain('Demo modunda e-posta gönderilmez')
    expect(status.text()).not.toContain('Gereksiz')
  })
})
