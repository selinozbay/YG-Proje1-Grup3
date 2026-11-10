import { test, expect, type Locator, type Page } from '@playwright/test'

// #112 (B-08): karanlık temada odaktaki form alanı beyaza dönüyor, yazı okunmuyordu.

async function loginDark(page: Page) {
  await page.goto('/giris')
  await page.getByLabel('E-posta').fill('ogrenci@example.com')
  await page.getByLabel('Şifre', { exact: true }).fill('parola123')
  await page.getByRole('button', { name: 'Giriş yap' }).click()
  await expect(page).toHaveURL('/')
  await page.goto('/profil')
  await page.locator('[data-test="theme-option"]', { hasText: 'Karanlık' }).click()
  await expect(page.locator('html')).toHaveClass(/dark/)
}

// Yazı rengi ile zemin arasındaki WCAG kontrast oranı.
function contrast(field: Locator) {
  return field.evaluate((el) => {
    const lum = (c: string) => {
      const [r, g, b] = c
        .match(/[\d.]+/g)!
        .slice(0, 3)
        .map((v) => {
          const x = Number(v) / 255
          return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4
        })
      return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!
    }
    const s = getComputedStyle(el)
    const [hi, lo] = [lum(s.color), lum(s.backgroundColor)].sort((a, b) => b - a)
    return (hi! + 0.05) / (lo! + 0.05)
  })
}

// Zemin rengi 0,15 sn'lik geçişle değiştiği için oran geçiş bitene kadar beklenir.
// Zemin rengi 0,15 sn'lik geçişle değişir; geçiş sırasında ölçülürse hata gözden kaçar.
// Bu yüzden ölçüm geçiş bittikten sonra yapılır.
async function expectReadable(field: Locator) {
  await expect(field).toBeFocused()
  await field.page().waitForTimeout(500)
  expect(await contrast(field)).toBeGreaterThanOrEqual(4.5)
}

test.describe('E2E: Karanlık temada form alanları (#112)', () => {
  test('Görevlerim: arama kutusu odaktayken yazı okunur', async ({ page }) => {
    await loginDark(page)
    await page.goto('/gorevlerim')

    const search = page.getByLabel('Görev ara')
    await search.click()
    await search.fill('rapor')
    await expectReadable(search)
  })

  test('Görevlerim: Ders ve Hafta seçiminden sonra seçilen değer okunur', async ({ page }) => {
    await loginDark(page)
    await page.goto('/gorevlerim')

    for (const [label, option] of [
      ['Ders', 'Yazılım Geliştirme'],
      ['Hafta', '1. hafta'],
    ] as const) {
      const select = page.getByLabel(label, { exact: true })
      await select.focus()
      await select.selectOption({ label: option })
      await expectReadable(select)
    }
  })

  test('Derslerim: arama kutusu odaktayken yazı okunur', async ({ page }) => {
    await loginDark(page)
    await page.goto('/derslerim')

    const search = page.getByLabel('Ders ara')
    await search.click()
    await search.fill('web')
    await expectReadable(search)
  })
})
