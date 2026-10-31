# Etkileşimli Ders Deneyimi Panosu

**Yazılım Geliştirme dersi · Proje 1 · Grup 3** (`YG-Proje1-Grup3`)

Öğrencilerin aldıkları dersleri, haftalık ders içeriklerini, öğrenme hedeflerini, görevlerini ve
kendi ilerlemelerini tek bir yerden, etkileşimli bir web arayüzüyle takip edebildiği uygulama.

- **Canlı demo:** https://ders-ogrenci-bilgi-ekip.web.app
- **Görev panosu (GitHub Projects):** https://github.com/users/selinozbay/projects/1
- **Teslim tarihi:** 11 Kasım 2026
  ([Teslim milestone'u](https://github.com/selinozbay/YG-Proje1-Grup3/milestone/1))

## İçindekiler

1. [Projenin amacı](#projenin-amacı)
2. [Ekip ve roller](#ekip-ve-roller)
3. [Özellikler](#özellikler)
4. [Sayfalar](#sayfalar)
5. [Kullanılan teknolojiler](#kullanılan-teknolojiler)
6. [Kurulum ve çalıştırma](#kurulum-ve-çalıştırma)
7. [Komutlar](#komutlar)
8. [Yayınlama (Firebase Hosting)](#yayınlama-firebase-hosting)
9. [Proje yapısı: hangi dosya ne işe yarar?](#proje-yapısı-hangi-dosya-ne-işe-yarar)
10. [Veri modeli ve veri akışı](#veri-modeli-ve-veri-akışı)
11. [Çalışma düzeni: GitHub Projects](#çalışma-düzeni-github-projects)
12. [Gizlilik ve KVKK](#gizlilik-ve-kvkk)
13. [Ekran görüntüleri](#ekran-görüntüleri)
14. [Bilinen eksikler](#bilinen-eksikler)
15. [Teslim dosyaları](#teslim-dosyaları)

## Projenin amacı

Bir öğrenci, aldığı derslerin hangi haftasında olduğunu, o hafta neyi öğrenmesi gerektiğini ve
hangi görevleri bitirdiğini çoğu zaman farklı yerlerden takip eder. Bu proje, bu bilgileri tek bir
panoda toplar:

- Her ders bir kart olarak görünür; dersin içinde haftalar ve her haftanın öğrenme hedefleri yer
  alır.
- Her haftanın görevleri vardır; öğrenci görevin durumunu (yapılacak, devam ediyor, tamamlandı)
  değiştirir.
- Görevler duruma, derse ve haftaya göre filtrelenir, anahtar sözcükle aranır.
- Öğrencinin genel ve ders bazındaki ilerlemesi görsel olarak gösterilir.

Amaç klasik bir "yapılacaklar listesi" değil; ders akışını ve öğrenme ilerlemesini anlamlı biçimde
sunan bir ders deneyimi panosudur. Projenin teknik odağı web arayüzü, istemci tarafı etkileşim,
responsive tasarım ve kullanıcı deneyimidir.

### Hedef kullanıcılar

| Kullanıcı      | İhtiyaç                                                                                 |
| -------------- | --------------------------------------------------------------------------------------- |
| Öğrenci        | Ders haftalarını, görevleri ve ilerlemesini kolayca görmek; tamamlananları işaretlemek. |
| Ders sorumlusu | Ders akışının anlaşılır görünmesi ve öğrencinin ne yapacağını kolayca takip edebilmesi. |

## Ekip ve roller

Tüm ekip üyeleri aynı zamanda geliştiricidir.

| Üye          | Rol                                 |
| ------------ | ----------------------------------- |
| Selin Özbay  | Lider + Geliştirici                 |
| Cihan Bayram | Analist + Geliştirici               |
| Tahir Taş    | Test / Kalite + Geliştirici         |
| Ali Tekçe    | Dokümantasyon / Sunum + Geliştirici |

## Özellikler

| Özellik                                                        | Nerede                   | Durum          |
| -------------------------------------------------------------- | ------------------------ | -------------- |
| E-posta ve şifreyle kayıt, giriş, şifre sıfırlama              | Giriş / Kayıt            | Geliştiriliyor |
| Giriş yapmayan kullanıcının uygulamaya girememesi              | Tüm sayfalar             | Hazır          |
| Karanlık / aydınlık tema (seçim hatırlanır, açılışta aydınlık) | Üst menü                 | Hazır          |
| Masaüstünde sabit sol menü, mobilde soldan açılan menü         | Tüm sayfalar             | Hazır          |
| Gizlilik ve KVKK aydınlatma metni                              | Gizlilik                 | Hazır          |
| Hesabı ve tüm verileri silme                                   | Profil                   | Geliştiriliyor |
| Demo modu (Firebase olmadan çalışma)                           | Tüm sayfalar             | Hazır          |
| Klavyeyle kullanım, "İçeriğe geç" bağlantısı                   | Tüm sayfalar             | Hazır          |
| Birden fazla ders, ders kartları                               | Derslerim                | Geliştiriliyor |
| Haftalık ders kartları ve öğrenme hedefleri                    | Ders ve hafta detayı     | Geliştiriliyor |
| Görev listesi ve durum değiştirme                              | Görevlerim, hafta detayı | Geliştiriliyor |
| Duruma, derse ve haftaya göre filtre; arama                    | Görevlerim               | Geliştiriliyor |
| Genel ve ders bazında ilerleme göstergesi                      | Ana Sayfa                | Geliştiriliyor |

## Sayfalar

| Sayfa            | Adres                               | Giriş gerekir mi? | İçerik                                               |
| ---------------- | ----------------------------------- | ----------------- | ---------------------------------------------------- |
| Ana Sayfa        | `/`                                 | Evet              | Genel ilerleme, yaklaşan görevler, bu haftanın dersi |
| Derslerim        | `/derslerim`                        | Evet              | Ders kartları                                        |
| Ders detayı      | `/derslerim/:dersId`                | Evet              | Dersin haftaları                                     |
| Hafta detayı     | `/derslerim/:dersId/hafta/:haftaNo` | Evet              | Öğrenme hedefleri ve o haftanın görevleri            |
| Görevlerim       | `/gorevlerim`                       | Evet              | Tüm görevler, filtre ve arama                        |
| Profil           | `/profil`                           | Evet              | Hesap bilgileri, tercihler, hesabı silme             |
| Giriş yap        | `/giris`                            | Hayır             | E-posta ve şifreyle giriş                            |
| Kayıt ol         | `/kayit`                            | Hayır             | Yeni hesap, KVKK onayı                               |
| Şifremi unuttum  | `/sifremi-unuttum`                  | Hayır             | Şifre sıfırlama e-postası                            |
| Gizlilik ve KVKK | `/gizlilik`                         | Hayır             | Aydınlatma metni                                     |
| Bulunamadı       | Diğer tüm adresler                  | Hayır             | 404 sayfası                                          |

## Kullanılan teknolojiler

| Teknoloji                                                            | Sürüm | Projede ne için kullanılıyor                                          |
| -------------------------------------------------------------------- | ----- | --------------------------------------------------------------------- |
| [Vue](https://vuejs.org/)                                            | 3.5   | Arayüzü bileşenlere bölerek oluşturmak (HTML + CSS + TypeScript)      |
| [TypeScript](https://www.typescriptlang.org/)                        | 6.0   | JavaScript'e tip denetimi eklemek; hataları çalıştırmadan yakalamak   |
| [Vite](https://vite.dev/)                                            | 8.3   | Geliştirme sunucusu ve yayın için derleme                             |
| [Vue Router](https://router.vuejs.org/)                              | 5.4   | Sayfalar arası geçiş, giriş yapılmadan sayfaların açılmasını önleme   |
| [Pinia](https://pinia.vuejs.org/)                                    | 4.1   | Sayfaların ortak kullandığı veri: oturum, ilerleme, tema              |
| [Tailwind CSS](https://tailwindcss.com/)                             | 4.3   | Stil, responsive tasarım ve karanlık tema                             |
| [Firebase Authentication](https://firebase.google.com/docs/auth)     | 13.0  | E-posta ve şifreyle kayıt, giriş, şifre sıfırlama                     |
| [Cloud Firestore](https://firebase.google.com/docs/firestore)        | 13.0  | Kullanıcının görev durumlarını saklamak                               |
| [Firebase Hosting](https://firebase.google.com/docs/hosting)         | —     | Uygulamayı internette yayınlamak                                      |
| ESLint, Oxlint, Prettier                                             | —     | Kod hatalarını yakalamak ve herkesin aynı biçimde kod yazması         |
| [Vitest](https://vitest.dev/)                                        | 5.0   | Birim ve bileşen testleri                                             |
| [Vue Test Utils](https://test-utils.vuejs.org/)                      | 2.5   | Bileşenleri testte çalıştırıp çıktısını kontrol etmek                 |
| [Playwright](https://playwright.dev/)                                | 1.64  | Gerçek tarayıcıda uçtan uca (E2E) testler                             |
| [Firebase Emulator](https://firebase.google.com/docs/emulator-suite) | —     | Firestore kurallarını gerçek veritabanına dokunmadan test etmek       |
| [GitHub Actions](https://docs.github.com/actions)                    | —     | Her push ve PR'da lint, tip kontrolü, derleme ve testleri çalıştırmak |
| GitHub Projects                                                      | —     | Görev takibi ve iş bölümü (issue'lar ve pano)                         |
| Git ve GitHub                                                        | —     | Sürüm kontrolü ve bireysel katkının kaydı                             |

## Kurulum ve çalıştırma

### Gereksinimler

- **Node.js 22.18 veya üstü** (önerilen: 24 LTS). Sürümünüzü `node -v` ile kontrol edin;
  [nodejs.org](https://nodejs.org/) adresinden indirebilirsiniz.
- **npm** (Node.js ile birlikte gelir)
- **Git**
- Yalnızca yayınlamak ve Firebase testleri için: **Firebase CLI** (`npm install -g firebase-tools`)
- Yalnızca Firebase testleri için: **Java 21 veya üstü** (Firebase emülatörleri Java ile çalışır)

### Adımlar

1. Repoyu bilgisayarınıza indirin:

   ```bash
   git clone https://github.com/selinozbay/YG-Proje1-Grup3.git
   cd YG-Proje1-Grup3
   ```

2. Paketleri kurun:

   ```bash
   npm install
   ```

3. Firebase ayarlarını yapın (isteğe bağlı). `.env.example` dosyasını `.env.local` adıyla
   kopyalayın ve değerleri doldurun. Değerleri ekipten isteyin; bu dosya **asla** GitHub'a
   gönderilmez.

   ```bash
   # Windows (PowerShell)
   Copy-Item .env.example .env.local
   # macOS / Linux
   cp .env.example .env.local
   ```

   Bu adımı atlarsanız uygulama **demo modunda** açılır (aşağıya bakın).

4. Uygulamayı başlatın ve tarayıcıda http://localhost:5173 adresini açın:

   ```bash
   npm run dev
   ```

### Demo modu

Firebase değerleri yoksa (ya da `npm run dev:demo` ile başlatıldıysa) uygulama Firebase'e hiç
bağlanmadan çalışır. Ekranın üstünde sarı bir **"Demo modu"** uyarısı görünür.

- Herhangi bir e-posta ve en az 6 karakterlik herhangi bir şifreyle kayıt olunup giriş yapılabilir.
  Şifre saklanmaz ve kontrol edilmez.
- Görev durumları yalnızca o tarayıcıda (`localStorage`) tutulur.
- Bu sayede repo, Firebase anahtarları olmadan da kurulup denenebilir.

### Test hesabı

Hazır bir test hesabı yoktur.

- **Firebase modunda:** "Kayıt ol" sayfasından kendi e-posta adresinizle hesap açın. Şifre olarak
  e-posta hesabınızın şifresini değil, **bu uygulamaya özel yeni bir şifre** belirleyin. Gerçek
  e-posta kullanırsanız "Şifremi unuttum" e-postası da size ulaşır.
- **Demo modunda:** `deneme@example.com` gibi uydurma bir adres ve en az 6 karakterlik bir şifre
  yeterlidir.
- Hesapları Firebase Console → Authentication → Users bölümünden görebilir, silebilirsiniz.

## Komutlar

| Komut                   | Ne yapar                                                                                    |
| ----------------------- | ------------------------------------------------------------------------------------------- |
| `npm run dev`           | Geliştirme sunucusunu başlatır (http://localhost:5173). Kaydedince sayfa yenilenir          |
| `npm run dev:demo`      | Firebase değerleri olsa bile uygulamayı demo modunda başlatır                               |
| `npm run build`         | Tip kontrolü yapar ve yayına hazır dosyaları `dist/` klasörüne üretir                       |
| `npm run preview`       | `dist/` klasöründeki derlenmiş uygulamayı yerelde açar                                      |
| `npm test`              | Vitest ile birim ve bileşen testlerini çalıştırır                                           |
| `npm run test:unit`     | Vitest'i izleme (watch) modunda başlatır                                                    |
| `npm run test:e2e`      | Playwright ile uçtan uca (E2E) tarayıcı testlerini koşturur                                 |
| `npm run test:firebase` | Firebase emülatörlerini açıp kural, giriş ve veri testlerini koşturur ([Testler](#testler)) |
| `npm run lint`          | Oxlint ve ESLint ile kodu denetler, düzeltebildiklerini düzeltir                            |
| `npm run type-check`    | Yalnızca TypeScript tip kontrolü yapar                                                      |
| `npm run format`        | `src/` klasöründeki kodu Prettier ile biçimlendirir                                         |
| `npm run deploy`        | Derler ve Firebase'e yayınlar (Hosting + Firestore kuralları)                               |

Commit atmadan önce `npm run lint`, `npm run type-check` ve `npm test` komutlarının hatasız
bittiğinden emin olun.

### Testler

- **Birim ve bileşen testleri** (`src/**/__tests__/`): ders kataloğu ve ilerleme store'larının
  hesapları, kayıt başarısız olunca durumun geri alınması, bir görevin durumu değişince farklı
  sayfaların birlikte güncellenmesi, `AppIcon` bileşeni. Çalıştırma: `npm test`. Testler her zaman
  demo modunda çalışır; `.env.local` dolu olsa bile gerçek Firebase'e bağlanmaz.
- **Uçtan uca (E2E) testler** (`e2e/`): kayıt (KVKK onayı zorunlu), giriş, hatalı şifre uyarısı,
  şifremi unuttum, çıkış, giriş yapmayanın giriş sayfasına yönlenmesi ve girişten sonra istediği
  sayfaya dönmesi, menüden sayfa geçişleri. Playwright uygulamayı `npm run dev:demo` ile kendisi
  açar.
  - İlk seferde tarayıcıyı kurun: `npx playwright install chromium`
  - Çalıştırmadan önce açık bir `npm run dev` varsa kapatın. Kapatmazsanız Playwright onu
    kullanır ve Firebase modunda açık olduğu için demo girişi yapan testler başarısız olur.
  - Çalıştırma: `npm run test:e2e`
- **Firebase testleri** (`test/`): gerçek Firebase yolunu, canlı projeye dokunmadan bilgisayarda
  açılan Auth ve Firestore emülatörlerine karşı dener (Java 21+ ve Firebase CLI gerekir).
  - Güvenlik kuralları: giriş yapmayan hiçbir belgeye, giriş yapan yalnızca kendi belgesine
    erişebilir.
  - Giriş ve kayıt: kayıt, aynı e-postayla ikinci kayıt, kısa şifre, doğru ve yanlış şifreyle giriş,
    oturum değişikliği; hata mesajlarının Türkçe olması.
  - Şifremi unuttum: sıfırlama e-postasının gönderilmesi, kayıtlı olmayan e-postada hesabın
    varlığının belli edilmemesi.
  - Görev durumları: kaydedilmesi, başka kullanıcının verisinin okunamaması, hesap silinince
    verinin ve hesabın silinmesi (KVKK).
  - Çalıştırma: `npm run test:firebase` (emülatörleri açar, testleri koşar, kapatır)

**Otomatik kontrol (CI):** `main`'e her push'ta ve `main`'e açılan her PR'da GitHub Actions dört
kontrol çalıştırır: lint + tip kontrolü + derleme, birim testleri, E2E testleri ve Firebase
testleri.
Sonuç PR sayfasında ve repodaki **Actions** sekmesinde görünür. Kontrollerden biri kırmızıysa PR
birleştirilmeden önce düzeltilir.

## Yayınlama (Firebase Hosting)

1. Firebase projesine erişiminiz olmalı: proje sahibi sizi Firebase Console → Proje ayarları →
   Kullanıcılar ve izinler bölümünden ekler.
2. Firebase CLI ile giriş yapın: `firebase login`
3. `.env.local` dosyanızın dolu olduğundan emin olun (yoksa site demo modunda yayınlanır).
4. Yayınlayın:

   ```bash
   npm run deploy
   ```

Site https://ders-ogrenci-bilgi-ekip.web.app adresinde yayınlanır.

## Proje yapısı: hangi dosya ne işe yarar?

```text
YG-Proje1-Grup3/
├── .github/            PR şablonu ve CI ayarı (workflows/test.yml)
├── .vscode/            Ortak VS Code ayarları
├── docs/               Proje raporu, kullanıcı dokümanı, ekran görüntüleri
├── e2e/                Uçtan uca (Playwright) testler
├── presentation/       Sunum dosyası
├── public/             Olduğu gibi yayınlanan dosyalar (favicon)
├── src/                Uygulamanın kaynak kodu
│   ├── assets/         Genel CSS
│   ├── components/     Tekrar kullanılan bileşenler
│   │   ├── auth/       Giriş/kayıt formlarının parçaları
│   │   ├── common/     Her sayfada kullanılabilen küçük bileşenler
│   │   ├── layout/     Menü, üst bar, alt bilgi, tema düğmesi
│   │   ├── lessons/    Ders ve hafta kartları (geliştirilecek)
│   │   └── tasks/      Görev kartı, filtre, arama (geliştirilecek)
│   ├── composables/    Tekrar kullanılan mantık (useMediaQuery)
│   ├── data/           Ders kataloğu (JSON)
│   ├── firebase/       Firebase bağlantısı
│   ├── layouts/        Sayfa çerçeveleri
│   ├── router/         Sayfa adresleri ve giriş kontrolü
│   ├── services/       Veri okuma/yazma (Firebase veya demo modu)
│   ├── stores/         Ortak veri (Pinia)
│   ├── types/          TypeScript tipleri
│   ├── views/          Sayfalar
│   ├── App.vue         Kök bileşen
│   ├── config.ts       Ortak sabitler
│   └── main.ts         Uygulamanın başladığı yer
├── test/               Firestore güvenlik kuralı testleri
└── (kök dizindeki ayar dosyaları — aşağıda)
```

Birim testleri, test ettikleri dosyanın yanındaki `__tests__/` klasöründe durur (ör.
`src/stores/__tests__/progress.spec.ts`).

### Kök dizindeki dosyalar

| Dosya                                                                              | Ne işe yarar                                                                                                      |
| ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `index.html`                                                                       | Uygulamanın tek HTML sayfası. Dili Türkçe ayarlar, tema yanıp sönmesin diye temayı en başta uygular               |
| `package.json`                                                                     | Kullanılan paketler ve `npm run ...` komutları                                                                    |
| `package-lock.json`                                                                | Paketlerin tam sürümleri; herkes aynı sürümü kurar. Elle düzenlenmez                                              |
| `vite.config.ts`                                                                   | Vite ayarları: Vue ve Tailwind eklentileri, `@/` kısayolunun `src/` klasörünü göstermesi                          |
| `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `tsconfig.vitest.json` | TypeScript ayarları (uygulama kodu, ayar dosyaları ve testler için ayrı ayrı)                                     |
| `vitest.config.ts`                                                                 | Birim testi ayarları: tarayıcı benzeri ortam (jsdom), testlerde her zaman demo modu                               |
| `vitest.rules.config.ts`                                                           | Firestore kural testlerinin ayrı ayarı (Node ortamı)                                                              |
| `vitest.emulator.config.ts`                                                        | Firebase giriş ve veri testlerinin ayarı: uygulamayı canlı proje yerine emülatörlere bağlar                       |
| `playwright.config.ts`                                                             | E2E test ayarları: Chromium, uygulamayı demo modunda kendisi başlatır                                             |
| `env.d.ts`                                                                         | `.env` değişkenlerinin TypeScript tipleri                                                                         |
| `eslint.config.ts`, `.oxlintrc.json`                                               | Kod denetim kuralları                                                                                             |
| `.prettierrc.json`, `.editorconfig`                                                | Ortak kod biçimi: 2 boşluk girinti, tek tırnak, noktalı virgül yok, en fazla 100 karakter satır                   |
| `.env.example`                                                                     | Firebase değişkenlerinin boş şablonu (GitHub'da)                                                                  |
| `.env.local`                                                                       | Gerçek Firebase değerleri. **GitHub'a gönderilmez**, herkes kendi bilgisayarında oluşturur                        |
| `firebase.json`                                                                    | Firebase ayarları: `dist/` yayınlanır, tüm adresler `index.html`'e yönlenir, kural dosyası, emülatör portu (8080) |
| `.firebaserc`                                                                      | Varsayılan Firebase projesi (`ders-ogrenci-bilgi-ekip`)                                                           |
| `firestore.rules`                                                                  | Firestore güvenlik kuralları: herkes yalnızca kendi verisini okuyup yazabilir                                     |
| `.gitignore`                                                                       | Git'e gönderilmeyecek dosyalar (`node_modules`, `dist`, `.env.local` …)                                           |
| `.gitattributes`                                                                   | Windows ve macOS'ta satır sonlarının aynı kalması                                                                 |
| `.vscode/`                                                                         | Önerilen VS Code eklentileri ve kaydederken otomatik biçimlendirme                                                |
| `.github/pull_request_template.md`                                                 | GitHub'da PR açarken otomatik gelen şablon                                                                        |
| `.github/workflows/test.yml`                                                       | GitHub Actions: her push ve PR'da lint, tip kontrolü, derleme ve testler                                          |

### `src/` — giriş noktası ve ortak dosyalar

| Dosya             | Ne işe yarar                                                                                                   |
| ----------------- | -------------------------------------------------------------------------------------------------------------- |
| `main.ts`         | Uygulamayı başlatır: Pinia'yı kurar, oturumu dinlemeye başlar, router'ı ekler; ilk sayfa hazır olunca gösterir |
| `App.vue`         | Kök bileşen. Sayfanın türüne göre çerçeveyi seçer (`AppLayout` ya da `PublicLayout`)                           |
| `config.ts`       | Uygulama adı, iletişim e-postası, `localStorage` anahtar adları                                                |
| `assets/main.css` | Tailwind'in yüklendiği yer, karanlık tema ayarı, genel arka plan ve klavye odağı stili                         |

### `src/router/` — sayfa adresleri

| Dosya      | Ne işe yarar                                                                                                                             |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `index.ts` | Tüm adresler ve hangi sayfayı açtıkları. Giriş yapmayanı giriş sayfasına, giriş yapmışı ana sayfaya yönlendirir; sekme başlığını ayarlar |

### `src/layouts/` — sayfa çerçeveleri

| Dosya              | Ne işe yarar                                                                                                                                                     |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AppLayout.vue`    | Giriş yapmış kullanıcının çerçevesi: solda kenar çubuğu, sağda sayfa içeriği. Mobil menünün açılıp kapanmasını yönetir (Esc, arka plana tıklama, sayfa değişimi) |
| `PublicLayout.vue` | Giriş, kayıt, gizlilik ve 404 sayfalarının sade çerçevesi                                                                                                        |

### `src/components/` — bileşenler

| Dosya                        | Ne işe yarar                                                                                                                                   |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `layout/AppSidebar.vue`      | Sol kenar çubuğu: logo, ikonlu ana menü (seçili sayfa vurgulu), kullanıcı kartı, tema düğmesi, çıkış. Masaüstünde sabit, mobilde soldan açılır |
| `layout/AppHeader.vue`       | Yalnızca mobilde görünen üst bar: menü düğmesi, logo, tema düğmesi                                                                             |
| `layout/AppLogo.vue`         | Logo ve uygulama adı; kenar çubuğunda, mobil üst barda ve giriş sayfalarında                                                                   |
| `layout/AppFooter.vue`       | Alt bilgi ve Gizlilik/KVKK bağlantısı                                                                                                          |
| `layout/ThemeToggle.vue`     | Karanlık/aydınlık tema düğmesi                                                                                                                 |
| `layout/DemoBanner.vue`      | Demo modundayken üstte çıkan uyarı                                                                                                             |
| `layout/SkipLink.vue`        | Klavye kullanıcıları için "İçeriğe geç" bağlantısı                                                                                             |
| `common/AppIcon.vue`         | Uygulamadaki tüm ikonlar tek yerde (`<AppIcon name="home" class="size-5" />`)                                                                  |
| `common/PageHeader.vue`      | Sayfa başlığı ve açıklaması                                                                                                                    |
| `common/TextField.vue`       | Etiketli metin kutusu (formlarda kullanılır)                                                                                                   |
| `common/PagePlaceholder.vue` | **Geçici.** Sayfalarda "Geliştirilecek" listesini gösterir; sayfalar bitince silinir                                                           |
| `auth/AuthCard.vue`          | Giriş, kayıt ve şifre sıfırlama formlarının ortak kartı; hata mesajını gösterir                                                                |
| `auth/SubmitButton.vue`      | Form gönderme düğmesi; işlem sürerken pasifleşir                                                                                               |
| `lessons/`                   | Ders ve hafta kartları buraya eklenecek                                                                                                        |
| `tasks/`                     | Görev kartı, filtre ve arama bileşenleri buraya eklenecek                                                                                      |

### `src/composables/` — tekrar kullanılan mantık

| Dosya              | Ne işe yarar                                                                                                                                   |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `useMediaQuery.ts` | Bir ekran koşulunun (ör. masaüstü genişliği, sistemin karanlık teması) o an geçerli olup olmadığını verir; değişince kendiliğinden güncellenir |

### `src/views/` — sayfalar

| Dosya                         | Adres                               | Ne işe yarar                                                            |
| ----------------------------- | ----------------------------------- | ----------------------------------------------------------------------- |
| `HomeView.vue`                | `/`                                 | Ana Sayfa: genel ilerleme ve özet                                       |
| `CoursesView.vue`             | `/derslerim`                        | Ders kartları                                                           |
| `CourseDetailView.vue`        | `/derslerim/:dersId`                | Bir dersin haftaları; ders yoksa "bulunamadı" mesajı                    |
| `WeekDetailView.vue`          | `/derslerim/:dersId/hafta/:haftaNo` | Haftanın öğrenme hedefleri ve görevleri                                 |
| `TasksView.vue`               | `/gorevlerim`                       | Tüm görevler, filtre ve arama                                           |
| `ProfileView.vue`             | `/profil`                           | Hesap bilgileri, tercihler, hesabı ve verileri silme                    |
| `PrivacyView.vue`             | `/gizlilik`                         | Gizlilik ve KVKK aydınlatma metni                                       |
| `NotFoundView.vue`            | diğer adresler                      | 404 sayfası                                                             |
| `auth/LoginView.vue`          | `/giris`                            | Giriş formu; girişten sonra kullanıcıyı gitmek istediği sayfaya götürür |
| `auth/RegisterView.vue`       | `/kayit`                            | Kayıt formu ve KVKK onay kutusu                                         |
| `auth/ForgotPasswordView.vue` | `/sifremi-unuttum`                  | Şifre sıfırlama e-postası gönderir                                      |

### `src/stores/` — ortak veri (Pinia)

Sayfalar veriyi doğrudan Firebase'den değil, bu store'lardan okur. Bir sayfada görev tamamlanınca
diğer sayfalardaki ilerleme de kendiliğinden güncellenir.

| Dosya            | Ne işe yarar                                                                                                        |
| ---------------- | ------------------------------------------------------------------------------------------------------------------- |
| `auth.ts`        | Giriş yapan kullanıcı; kayıt, giriş, çıkış, şifre sıfırlama, hesap silme işlemleri                                  |
| `catalog.ts`     | Ders kataloğu (dersler, haftalar, görevler). `getCourse`, `getWeeks`, `getWeek` yardımcıları                        |
| `progress.ts`    | Kullanıcının görev durumları. `tasks` (durumlarıyla görevler), `overall` (genel ilerleme), `summarize`, `setStatus` |
| `preferences.ts` | Tema tercihi (aydınlık / karanlık / sistem); `localStorage`'a kaydedilir                                            |

### `src/services/` — veri okuma ve yazma

Her servisin bir ortak arayüzü ve iki uygulaması vardır: Firebase'li ve demo modu. Hangisinin
kullanılacağı `index.ts` içinde otomatik seçilir; store'lar farkı bilmez.

| Dosya                   | Ne işe yarar                                                                        |
| ----------------------- | ----------------------------------------------------------------------------------- |
| `auth/index.ts`         | Giriş servisinin arayüzü (`AuthService`) ve Firebase/demo seçimi                    |
| `auth/firebase.ts`      | Firebase Authentication ile kayıt, giriş, çıkış, şifre sıfırlama, hesap silme       |
| `auth/local.ts`         | Demo modu girişi: kullanıcı `localStorage`'da tutulur, şifre kontrol edilmez        |
| `auth/errors.ts`        | Firebase hata kodlarının Türkçe mesajları                                           |
| `userData/index.ts`     | Kullanıcı verisi servisinin arayüzü (`UserDataService`) ve Firebase/demo seçimi     |
| `userData/firestore.ts` | Görev durumlarını ve kendi görevlerini Firestore'daki `users/{uid}` belgesine yazar |
| `userData/local.ts`     | Demo modunda görev durumlarını ve kendi görevlerini `localStorage`'a yazar          |

### `src/firebase/`, `src/types/`, `src/data/`

| Dosya               | Ne işe yarar                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------- |
| `firebase/index.ts` | Firebase'i `.env.local` değerleriyle başlatır; `isFirebaseEnabled` ile demo modunu belirler |
| `types/course.ts`   | `Course` (ders) ve `Week` (hafta) tipleri                                                   |
| `types/task.ts`     | `Task` (görev), `TaskStatus` (durum) tipleri ve durumların Türkçe adları                    |
| `types/user.ts`     | `AppUser` (kullanıcı), `UserData` (kullanıcı verisi), `ThemePreference` (tema) tipleri      |
| `data/courses.json` | Dersler                                                                                     |
| `data/weeks.json`   | Derslerin haftaları ve öğrenme hedefleri                                                    |
| `data/tasks.json`   | Haftaların görevleri                                                                        |

## Veri modeli ve veri akışı

**Ders kataloğu** herkes için aynıdır ve `src/data/` içindeki JSON dosyalarında durur:

| Varlık | Alanlar                                                                                |
| ------ | -------------------------------------------------------------------------------------- |
| Ders   | `id`, `code`, `title`, `instructor`, `description`                                     |
| Hafta  | `id`, `courseId`, `weekNo`, `title`, `description`, `learningGoals[]`                  |
| Görev  | `id`, `courseId`, `weekNo`, `title`, `description`, `dueDate` (isteğe bağlı), `tags[]` |

**Kullanıcıya özel veri** Firestore'da her kullanıcı için tek bir belgede tutulur
(demo modunda `localStorage`'da):

```text
users/{uid}
  taskStatuses: { "yg-w1-t1": "done", "wp-w2-t1": "in-progress" }
  customTasks:  { "custom-…": { id, title, description, courseId, dueDate, createdAt } }
  updatedAt:    sunucu zamanı
```

`customTasks`, kullanıcının ders görevleri dışında kendi eklediği görevlerdir (en fazla 100).
Haftaları yoktur; Görevlerim'de "Kendi görevim" etiketiyle görünür, filtre ve aramaya dahildir.

Görev durumları: `todo` (Yapılacak), `in-progress` (Devam ediyor), `done` (Tamamlandı). Durumu
kaydedilmemiş görev "Yapılacak" sayılır. İlerleme kaydedilmez, her seferinde hesaplanır
(tamamlanan / toplam).

**Veri akışı:**

```text
src/data/*.json ─────────────────────────────► stores/catalog ──┐
                                                                ├─► stores/progress ─► sayfalar
Firestore (veya localStorage) ◄─► services/userData ◄──────────┘
```

**Yeni ders, hafta veya görev eklemek** için ilgili JSON dosyasına kayıt ekleyin. `id` değerleri
benzersiz olmalı; haftanın ve görevin `courseId` alanı dersin `id`'siyle, görevin `weekNo` alanı
haftanın numarasıyla aynı olmalı.

## Çalışma düzeni: GitHub Projects

Görevler GitHub Projects panosunda takip edilir. Panodaki her kart bir **GitHub issue**'sudur;
görev, dal, commit ve PR aynı yerde durur, GitHub'a ayrıca bir araç bağlamak gerekmez.

Teslime kadar yapılacak bütün işler **Teslim (11 Kasım 2026)** milestone'una bağlıdır. Kaç işin
bittiği **Issues → Milestones** sayfasında yüzde olarak görünür. Yeni açılan iş teslime
yetişmesi gerekiyorsa bu milestone'a eklenir. Her issue'da neyin "bitti" sayılacağı **Kabul
kriterleri** başlığı altında yazar.

### Pano ve issue numaraları

- **Pano:** https://github.com/users/selinozbay/projects/1 (repo sayfasındaki **Projects**
  sekmesinden de açılır). Pano gizlidir; yalnızca ekip üyeleri görür.
- **Sütunlar (Status):** kart, görevin hangi aşamada olduğunu gösterir.

  | Sütun        | Anlamı                                            |
  | ------------ | ------------------------------------------------- |
  | Yapılacaklar | Görev açıldı, henüz başlanmadı                    |
  | Yapılıyor    | Görevi üstlenen kişi üzerinde çalışıyor           |
  | İnceleme     | PR açıldı, bir ekip arkadaşı kodu inceliyor       |
  | Test         | İnceleme bitti, test ve kalite kontrolü yapılıyor |
  | Yapıldı      | PR birleşti ya da issue kapandı (kendiliğinden)   |

- **Her issue'nun kendi numarası vardır:** `#1`, `#2` … Numara, issue başlığının yanında ve
  panodaki kartın altında yazar. Yeni issue açılınca GitHub numarayı kendisi verir. Issue'lar ve
  PR'lar aynı sayacı paylaştığı için numaralar arada atlayabilir.
- Panoya doğrudan eklenen **taslak** (draft) kartların numarası yoktur. İşe başlamadan önce kartın
  menüsünden **Convert to issue** ile issue'ya çevirin.
- **Öncelik:** her kartın **Öncelik** alanı vardır: En yüksek, Yüksek, Orta, Düşük.
- **Alt görevler:** büyük işler (ör. bir sayfanın tamamı) ana issue olarak açılır; parçaları issue
  sayfasındaki **Create sub-issue** ile alt görev olarak eklenir. Ana issue'da kaç alt görevin
  bittiği görünür.
- **Etiketler (Labels):** yeni özellik için `enhancement`, hata için `bug`, doküman için
  `documentation`.
- Eski Jira görevleri (`KAN-…`) GitHub'a aktarıldı. Her issue'nun altında Jira anahtarı ve görevi
  açan kişi yazar.

### Görev akışı

1. İşi issue olarak açın: repoda **Issues → New issue** (ör. `#12`). Issue panoya kendiliğinden
   eklenir. **Assignees** kısmından kendinize atayın ve kartı **Yapılıyor** sütununa taşıyın.
2. `main` dalından, issue numarasıyla bir dal açın:

   ```bash
   git switch main
   git pull
   git switch -c feature/12-gorev-filtreleme
   ```

3. Küçük ve anlamlı commitler atın; mesajı aşağıdaki
   [commit mesajı kurallarına](#commit-mesajı-nasıl-yazılır) göre yazın.
4. Dalı GitHub'a gönderin ve PR açın. Açılan şablondaki `Closes #` satırını issue numarasıyla
   tamamlayın (`Closes #12`); böylece PR issue'ya bağlanır ve kart kendiliğinden **İnceleme**
   sütununa geçer.
5. En az bir ekip arkadaşı inceler; sonra kartı **Test** sütununa taşıyın ve uygulama denenir.
6. Test de bitince PR `main`'e **"Create a merge commit"** ile birleştirilir; böylece her commit
   geçmişte ayrı ayrı görünür. PR birleşince issue kendiliğinden kapanır ve kart **Yapıldı**
   sütununa geçer.

Mesajında `#12` geçen commit ve PR'lar issue sayfasının akışında görünür. Bu, kimin hangi görevi
hangi kodla yaptığının kanıtıdır.

Panonun otomasyonları **⋯ → Workflows** bölümündedir:

| Ne olunca                               | Kart nereye geçer  | Otomasyon                        |
| --------------------------------------- | ------------------ | -------------------------------- |
| Repoda yeni issue açılınca              | Yapılacaklar       | Auto-add to project, Item added  |
| Issue'ya `Closes #12` ile PR bağlanınca | İnceleme           | Pull request linked to issue     |
| PR birleşince ya da issue kapanınca     | Yapıldı            | Pull request merged, Item closed |
| Kapalı issue yeniden açılınca           | Yapılıyor          | Item reopened                    |
| Kart elle Yapıldı'ya taşınınca          | (issue da kapanır) | Auto-close issue                 |

**Yapılıyor** ve **Test** sütunlarına kartı elle taşıyın. Otomasyonlar yalnızca **Yapıldı**
sütunuyla issue'yu kapatır; diğer sütunlar issue'yu açık bırakır.

### Commit mesajı nasıl yazılır?

Hoca bireysel katkıyı commit geçmişinden değerlendirir; her commit **ne yapıldığını ve nedenini**
anlatmalı. Biçim:

```text
<tür>: <ne yapıldı — kısa, emir kipinde> (#<issue no>)

<Bir cümleyle neden yapıldığı.>

- <Değişiklik 1>
- <Değişiklik 2>
```

| Tür        | Ne zaman                                        |
| ---------- | ----------------------------------------------- |
| `feat`     | Yeni özellik                                    |
| `fix`      | Hata düzeltme                                   |
| `style`    | Görünüm ve tasarım değişikliği                  |
| `refactor` | Davranışı değiştirmeden kodu düzenleme          |
| `docs`     | README, rapor, kod içi açıklamalar              |
| `test`     | Test ekleme veya düzeltme                       |
| `chore`    | Ayar, paket, klasör düzeni gibi ürün dışı işler |

Örnek:

```text
feat: görevlere durum filtresi ekle (#12)

Öğrenci yalnızca devam eden görevlerini görebilsin diye.

- Görevlerim sayfasına Yapılacak / Devam ediyor / Tamamlandı filtresi eklendi
- Seçilen filtre sayfa yenilenince korunuyor (localStorage)
- Sonuç yoksa "Bu durumda görev yok" mesajı gösteriliyor
```

- Başlık en fazla ~72 karakter olsun ve nokta ile bitmesin.
- Issue numarası başlığın **sonuna** yazılır. Satırı `#` ile başlatmayın: git, düzenleyicide
  yazılan commit mesajlarında `#` ile başlayan satırları yorum sayıp siler.
- Issue'yu kapatan `Closes #12` satırı PR açıklamasına yazılır (şablonda hazır); commit mesajında
  numarayı yazmak yeterlidir.
- `update`, `final`, `son hali` gibi açıklamasız mesajlar kullanılmaz.
- Çok satırlı mesaj için VS Code'da Kaynak Denetimi kutusuna başlık, bir boş satır ve açıklama
  yazın. Terminalde her `-m` ayrı bir paragraf olur:

  ```bash
  git commit -m "feat: görevlere durum filtresi ekle (#12)" -m "- Görevlerim sayfasına durum filtresi eklendi"
  ```

### Commitlere nereden bakılır?

- **GitHub'da tüm commitler:** Repo ana sayfasında dosya listesinin sağ üstündeki
  **"Commits"** bağlantısı ya da
  https://github.com/selinozbay/YG-Proje1-Grup3/commits/main. Bir commit'e tıklayınca hangi
  dosyada neyin değiştiği görünür.
- **Kişi bazında katkı:** **Insights → Contributors**
  (https://github.com/selinozbay/YG-Proje1-Grup3/graphs/contributors). Burada yalnızca `main`
  dalına giren ve git e-postası GitHub hesabıyla eşleşen commitler sayılır.
- **Bilgisayarda:** `git log --oneline` (kısa liste), `git log --stat` (değişen dosyalarla). VS
  Code'da Kaynak Denetimi panelindeki **Graph** bölümü.

### Kurallar

- Herkes **kendi GitHub hesabıyla** commit atar. Git'teki e-posta adresiniz GitHub hesabınızdaki
  adresle aynı olmalı: `git config --global user.email "github-adresiniz"`
- `.env.local` dosyası ve şifreler asla commit edilmez.
- Son gün toplu commit yerine düzenli ve küçük commitler atılır.
- Commit öncesi `npm run lint`, `npm run type-check` ve `npm test` hatasız olmalı; PR'daki GitHub
  Actions kontrolleri yeşil olmalı.
- **Test edilmeyen iş bitmiş sayılmaz.** Bir issue, davranışını kapsayan test (birim, E2E ya da
  Firebase testi) eklenmeden ve CI yeşil olmadan kapatılmaz. "Kodda zaten var" denen işler de önce
  test edilir. Kart **Yapıldı**'ya geçmeden önce **Test** sütunundan geçer.
- Kod içindeki adlar (değişken, fonksiyon, bileşen) İngilizce; ekranda görünen metinler Türkçedir.

## Gizlilik ve KVKK

- Uygulamadaki [Gizlilik ve KVKK sayfası](src/views/PrivacyView.vue), hangi verilerin neden ve
  nerede işlendiğini açıklar. Kayıt sırasında kullanıcı bu metni okuduğunu onaylar.
- Yalnızca gerekli veriler tutulur: ad soyad ve e-posta (Firebase Authentication), görev durumları
  (Firestore). Tema tercihi yalnızca tarayıcıda kalır.
- Şifreler Firebase tarafından geri çözülemeyecek biçimde saklanır; ekip şifreleri göremez.
- Firestore veritabanı Avrupa'da (`eur3`) bulunur. Güvenlik kuralları
  ([`firestore.rules`](firestore.rules)) her kullanıcının yalnızca kendi verisine erişmesine izin
  verir.
- Kullanıcı, Profil sayfasından hesabını ve tüm verisini silebilir.
- Reklam veya izleme çerezi kullanılmaz.

## Ekran görüntüleri

Ekran görüntüleri sayfalar tamamlandıkça `docs/screenshots/` klasörüne eklenecektir
([#57](https://github.com/selinozbay/YG-Proje1-Grup3/issues/57)).

## Bilinen eksikler

- Ana Sayfa, Derslerim, Görevlerim ve Profil sayfaları iskelet halindedir. Her sayfadaki
  "Geliştirilecek" kutusu yapılacakları listeler; bu maddeler GitHub Projects panosunda issue
  olarak takip edilir.
- Gizlilik sayfasındaki iletişim e-postası henüz eklenmedi (`src/config.ts` → `CONTACT_EMAIL`,
  [#58](https://github.com/selinozbay/YG-Proje1-Grup3/issues/58)).
- Canlı demo iskelet sürümünü gösterir; sayfalar tamamlandıkça yeniden yayınlanacaktır
  ([#59](https://github.com/selinozbay/YG-Proje1-Grup3/issues/59)).
- Demo modunda şifre kontrol edilmez; bu mod yalnızca denemek içindir.

## Teslim dosyaları

| Dosya                         | İçerik                                                                              |
| ----------------------------- | ----------------------------------------------------------------------------------- |
| `docs/proje-raporu.pdf`       | Proje raporu ([#54](https://github.com/selinozbay/YG-Proje1-Grup3/issues/54))       |
| `docs/kullanici-dokumani.pdf` | Kullanıcı dokümanı ([#55](https://github.com/selinozbay/YG-Proje1-Grup3/issues/55)) |
| `presentation/`               | Sunum dosyası ([#56](https://github.com/selinozbay/YG-Proje1-Grup3/issues/56))      |
