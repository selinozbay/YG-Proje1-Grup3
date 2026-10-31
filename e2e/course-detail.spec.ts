import { test, expect } from '@playwright/test'

// #39–#42: ders detayında hafta kartları, ilerleme ve zaman çizelgesi (demo modu).

test.describe('E2E: Ders detayı (#39)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/giris')
    await page.getByLabel('E-posta').fill('ogrenci@example.com')
    await page.getByLabel('Şifre', { exact: true }).fill('parola123')
    await page.getByRole('button', { name: 'Giriş yap' }).click()
    await expect(page).toHaveURL('/')
  })

  test('hafta kartları ve zaman çizelgesi görünür, karta tıklayınca hafta açılır', async ({
    page,
  }) => {
    await page.goto('/derslerim/veri-tabani')

    const cards = page.getByRole('list', { name: 'Dersin haftaları' }).getByRole('listitem')
    await expect(cards).toHaveCount(4)
    await expect(cards.first()).toContainText('1. Hafta')
    await expect(cards.first().getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
    await expect(page.locator('[aria-current="step"]')).toContainText('1. Hafta')

    await cards.nth(1).getByRole('link').click()
    await expect(page).toHaveURL('/derslerim/veri-tabani/hafta/2')
  })

  test('bir haftanın görevleri bitince çizelgede sonraki hafta şu anki hafta olur', async ({
    page,
  }) => {
    await page.goto('/derslerim/veri-tabani/hafta/1')
    const selects = page.locator('[data-test="status-select"]')
    await expect(selects.first()).toBeVisible()
    for (const select of await selects.all()) {
      await select.selectOption('done')
    }
    await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')

    // Sayfayı yenilemeden, uygulamanın içindeki bağlantıyla derse dönülür.
    await page.getByRole('link', { name: '← Veri Tabanı Yönetim Sistemleri' }).click()
    await expect(page).toHaveURL('/derslerim/veri-tabani')
    await expect(page.locator('[aria-current="step"]')).toContainText('2. Hafta')
    const firstCard = page
      .getByRole('list', { name: 'Dersin haftaları' })
      .getByRole('listitem')
      .first()
    await expect(firstCard).toContainText('Tamamlandı')
    await expect(firstCard.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
  })
})
