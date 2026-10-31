import { test, expect, type Page } from '@playwright/test'

// #4 ve #5: Giriş, kayıt ve şifremi unuttum ekranlarının kullanıcı gözünden denenmesi (demo modu).
// Gerçek Firebase yolu test/firebase-services.spec.ts içinde emülatörle denenir.

async function login(page: Page, email = 'ogrenci@example.com', password = 'parola123') {
  await page.goto('/giris')
  await page.getByLabel('E-posta').fill(email)
  await page.getByLabel('Şifre', { exact: true }).fill(password)
  await page.getByRole('button', { name: 'Giriş yap' }).click()
}

async function fillRegisterForm(page: Page) {
  await page.goto('/kayit')
  await page.getByLabel('Ad soyad').fill('Deneme Öğrenci')
  await page.getByLabel('E-posta').fill('yeni.ogrenci@example.com')
  await page.getByLabel('Şifre (en az 6 karakter)').fill('parola123')
}

test.describe('E2E: Kayıt ol (#4)', () => {
  test('KVKK aydınlatma metni onaylanmadan kayıt olunmaz', async ({ page }) => {
    await fillRegisterForm(page)
    await page.getByRole('button', { name: 'Kayıt ol' }).click()

    await expect(page).toHaveURL(/\/kayit$/)
  })

  test('bilgiler ve KVKK onayıyla kayıt olunur, ad ana sayfada görünür', async ({ page }) => {
    await fillRegisterForm(page)
    await page.getByRole('checkbox').check()
    await page.getByRole('button', { name: 'Kayıt ol' }).click()

    await expect(page).toHaveURL('/')
    await expect(page.locator('h1')).toContainText('Merhaba, Deneme Öğrenci')
  })
})

test.describe('E2E: Giriş yap (#4)', () => {
  test('6 karakterden kısa şifrede Türkçe uyarı gösterilir', async ({ page }) => {
    await login(page, 'ogrenci@example.com', '123')

    await expect(page.getByRole('alert')).toHaveText('Şifre en az 6 karakter olmalı.')
    await expect(page).toHaveURL(/\/giris/)
  })

  test('girişten sonra, giriş yapmadan açılmak istenen sayfaya dönülür', async ({ page }) => {
    await page.goto('/gorevlerim')
    await expect(page).toHaveURL(/\/giris\?redirect=/)

    await page.getByLabel('E-posta').fill('ogrenci@example.com')
    await page.getByLabel('Şifre', { exact: true }).fill('parola123')
    await page.getByRole('button', { name: 'Giriş yap' }).click()

    await expect(page).toHaveURL('/gorevlerim')
  })

  test('giriş yapmış kullanıcı giriş sayfasını açınca ana sayfaya yönlenir', async ({ page }) => {
    await login(page)
    await expect(page).toHaveURL('/')

    await page.goto('/giris')
    await expect(page).toHaveURL('/')
  })

  test('çıkış yapınca giriş sayfasına dönülür ve sayfalar yeniden kapanır', async ({ page }) => {
    await login(page)
    await expect(page).toHaveURL('/')

    // #35: çıkış önce onay penceresi açar; "Hayır" kalınca sayfada kalınır.
    await page.getByRole('button', { name: 'Çıkış yap', exact: true }).click()
    const dialog = page.getByRole('dialog', { name: 'Çıkış yapmak istediğinize emin misiniz?' })
    await expect(dialog).toBeVisible()
    await dialog.getByRole('button', { name: 'Hayır' }).click()
    await expect(dialog).toBeHidden()
    await expect(page).toHaveURL('/')

    await page.getByRole('button', { name: 'Çıkış yap', exact: true }).click()
    await dialog.getByRole('button', { name: 'Evet, çıkış yap' }).click()
    await expect(page).toHaveURL(/\/giris/)

    await page.goto('/profil')
    await expect(page).toHaveURL(/\/giris/)
  })
})

test.describe('E2E: Şifremi unuttum (#5)', () => {
  test('e-posta girilince sıfırlama bağlantısının gönderildiği bildirilir', async ({ page }) => {
    await page.goto('/giris')
    await page.getByRole('link', { name: 'Şifremi unuttum' }).click()
    await expect(page).toHaveURL('/sifremi-unuttum')

    await page.getByLabel('E-posta').fill('ogrenci@example.com')
    await page.getByRole('button', { name: 'Bağlantı gönder' }).click()

    await expect(
      page.getByText('Bu adrese kayıtlı bir hesap varsa şifre sıfırlama bağlantısı gönderildi.'),
    ).toBeVisible()
  })
})
