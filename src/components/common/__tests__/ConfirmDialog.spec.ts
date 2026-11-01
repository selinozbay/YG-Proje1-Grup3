import { describe, it, expect, afterEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import ConfirmDialog from '../ConfirmDialog.vue'

let wrapper: VueWrapper | undefined

// Pencere <Teleport> ile body'ye taşındığı için öğeler document üzerinden aranır.
const find = (selector: string) => document.body.querySelector<HTMLElement>(selector)

async function open(props: Record<string, unknown> = {}) {
  wrapper = mount(ConfirmDialog, {
    props: { open: true, title: 'Çıkış yapmak istediğinize emin misiniz?', ...props },
    attachTo: document.body,
  })
  await nextTick()
  await nextTick()
  return wrapper
}

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

describe('ConfirmDialog (#35)', () => {
  it('açıkken başlığı gösterir ve ilk odak "Hayır" düğmesindedir', async () => {
    await open({ message: 'Açıklama' })
    expect(find('dialog')?.hasAttribute('open')).toBe(true)
    expect(find('dialog h2')?.textContent).toBe('Çıkış yapmak istediğinize emin misiniz?')
    expect(document.activeElement).toBe(find('[data-test="confirm-cancel"]'))
  })

  it('"Evet" confirm, "Hayır" cancel olayını gönderir', async () => {
    const w = await open({ confirmLabel: 'Evet, çıkış yap' })
    expect(find('[data-test="confirm-ok"]')?.textContent?.trim()).toBe('Evet, çıkış yap')

    find('[data-test="confirm-ok"]')?.click()
    find('[data-test="confirm-cancel"]')?.click()
    expect(w.emitted('confirm')).toHaveLength(1)
    expect(w.emitted('cancel')).toHaveLength(1)
  })

  it('Esc tuşu (dialog cancel olayı) "Hayır" sayılır', async () => {
    const w = await open()
    find('dialog')?.dispatchEvent(new Event('cancel', { cancelable: true }))
    expect(w.emitted('cancel')).toHaveLength(1)
  })

  it('işlem sürerken düğmeler kilitlenir ve bekleme yazısı görünür', async () => {
    const w = await open({ busy: true, busyLabel: 'Çıkış yapılıyor…' })
    const ok = find('[data-test="confirm-ok"]') as HTMLButtonElement
    expect(ok.disabled).toBe(true)
    expect(ok.textContent?.trim()).toBe('Çıkış yapılıyor…')

    find('dialog')?.dispatchEvent(new Event('cancel', { cancelable: true }))
    expect(w.emitted('cancel')).toBeUndefined()
  })
})
