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
  await page.getByLabel('Öğrenci e-postası').fill('123456@ogr.ktu.edu.tr')
  await page.getByLabel('Şifre', { exact: true }).fill('Parola-2026')
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

  test('ad soyad yalnızca boşluksa kayıt olunmaz, Türkçe uyarı gösterilir (#71)', async ({
    page,
  }) => {
    await fillRegisterForm(page)
    await page.getByLabel('Ad soyad').fill('   ')
    await page.getByRole('checkbox').check()
    await page.getByRole('button', { name: 'Kayıt ol' }).click()

    await expect(page.getByRole('alert')).toHaveText('Ad soyad alanını doldurun.')
    await expect(page).toHaveURL(/\/kayit$/)
  })

  for (const email of ['ali@ogr.ktu.edu.tr', '123456@gmail.com']) {
    test(`öğrenci e-postası olmayan ${email} ile kayıt olunmaz (#6)`, async ({ page }) => {
      await fillRegisterForm(page)
      await page.getByLabel('Öğrenci e-postası').fill(email)
      await page.getByRole('checkbox').check()
      await page.getByRole('button', { name: 'Kayıt ol' }).click()

      await expect(page.getByRole('alert')).toHaveText(
        'Öğrenci e-postanızı girin (ör. 123456@ogr.ktu.edu.tr).',
      )
      await expect(page).toHaveURL(/\/kayit$/)
    })
  }

  test('şifre gücü yazdıkça değişir, zayıf ve orta şifreyle kayıt olunmaz (#7)', async ({
    page,
  }) => {
    await fillRegisterForm(page)
    const password = page.getByLabel('Şifre', { exact: true })

    await password.fill('parola')
    await expect(page.getByText('Şifre gücü: Zayıf')).toBeVisible()
    await expect(page.getByText('En az 10 karakter kullanın.')).toBeVisible()
    await password.fill('parola123')
    await expect(page.getByText('Şifre gücü: Orta')).toBeVisible()
    await password.fill('Parola-2026')
    await expect(page.getByText('Şifre gücü: Güçlü')).toBeVisible()

    await page.getByRole('checkbox').check()
    for (const weakOrMedium of ['parolaparola', 'parola123']) {
      await password.fill(weakOrMedium)
      await page.getByRole('button', { name: 'Kayıt ol' }).click()

      await expect(page.getByRole('alert')).toContainText('Şifre yeterince güçlü değil.')
      await expect(page).toHaveURL(/\/kayit$/)
    }
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

    await page.getByRole('button', { name: 'Çıkış yap' }).click()
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
