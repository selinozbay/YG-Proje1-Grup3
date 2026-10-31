import { test, expect } from '@playwright/test'

test.describe('E2E: Gizlilik ve KVKK sayfası', () => {
  test('giriş ekranından açılınca "Geri dön" giriş ekranına döndürür', async ({ page }) => {
    await page.goto('/giris')
    await page.getByRole('link', { name: 'Gizlilik ve KVKK' }).click()
    await expect(page).toHaveURL('/gizlilik')

    await page.getByRole('button', { name: 'Geri dön' }).click()
    await expect(page).toHaveURL(/\/giris/)
  })

  test('doğrudan açılınca "Geri dön" giriş ekranına gider', async ({ page }) => {
    await page.goto('/gizlilik')
    await page.getByRole('button', { name: 'Geri dön' }).click()
    await expect(page).toHaveURL(/\/giris/)
  })
})
