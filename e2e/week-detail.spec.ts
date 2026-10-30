import { test, expect, type Page } from '@playwright/test'

// Hafta detayı (#43): hedefler, görev durumu, haftanın ilerlemesi, önceki/sonraki hafta (demo modu).

async function login(page: Page) {
  await page.goto('/giris')
  await page.fill('input[type="email"]', 'ogrenci@example.com')
  await page.fill('input[type="password"]', 'parola123')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/')
}

test('hafta detayında görev tamamlanınca ilerleme artar, haftalar arasında gezilir', async ({
  page,
}) => {
  await login(page)
  await page.goto('/derslerim/yazilim-gelistirme/hafta/1')

  await expect(page.getByRole('heading', { name: 'Öğrenme hedefleri' })).toBeVisible()
  const progressbar = page.getByRole('progressbar', { name: 'Bu haftanın ilerlemesi' })
  await expect(progressbar).toHaveAttribute('aria-valuenow', '0')

  await page
    .locator('article', { hasText: 'Kullanıcı hikâyelerini yaz' })
    .getByLabel(/^Durum:/)
    .selectOption('done')
  await expect(progressbar).toHaveAttribute('aria-valuenow', '50')

  await page.getByRole('link', { name: /Sonraki hafta/ }).click()
  await expect(page).toHaveURL('/derslerim/yazilim-gelistirme/hafta/2')
  await expect(page.locator('h1')).toContainText('2. Hafta')

  await page.getByRole('link', { name: /Önceki hafta/ }).click()
  await expect(page).toHaveURL('/derslerim/yazilim-gelistirme/hafta/1')
  await expect(progressbar).toHaveAttribute('aria-valuenow', '50')
})
