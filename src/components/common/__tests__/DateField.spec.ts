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
const last = (w: VueWrapper) => emitted(w)?.slice(-1)[0]

afterEach(() => wrapper?.unmount())

describe('DateField (#110)', () => {
  it('tarih kutuya gg.aa.yyyy biçiminde elle yazılabilir; kutu etiketin id’sini taşır', async () => {
    const w = field()
    const input = w.find('input')
    expect(input.attributes('id')).toBe('son-tarih')
    // Tarayıcının tarih kutusu değil (#114): Firefox ona kendi takvimini ekliyordu.
    expect(input.attributes('type')).toBe('text')
    expect(input.attributes('placeholder')).toBe('gg.aa.yyyy')

    await input.setValue('10.11.2026')
    expect(emitted(w)).toEqual(['2026-11-10'])
  })

  it('farklı yazımlar kabul edilir; kutudan çıkınca tek biçime getirilir (#114)', async () => {
    const w = field()
    const input = w.find('input')
    for (const [typed, iso] of [
      ['1.2.2026', '2026-02-01'],
      ['10/11/2026', '2026-11-10'],
      ['10-11-2026', '2026-11-10'],
      ['10112026', '2026-11-10'],
      [' 29.02.2028 ', '2028-02-29'], // artık yıl
    ]) {
      await input.setValue(typed)
      expect(last(w)).toBe(iso)
    }

    await input.setValue('1.2.2026')
    await input.trigger('blur')
    expect((input.element as HTMLInputElement).value).toBe('01.02.2026')
  })

  it('geçersiz tarih olduğu gibi iletilir, form uyarı gösterebilsin (#114)', async () => {
    const w = field()
    const input = w.find('input')
    for (const typed of ['31.02.2026', '29.02.2026', '10.13.2026', '10.11', '10..2026']) {
      await input.setValue(typed)
      expect(last(w)).toBe(typed)
      // Kutudaki yazı silinmez, kullanıcı düzeltebilir.
      await input.trigger('blur')
      expect((input.element as HTMLInputElement).value).toBe(typed)
    }
    await input.setValue('')
    expect(last(w)).toBe('')
  })

  it('harf ve diğer işaretler kutuya girmez; imleç yerinde kalır (#114)', async () => {
    const w = field()
    const input = w.find('input')
    const el = input.element as HTMLInputElement

    await input.setValue('yarın')
    expect(el.value).toBe('')
    expect(emitted(w)).toBeUndefined() // değer boş kaldı, değişmedi

    // Yapıştırılan metindeki harfler atılır, tarih kalır.
    await input.setValue('Tarih: 10.11.2026!')
    expect(el.value).toBe('10.11.2026')
    expect(last(w)).toBe('2026-11-10')

    // "10.1a" yazılırken imleç sondaysa harf silinir, imleç yine sonda kalır.
    el.value = '10.1a'
    el.setSelectionRange(5, 5)
    await input.trigger('input')
    expect(el.value).toBe('10.1')
    expect(el.selectionStart).toBe(4)
  })

  it('değer dışarıdan gelince kutuda gg.aa.yyyy görünür (düzenleme formu)', async () => {
    const w = field('2026-12-04')
    expect((w.find('input').element as HTMLInputElement).value).toBe('04.12.2026')
    await w.setProps({ modelValue: '2027-01-15' })
    expect((w.find('input').element as HTMLInputElement).value).toBe('15.01.2027')
    await w.setProps({ modelValue: '' })
    expect((w.find('input').element as HTMLInputElement).value).toBe('')
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
    expect((w.find('input').element as HTMLInputElement).value).toBe('20.11.2026')
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
