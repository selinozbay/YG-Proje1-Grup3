import { test, expect, type Page } from '@playwright/test'

// #27–#30, #52: profil sayfası (demo modu).

async function login(page: Page) {
  await page.goto('/giris')
  await page.getByLabel('E-posta').fill('ogrenci@example.com')
  await page.getByLabel('Şifre', { exact: true }).fill('parola123')
  await page.getByRole('button', { name: 'Giriş yap' }).click()
  await expect(page).toHaveURL('/')
  await page.goto('/profil')
}

const html = (page: Page) => page.locator('html')
// Radyo düğmeleri görsel olarak gizli (sr-only); kullanıcı gibi kartın kendisine tıklanır.
const themeCard = (page: Page, name: string) =>
  page.locator('[data-test="theme-option"]', { hasText: name })

test.describe('E2E: Profil', () => {
  test('seçilen tema sayfa yenilenince korunur (#52, P1-13)', async ({ page }) => {
    await login(page)
    await expect(html(page)).not.toHaveClass(/dark/)

    await themeCard(page, 'Karanlık').click()
    await expect(html(page)).toHaveClass(/dark/)

    await page.reload()
    await expect(html(page)).toHaveClass(/dark/)
    await expect(page.getByRole('radio', { name: /Karanlık/ })).toBeChecked()

    await themeCard(page, 'Aydınlık').click()
    await page.reload()
    await expect(html(page)).not.toHaveClass(/dark/)
  })

  test('"Sistem" seçilince cihazın teması izlenir (#52)', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await login(page)

    await themeCard(page, 'Sistem').click()
    await expect(html(page)).toHaveClass(/dark/)

    await page.emulateMedia({ colorScheme: 'light' })
    await expect(html(page)).not.toHaveClass(/dark/)
  })

  test('1024 px genişlikte tema kartları sıkışmaz (#99)', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 })
    await login(page)

    const cards = page.locator('[data-test="theme-option"]')
    await expect(cards).toHaveCount(3)
    for (const card of await cards.all()) {
      const { width } = (await card.boundingBox())!
      expect(width).toBeGreaterThanOrEqual(150)
      // Açıklama (ör. "Her zaman açık renkler") en fazla iki satır olmalı.
      const hint = card.locator('span.block').last()
      const lines = await hint.evaluate(
        (el) => el.getBoundingClientRect().height / parseFloat(getComputedStyle(el).lineHeight),
      )
      expect(Math.round(lines)).toBeLessThanOrEqual(2)
    }

    // "1 / 24" gibi tamamlanan görev sayısı tek satırda kalmalı.
    const doneNumber = page.locator('[data-test="stat-done"] dd > span').first()
    const numberLines = await doneNumber.evaluate((el) => el.getClientRects().length)
    expect(numberLines).toBe(1)
  })

  test('şifre sıfırlama bağlantısı gönderildiği bildirilir (#30)', async ({ page }) => {
    await login(page)
    await page.getByRole('button', { name: 'Şifre sıfırlama bağlantısı gönder' }).click()
    await expect(
      page.getByText('Sıfırlama bağlantısı ogrenci@example.com adresine gönderildi.'),
    ).toBeVisible()
  })
})
