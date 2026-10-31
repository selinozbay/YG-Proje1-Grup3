import { test, expect } from '@playwright/test'

// #72: hafta adresinde yalnızca tam sayı hafta numarası kabul edilir.

test.describe('E2E: Hafta adresi (#72)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/giris')
    await page.getByLabel('E-posta').fill('ogrenci@example.com')
    await page.getByLabel('Şifre', { exact: true }).fill('parola123')
    await page.getByRole('button', { name: 'Giriş yap' }).click()
    await expect(page).toHaveURL('/')
  })

  test('geçerli hafta numarasıyla hafta detayı açılır', async ({ page }) => {
    await page.goto('/derslerim/veri-tabani/hafta/2')
    await expect(page.locator('h1')).toContainText('2. Hafta')
  })

  for (const weekNo of ['2.0', '02', '9', 'abc']) {
    test(`"${weekNo}" hafta numarasında "Hafta bulunamadı" gösterilir`, async ({ page }) => {
      await page.goto(`/derslerim/veri-tabani/hafta/${weekNo}`)
      await expect(page.locator('h1')).toHaveText('Hafta bulunamadı')
    })
  }
})
