import { test, expect } from '@playwright/test'

// #98 (B-05): sayfa değişince yeni sayfa en üstten açılır; geri gelince eski konum korunur.

test.describe('E2E: Sayfa geçişinde kaydırma (#98)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 700 })
    await page.goto('/giris')
    await page.getByLabel('E-posta').fill('ogrenci@example.com')
    await page.getByLabel('Şifre', { exact: true }).fill('parola123')
    await page.getByRole('button', { name: 'Giriş yap' }).click()
    await expect(page).toHaveURL('/')
  })

  test('aşağıdaki karta tıklayınca yeni sayfa en üstten açılır', async ({ page }) => {
    await page.goto('/derslerim/veri-tabani')
    const lastCard = page.locator('[data-test="week-card"]').last()
    await lastCard.scrollIntoViewIfNeeded()
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0)

    await lastCard.click()
    await expect(page).toHaveURL('/derslerim/veri-tabani/hafta/4')
    await expect(page.locator('h1')).toBeInViewport()
    expect(await page.evaluate(() => window.scrollY)).toBe(0)
  })

  test('tarayıcının geri düğmesiyle dönünce önceki konum korunur', async ({ page }) => {
    await page.goto('/derslerim/veri-tabani')
    const lastCard = page.locator('[data-test="week-card"]').last()
    await lastCard.scrollIntoViewIfNeeded()
    const before = await page.evaluate(() => window.scrollY)
    await lastCard.click()
    await expect(page).toHaveURL('/derslerim/veri-tabani/hafta/4')

    await page.goBack()
    await expect(page).toHaveURL('/derslerim/veri-tabani')
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(before / 2)
  })
})
