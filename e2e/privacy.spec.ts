import { test, expect } from '@playwright/test'

test.describe('E2E: Gizlilik ve KVKK sayfası', () => {
  test('giriş ekranından açılınca "Geri dön" giriş ekranına döndürür', async ({ page }) => {
    await page.goto('/giris')
    await page.getByRole('link', { name: 'Gizlilik ve KVKK' }).click()
    await expect(page).toHaveURL('/gizlilik')

    await page.getByRole('button', { name: 'Geri dön' }).click()
    await expect(page).toHaveURL(/\/giris/)
  })

  test('iletişim e-postası ve başvuru bilgisi gösterilir (#58)', async ({ page }) => {
    await page.goto('/gizlilik')
    const contact = page.locator('[data-test="contact-email"]')
    await expect(contact).toHaveText('projemeil@gmail.com')
    await expect(contact).toHaveAttribute('href', 'mailto:projemeil@gmail.com')
    await expect(page.getByRole('heading', { name: '9. Başvuru yolu' })).toBeVisible()
    await expect(page.getByText('henüz eklenmedi')).toHaveCount(0)
  })

  test('doğrudan açılınca "Geri dön" giriş ekranına gider', async ({ page }) => {
    await page.goto('/gizlilik')
    await page.getByRole('button', { name: 'Geri dön' }).click()
    await expect(page).toHaveURL(/\/giris/)
  })
})
