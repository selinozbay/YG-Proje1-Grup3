import { test, expect, type Page } from '@playwright/test'

// Görevlerim sayfası (#20): durum değiştirme, filtre, arama ve boş durum (demo modu).

async function login(page: Page) {
  await page.goto('/giris')
  await page.fill('input[type="email"]', 'ogrenci@example.com')
  await page.fill('input[type="password"]', 'parola123')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/')
}

const taskCard = (page: Page, title: string) => page.locator('article', { hasText: title })
const summary = (page: Page) => page.locator('[data-test="summary"]')

test.describe('E2E: Görevlerim', () => {
  test('görev durumu değiştirilir ve sayfa yenilenince korunur', async ({ page }) => {
    await login(page)
    await page.goto('/gorevlerim')

    const card = taskCard(page, 'Kullanıcı hikâyelerini yaz')
    await card.getByLabel(/^Durum:/).selectOption('done')
    await expect(summary(page)).toHaveText(/1 \/ \d+ görev tamamlandı/)

    await page.reload()
    await expect(taskCard(page, 'Kullanıcı hikâyelerini yaz').getByLabel(/^Durum:/)).toHaveValue(
      'done',
    )
    await expect(summary(page)).toHaveText(/1 \/ \d+ görev tamamlandı/)
  })

  test('duruma ve derse göre filtrelenir', async ({ page }) => {
    await login(page)
    await page.goto('/gorevlerim')
    await taskCard(page, 'Kullanıcı hikâyelerini yaz')
      .getByLabel(/^Durum:/)
      .selectOption('done')

    await page.getByRole('button', { name: /^Tamamlandı/ }).click()
    await expect(page.locator('article')).toHaveCount(1)

    await page.getByRole('button', { name: /^Tümü/ }).click()
    await page.getByLabel('Ders').selectOption({ label: 'Veri Tabanı Yönetim Sistemleri' })
    for (const card of await page.locator('article').all()) {
      await expect(card).toContainText('Veri Tabanı Yönetim Sistemleri')
    }
  })

  test('arama listeyi daraltır, sonuç yoksa mesaj ve temizleme düğmesi görünür', async ({
    page,
  }) => {
    await login(page)
    await page.goto('/gorevlerim')
    const cards = page.locator('article')
    await expect(cards.first()).toBeVisible()
    const total = await cards.count()

    await page.getByLabel('Görev ara').fill('SQL')
    await expect(cards).not.toHaveCount(total)
    for (const card of await cards.all()) {
      await expect(card).toContainText(/sql/i)
    }

    await page.getByLabel('Görev ara').fill('böyle bir görev yok')
    await expect(page.getByText('Aradığın görev bulunamadı')).toBeVisible()

    await page.getByRole('button', { name: 'Filtreleri temizle' }).click()
    await expect(cards).toHaveCount(total)
  })
})

test.describe('E2E: Kendi görevim (#23)', () => {
  test('eklenen görev sayfa yenilenince durur, düzenlenir ve silinir', async ({ page }) => {
    await login(page)
    await page.goto('/gorevlerim')

    await page.getByRole('button', { name: '+ Görev ekle' }).click()
    await page.getByRole('button', { name: 'Görevi ekle' }).click()
    await expect(page.getByText('Görev başlığı boş olamaz.')).toBeVisible()

    await page.getByLabel('Başlık').fill('Sunuma hazırlan')
    await page.getByLabel('Son tarih').fill('2026-11-10')
    await page.getByRole('button', { name: 'Görevi ekle' }).click()

    const card = taskCard(page, 'Sunuma hazırlan')
    await expect(card.getByText('Kendi görevim')).toBeVisible()
    await expect(card).toContainText('Son tarih: 10 Kasım 2026')

    await page.reload()
    await expect(taskCard(page, 'Sunuma hazırlan')).toBeVisible()

    await taskCard(page, 'Sunuma hazırlan')
      .getByRole('button', { name: 'Sunuma hazırlan görevini düzenle' })
      .click()
    await page.getByLabel('Başlık').fill('Sunum provası')
    await page.getByRole('button', { name: 'Değişiklikleri kaydet' }).click()
    await expect(taskCard(page, 'Sunum provası')).toBeVisible()

    await taskCard(page, 'Sunum provası')
      .getByRole('button', { name: 'Sunum provası görevini sil' })
      .click()
    await page.getByRole('button', { name: 'Evet, sil' }).click()
    await expect(taskCard(page, 'Sunum provası')).toHaveCount(0)

    await page.reload()
    await expect(page.locator('article').first()).toBeVisible()
    await expect(taskCard(page, 'Sunum provası')).toHaveCount(0)
  })
})
