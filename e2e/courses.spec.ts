import { test, expect, type Page } from '@playwright/test'

// Derslerim sayfası (#14–#19): ders kartları, grafik, arama ve filtre (demo modu).

async function login(page: Page) {
  await page.goto('/giris')
  await page.fill('input[type="email"]', 'ogrenci@example.com')
  await page.fill('input[type="password"]', 'parola123')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/')
}

const courseCard = (page: Page, title: string) =>
  page.locator('[data-test="course-card"]', { hasText: title })

test.describe('E2E: Derslerim', () => {
  test('ders kartları ilerlemeyi gösterir, Görevlerim’deki değişiklik karta yansır', async ({
    page,
  }) => {
    await login(page)
    await page.goto('/derslerim')

    await expect(page.locator('[data-test="course-card"]')).toHaveCount(3)
    const card = courseCard(page, 'Yazılım Geliştirme')
    await expect(card.locator('[data-test="course-summary"]')).toHaveText('0 / 8 görev tamamlandı')
    await expect(card.locator('[data-test="course-status"]')).toHaveText('Başlanmadı')

    await page.goto('/gorevlerim')
    await page
      .locator('article', { hasText: 'Kullanıcı hikâyelerini yaz' })
      .getByLabel(/^Durum:/)
      .selectOption('done')

    await page.getByRole('link', { name: 'Derslerim' }).first().click()
    await expect(card.locator('[data-test="course-summary"]')).toHaveText('1 / 8 görev tamamlandı')
    await expect(card.locator('[data-test="course-status"]')).toHaveText('Devam ediyor')
    await expect(card.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '13')
  })

  test('kartta dersin görevleri açılır, başlık ders detayına götürür', async ({ page }) => {
    await login(page)
    await page.goto('/derslerim')

    const card = courseCard(page, 'Veri Tabanı Yönetim Sistemleri')
    await card.getByText('Görevleri göster').click()
    await expect(card.getByRole('list', { name: /görevleri$/ }).getByRole('listitem')).toHaveCount(
      8,
    )

    await card.getByRole('link', { name: 'Veri Tabanı Yönetim Sistemleri' }).click()
    await expect(page).toHaveURL('/derslerim/veri-tabani')
  })

  test('arama ve durum filtresi listeyi daraltır, sonuç yoksa temizlenebilir', async ({ page }) => {
    await login(page)
    await page.goto('/derslerim')

    await page.getByLabel('Ders ara').fill('veri')
    await expect(page.locator('[data-test="course-card"]')).toHaveCount(1)
    await expect(page.locator('[data-test="course-count"]')).toHaveText('1 / 3 ders')

    await page.getByLabel('Ders ara').fill('')
    await page.getByRole('button', { name: /^Tamamlandı/ }).click()
    await expect(page.getByText('Aramana uyan ders bulunamadı.')).toBeVisible()

    await page.getByRole('button', { name: 'Filtreleri temizle' }).click()
    await expect(page.locator('[data-test="course-card"]')).toHaveCount(3)
  })
})
