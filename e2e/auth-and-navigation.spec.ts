import { test, expect } from '@playwright/test'

test.describe('E2E: Giriş ve Sayfa Gezinimi (Demo Modu)', () => {
  test('giriş yapmamış kullanıcıyı /giris sayfasına yönlendirir', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/.*giris/)
    await expect(page.locator('h1')).toContainText('Giriş yap')
  })

  test('demo modunda geçerli bilgilerle giriş yapıp ana sayfaya erişir', async ({ page }) => {
    await page.goto('/giris')

    // Formu doldur
    await page.fill('input[type="email"]', 'ogrenci@example.com')
    await page.fill('input[type="password"]', 'parola123')
    await page.click('button[type="submit"]')

    // Ana sayfaya yönlenmeli
    await expect(page).toHaveURL('/')
    await expect(page.locator('h1')).toContainText('Merhaba')

    // Demo banner görünür olmalı
    await expect(page.getByText('Demo modu')).toBeVisible()
  })

  test('menüden sayfalar arası geçiş yapılabilir', async ({ page }) => {
    // Giriş yap
    await page.goto('/giris')
    await page.fill('input[type="email"]', 'ogrenci@example.com')
    await page.fill('input[type="password"]', 'parola123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/')

    // Derslerim sayfasına tıkla
    await page.click('nav >> text=Derslerim')
    await expect(page).toHaveURL('/derslerim')
    await expect(page.locator('h1')).toContainText('Derslerim')

    // Görevlerim sayfasına tıkla
    await page.click('nav >> text=Görevlerim')
    await expect(page).toHaveURL('/gorevlerim')
    await expect(page.locator('h1')).toContainText('Görevlerim')
  })
})
