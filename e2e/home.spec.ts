import { test, expect, type Page } from '@playwright/test'

// Ana Sayfa (#9–#13, #48): genel ilerleme, yaklaşan görevler, bu haftanın dersleri (demo modu).
// "Bu hafta" ve "yaklaşan" bugüne bağlı olduğu için saat 31 Ekim 2026'ya sabitlenir.

async function login(page: Page) {
  await page.clock.setFixedTime(new Date('2026-10-31T10:00:00'))
  await page.goto('/giris')
  await page.fill('input[type="email"]', 'ogrenci@example.com')
  await page.fill('input[type="password"]', 'parola123')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/')
}

test.describe('E2E: Ana Sayfa', () => {
  test('yaklaşan görev tamamlanınca genel ilerleme ve ders kartı güncellenir', async ({ page }) => {
    await login(page)

    await expect(page.locator('[data-test="overall-summary"]')).toHaveText('0 / 24 görev')
    const first = page.locator('[data-test="upcoming-task"]').first()
    await expect(first).toContainText('Veri Tabanı Yönetim Sistemleri, 3. hafta')

    await first.getByLabel(/^Durum:/).selectOption('done')

    await expect(page.locator('[data-test="overall-summary"]')).toHaveText('1 / 24 görev')
    await expect(page.locator('[data-test="overall-percent"]')).toHaveText('%4')
    const vtCourse = page.locator('[data-test="home-course"]', { hasText: 'Veri Tabanı' })
    await expect(vtCourse.locator('[data-test="course-summary"]')).toHaveText('1 / 8')
    await expect(page.locator('[data-test="term-week"]').nth(2)).toContainText('1 / 6 görev')

    await page.reload()
    await expect(page.locator('[data-test="overall-summary"]')).toHaveText('1 / 24 görev')
  })

  test('bu haftanın dersinden hafta detayına gidilir', async ({ page }) => {
    await login(page)

    const items = page.locator('[data-test="this-week-item"]')
    await expect(items).toHaveCount(3)
    await expect(items.first()).toContainText('3. hafta: Geliştirme ve Test')

    await page.getByRole('link', { name: 'Yazılım Geliştirme, 3. haftaya git' }).click()
    await expect(page).toHaveURL('/derslerim/yazilim-gelistirme/hafta/3')
  })
})
