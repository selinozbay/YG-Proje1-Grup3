import { test, expect, type Page } from '@playwright/test'

// Ana Sayfa (#9–#13, #48): genel ilerleme, yaklaşan görevler, bu haftanın dersleri (demo modu).
// "Bu hafta" ve "yaklaşan" bugüne bağlı olduğu için saat 31 Ekim 2026'ya sabitlenir.

async function login(page: Page) {
  await page.clock.setFixedTime(new Date('2026-10-31T10:00:00'))
  await page.goto('/giris')
  await page.fill('input[type="email"]', 'ogrenci@example.com')
  await page.fill('input[type="password"]', 'parola123')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/')
}

test.describe('E2E: Ana Sayfa', () => {
  test('yaklaşan görev tamamlanınca genel ilerleme ve ders kartı güncellenir', async ({ page }) => {
    await login(page)

    await expect(page.locator('[data-test="overall-summary"]')).toHaveText('0 / 24 görev')
    const first = page.locator('[data-test="upcoming-task"]').first()
    await expect(first).toContainText('Veri Tabanı Yönetim Sistemleri, 3. hafta')

    await first.getByLabel(/^Durum:/).selectOption('done')

    await expect(page.locator('[data-test="overall-summary"]')).toHaveText('1 / 24 görev')
    await expect(page.locator('[data-test="overall-percent"]')).toHaveText('%4')
    const vtCourse = page.locator('[data-test="home-course"]', { hasText: 'Veri Tabanı' })
    await expect(vtCourse.locator('[data-test="course-summary"]')).toHaveText('1 / 8')
    await expect(page.locator('[data-test="term-week"]').nth(2)).toContainText('1 / 6 görev')

    await page.reload()
    await expect(page.locator('[data-test="overall-summary"]')).toHaveText('1 / 24 görev')
  })

  test('bu haftanın dersinden hafta detayına gidilir', async ({ page }) => {
    await login(page)

    const items = page.locator('[data-test="this-week-item"]')
    await expect(items).toHaveCount(3)
    await expect(items.first()).toContainText('3. hafta: Geliştirme ve Test')

    await page.getByRole('link', { name: 'Yazılım Geliştirme, 3. haftaya git' }).click()
    await expect(page).toHaveURL('/derslerim/yazilim-gelistirme/hafta/3')
  })

  test('gün cetvelinde bugün işaretlidir; çizgi dairelere değmez, etiket kartta kalır (#116)', async ({
    page,
  }) => {
    // Çizgi açılışta aşağı doğru çizildiği için ölçüm animasyonsuz yapılır.
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await login(page)
    const card = page.locator('section', { has: page.locator('[data-test="term-week"]') })
    const line = page.locator('[data-test="today-marker"]')
    const label = page.locator('[data-test="today-label"]')
    await expect(page.locator('[data-test="term-week"] a > svg')).toHaveCount(24)

    // Dönem 28 gün; her günün ortasında bir çentik.
    await expect(page.locator('[data-test="day-tick"]')).toHaveCount(28)

    for (const width of [375, 768, 1024, 1280]) {
      await page.setViewportSize({ width, height: 900 })
      // Dönem: 15 Ekim – 11 Kasım. İlk gün etiket çizginin sağına, ortada ortalı, sona doğru ve
      // teslim günü soluna açılır. 16 ve 24 Ekim'de çizgi, dairelerin hizasına düşen günlerdir.
      for (const [time, anchor] of [
        ['2026-10-15T18:00:00', 'start'],
        ['2026-10-16T12:00:00', 'start'],
        ['2026-10-24T12:00:00', 'center'],
        ['2026-10-25T12:00:00', 'center'],
        ['2026-10-29T12:00:00', 'center'],
        ['2026-11-10T18:00:00', 'end'],
        ['2026-11-11T18:00:00', 'end'],
      ] as const) {
        await page.clock.setFixedTime(new Date(time))
        await page.reload()
        await expect(label).toBeVisible()
        await expect(label).toHaveAttribute('data-anchor', anchor)
        const c = (await card.boundingBox())!
        for (const [name, part] of [
          ['çizgi', line],
          ['etiket', label],
        ] as const) {
          const box = (await part.boundingBox())!
          expect(box.x, `${width} px, ${time}: ${name} sol kenar`).toBeGreaterThanOrEqual(c.x)
          expect(box.x + box.width, `${width} px, ${time}: ${name} sağ kenar`).toBeLessThanOrEqual(
            c.x + c.width,
          )
        }
        // Çizgi hiçbir görev dairesiyle kesişmez; etiketin üstünde cetvel, altında tablo ile
        // arasında boşluk kalır.
        const m = await page.evaluate(() => {
          const l = document.querySelector('[data-test="today-marker"]')!.getBoundingClientRect()
          const t = document.querySelector('[data-test="today-label"]')!.getBoundingClientRect()
          const cells = [...document.querySelectorAll('[data-test="term-week"] a')]
          const crossing = cells
            .flatMap((a) => [...a.querySelectorAll('svg')])
            .filter((svg) => {
              const b = svg.getBoundingClientRect()
              return b.left < l.right && b.right > l.left && b.top < l.bottom && b.bottom > l.top
            }).length
          return {
            crossing,
            gapAbove: t.top - l.top, // çizginin başı cetvelin hemen üstünde
            gapBelow: cells[0]!.getBoundingClientRect().top - t.bottom,
          }
        })
        expect(m.crossing, `${width} px, ${time}: çizgiyle kesişen daire`).toBe(0)
        expect(m.gapAbove, `${width} px, ${time}: etiketin üstü`).toBeGreaterThanOrEqual(16)
        expect(m.gapBelow, `${width} px, ${time}: etiketin altı`).toBeGreaterThanOrEqual(8)
      }
    }

    // Dönem bittikten sonra cetvel kalır, bugün işareti görünmez.
    await page.clock.setFixedTime(new Date('2026-11-12T10:00:00'))
    await page.reload()
    await expect(page.locator('[data-test="day-tick"]').first()).toBeVisible()
    await expect(line).toHaveCount(0)
    await expect(label).toHaveCount(0)
  })
})
