import { describe, it, expect, afterEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import DateField from '../DateField.vue'

let wrapper: VueWrapper | undefined

/** Takvim, ekranda gerçekten açılmış gibi davransın diye sayfaya eklenir (odak testleri). */
function field(modelValue = '', today = '2026-11-08') {
  wrapper = mount(DateField, {
    props: {
      id: 'son-tarih',
      modelValue,
      today,
      'onUpdate:modelValue': (value: string) => wrapper!.setProps({ modelValue: value }),
    },
    attachTo: document.body,
  })
  return wrapper
}

const toggle = (w: VueWrapper) => w.find('[data-test="date-picker-toggle"]')
const picker = (w: VueWrapper) => w.find('[data-test="date-picker"]')
const day = (w: VueWrapper, iso: string) => w.find(`[data-date="${iso}"]`)
const emitted = (w: VueWrapper) => w.emitted<[string]>('update:modelValue')?.map(([v]) => v)

afterEach(() => wrapper?.unmount())

describe('DateField (#110)', () => {
  it('tarih kutuya elle de yazılabilir; kutu etiketin id’sini taşır', async () => {
    const w = field()
    const input = w.find('input[type="date"]')
    expect(input.attributes('id')).toBe('son-tarih')
    expect(input.classes()).toContain('is-empty')

    await input.setValue('2026-11-10')
    expect(emitted(w)).toEqual(['2026-11-10'])
    expect(w.find('input').classes()).not.toContain('is-empty')
  })

  it('takvim seçili tarihin ayında açılır; seçili gün ve bugün işaretlidir', async () => {
    const w = field('2026-11-10')
    expect(picker(w).exists()).toBe(false)
    expect(toggle(w).attributes('aria-expanded')).toBe('false')

    await toggle(w).trigger('click')
    expect(picker(w).exists()).toBe(true)
    expect(toggle(w).attributes('aria-expanded')).toBe('true')
    expect(w.find('[data-test="date-picker-title"]').text()).toBe('Kasım 2026')

    expect(day(w, '2026-11-10').element.closest('td')?.getAttribute('aria-selected')).toBe('true')
    expect(day(w, '2026-11-10').attributes('aria-label')).toBe('10 Kasım 2026 Salı')
    expect(day(w, '2026-11-08').attributes('aria-current')).toBe('date')
    // Odak seçili günde; diğer günler Tab sırasında değil.
    expect(document.activeElement).toBe(day(w, '2026-11-10').element)
    expect(day(w, '2026-11-11').attributes('tabindex')).toBe('-1')
  })

  it('hafta Pazartesi başlar; ayın ilk günü doğru sütundadır', async () => {
    const w = field('', '2026-11-08')
    await toggle(w).trigger('click')
    const headers = w.findAll('th abbr').map((abbr) => abbr.attributes('title'))
    expect(headers[0]).toBe('Pazartesi')
    expect(headers[6]).toBe('Pazar')
    // 1 Kasım 2026 Pazar: ilk satırın son hücresi.
    const firstRow = w.findAll('tbody tr')[0]!.findAll('td')
    expect(firstRow[6]!.find('button').attributes('data-date')).toBe('2026-11-01')
    expect(firstRow[0]!.find('button').exists()).toBe(false)
  })

  it('güne basınca tarih seçilir, takvim kapanır ve odak düğmeye döner', async () => {
    const w = field()
    await toggle(w).trigger('click')
    await day(w, '2026-11-20').trigger('click')

    expect(emitted(w)).toEqual(['2026-11-20'])
    expect(picker(w).exists()).toBe(false)
    expect(document.activeElement).toBe(toggle(w).element)
  })

  it('boşken bugünün ayında açılır; "Bugün" bugünü, "Temizle" boşluğu seçer', async () => {
    const w = field('', '2026-11-08')
    await toggle(w).trigger('click')
    expect(w.text()).not.toContain('Temizle') // seçili tarih yokken temizlenecek bir şey yok
    await w
      .findAll('button')
      .find((b) => b.text() === 'Bugün')!
      .trigger('click')
    expect(emitted(w)).toEqual(['2026-11-08'])

    await toggle(w).trigger('click')
    await w
      .findAll('button')
      .find((b) => b.text() === 'Temizle')!
      .trigger('click')
    expect(emitted(w)).toEqual(['2026-11-08', ''])
  })

  it('önceki ve sonraki ay düğmeleri ayı değiştirir', async () => {
    const w = field('2026-01-15')
    await toggle(w).trigger('click')
    await w.find('[aria-label="Önceki ay"]').trigger('click')
    expect(w.find('[data-test="date-picker-title"]').text()).toBe('Aralık 2025')
    await w.find('[aria-label="Sonraki ay"]').trigger('click')
    await w.find('[aria-label="Sonraki ay"]').trigger('click')
    expect(w.find('[data-test="date-picker-title"]').text()).toBe('Şubat 2026')
  })

  it('klavyeyle gezilir: oklar gün/hafta, Page Down ay değiştirir, Esc kapatır', async () => {
    const w = field('2026-11-30')
    await toggle(w).trigger('click')

    await day(w, '2026-11-30').trigger('keydown', { key: 'ArrowRight' })
    await nextTick()
    expect(w.find('[data-test="date-picker-title"]').text()).toBe('Aralık 2026')
    expect(document.activeElement).toBe(day(w, '2026-12-01').element)

    await day(w, '2026-12-01').trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    expect(document.activeElement).toBe(day(w, '2026-12-08').element)

    // End haftanın son gününe (Pazar), Page Down bir sonraki ayın aynı gününe gider.
    await day(w, '2026-12-08').trigger('keydown', { key: 'End' })
    await nextTick()
    expect(document.activeElement).toBe(day(w, '2026-12-13').element)
    await day(w, '2026-12-13').trigger('keydown', { key: 'PageDown' })
    await nextTick()
    expect(document.activeElement).toBe(day(w, '2027-01-13').element)

    // 31 Ocak'tan bir ay sonrası Şubat'ın son günüdür.
    await day(w, '2027-01-13').trigger('keydown', { key: 'End' })
    await day(w, '2027-01-17').trigger('keydown', { key: 'ArrowDown' })
    await day(w, '2027-01-24').trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    await day(w, '2027-01-31').trigger('keydown', { key: 'PageDown' })
    await nextTick()
    expect(document.activeElement).toBe(day(w, '2027-02-28').element)

    await picker(w).trigger('keydown', { key: 'Escape' })
    expect(picker(w).exists()).toBe(false)
    expect(document.activeElement).toBe(toggle(w).element)
    expect(emitted(w)).toBeUndefined() // gezinmek tarihi değiştirmez
  })

  it('takvimin dışına tıklanınca kapanır', async () => {
    const w = field()
    await toggle(w).trigger('click')
    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    await nextTick()
    expect(picker(w).exists()).toBe(false)
  })

  it('hatalı alan ekran okuyucuya bildirilir', () => {
    const w = mount(DateField, {
      props: { id: 'x', modelValue: '', invalid: true, describedby: 'x-hata' },
    })
    const input = w.find('input')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(input.attributes('aria-describedby')).toBe('x-hata')
  })
})
