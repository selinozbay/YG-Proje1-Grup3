# Etkileşimli Ders Deneyimi Panosu

**Yazılım Geliştirme dersi · Proje 1 · Grup 3** (`YG-Proje1-Grup3`)

Öğrencilerin aldıkları dersleri, haftalık ders içeriklerini, öğrenme hedeflerini, görevlerini ve
kendi ilerlemelerini tek bir yerden, etkileşimli bir web arayüzüyle takip edebildiği uygulama.

- **Canlı demo:** https://ders.c1h4n.com (aynı site: https://ders-ogrenci-bilgi-ekip.web.app)
- **Görev panosu (GitHub Projects):** https://github.com/users/selinozbay/projects/1
- **Teslim tarihi:** 11 Kasım 2026
  ([Teslim milestone'u](https://github.com/selinozbay/YG-Proje1-Grup3/milestone/1))

## İçindekiler

1. [Projenin amacı](#projenin-amacı)
2. [Ekip, roller ve katkılar](#ekip-roller-ve-katkılar)
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

## Ekip, roller ve katkılar

Tüm ekip üyeleri aynı zamanda geliştiricidir.

| Üye          | GitHub                                           | Rol                                 |
| ------------ | ------------------------------------------------ | ----------------------------------- |
| Selin Özbay  | [@selinozbay](https://github.com/selinozbay)     | Lider + Geliştirici                 |
| Cihan Bayram | [@C1H4N](https://github.com/C1H4N)               | Analist + Geliştirici               |
| Tahir Taş    | [@rumeyus](https://github.com/rumeyus)           | Test / Kalite + Geliştirici         |
| Ali Tekçe    | [@alitekce2005](https://github.com/alitekce2005) | Dokümantasyon / Sunum + Geliştirici |

### Kim ne yaptı?

1 Kasım 2026 itibarıyla. Görevler 28–29 Ekim'de lider Selin Özbay tarafından dağıtıldı; herkes
kendi işlerini bu dağılıma göre panoda kendine atadı. Numaralar PR ve issue'lardır; her PR'ın
içindeki commitler o kişiye aittir. Bütün bağlantılar ve sayılar
[`docs/katki-tablosu.md`](docs/katki-tablosu.md)'de.

**Selin Özbay (Lider + Geliştirici)**

- GitHub deposunu ve görev panosunu açtı (18 Ekim), görevleri ekibe dağıttı (29 Ekim).
- Ana Sayfa: dönem çizelgesi, güne göre yaklaşan görevler, derslerin bu haftası
  ([#84](https://github.com/selinozbay/YG-Proje1-Grup3/pull/84); #9–#13, #48).
- Derslerim: ders kartları, durum grafiği, arama ve filtre ([#83](https://github.com/selinozbay/YG-Proje1-Grup3/pull/83); #14–#19).
- Uygulamanın ortak tasarımı: yazı tipi, renkler, kenar çubuğu, görev listeleri ([#86](https://github.com/selinozbay/YG-Proje1-Grup3/pull/86)).
- Ekip katkı tablosu ve onu GitHub'dan üreten betik ([#85](https://github.com/selinozbay/YG-Proje1-Grup3/pull/85); P1-19).
- Şifre sıfırlama e-postasının KTÜ adreslerine ulaşması: Firebase e-posta ve alan adı ayarları
  (Cihan'la birlikte), belgelenmesi ve Gereksiz klasörü uyarısı ([#87](https://github.com/selinozbay/YG-Proje1-Grup3/pull/87), [#88](https://github.com/selinozbay/YG-Proje1-Grup3/pull/88)).
- PR incelemeleri ve onayları (#77, #79, #81), birleştirmeler (#77, #83–#88).

**Cihan Bayram (Analist + Geliştirici)**

- Gereksinimler (#31). Jira görevlerini GitHub'a aktardı; panonun sütunlarını, etiketlerini ve
  otomasyonlarını kurdu (20 Ekim).
- Örnek ders, hafta ve görev verisi ve tutarlılık testi ([#66](https://github.com/selinozbay/YG-Proje1-Grup3/pull/66); #62).
- Görev kartları ve tek liste ([#67](https://github.com/selinozbay/YG-Proje1-Grup3/pull/67); #22).
- Görevlerim: durum değiştirme, duruma/derse/haftaya göre filtre, Fuse.js ile arama, boş durum
  ([#68](https://github.com/selinozbay/YG-Proje1-Grup3/pull/68); #21, #24, #26, #49–#51).
- Hafta detayı: öğrenme hedefleri, görevler, ilerleme, haftalar arası geçiş ([#69](https://github.com/selinozbay/YG-Proje1-Grup3/pull/69); #43–#47).
- Kendi görevini ekleme, düzenleme ve silme; Firestore kuralları ([#70](https://github.com/selinozbay/YG-Proje1-Grup3/pull/70); #20, #23).
- Giriş, şifre sıfırlama ve görev senkronu testleri ([#61](https://github.com/selinozbay/YG-Proje1-Grup3/pull/61); #4, #5, #25).
- README'nin kurulum, test ve çalışma düzeni bölümleri; teslim tarihi düzeltmesi ([#63](https://github.com/selinozbay/YG-Proje1-Grup3/pull/63)).
- Arayüzün yeni görünümü: turuncu vurgu rengi, temayı izleyen kenar çubuğu, ders renkleri,
  derslere ve haftalara bölünmüş dönem çizelgesi, ders kapakları, durum simgeleri, hesap silmede
  onay penceresi ([#92](https://github.com/selinozbay/YG-Proje1-Grup3/pull/92), #91).
- `ders.c1h4n.com` alan adını ve DNS kayıtlarını sağladı. Birleştirmeler: #63, #75, #76.

**Tahir Taş (Test / Kalite + Geliştirici)**

- Birim, bileşen ve E2E test altyapısı ve CI ([#37](https://github.com/selinozbay/YG-Proje1-Grup3/pull/37); #38).
- Test senaryosu tablosu ve hata kaydı: [`docs/test-senaryolari.md`](docs/test-senaryolari.md)
  ([#73](https://github.com/selinozbay/YG-Proje1-Grup3/pull/73); P1-15).
- Testte bulduğu hataların düzeltilmesi: boş adla kayıt, hafta adresi ([#74](https://github.com/selinozbay/YG-Proje1-Grup3/pull/74); #71, #72).
- Kayıt kuralları: öğrenci e-postası ve şifre gücü göstergesi ([#76](https://github.com/selinozbay/YG-Proje1-Grup3/pull/76); #6, #7).
- Ders detayı: hafta kartları, ilerleme, zaman çizelgesi ([#77](https://github.com/selinozbay/YG-Proje1-Grup3/pull/77); #39–#42).
- Birleşmeyi bekleyen: Profil ([#81](https://github.com/selinozbay/YG-Proje1-Grup3/pull/81); #27–#30, #52), durum seçicisinin karanlık tema
  düzeltmesi ([#79](https://github.com/selinozbay/YG-Proje1-Grup3/pull/79); #78).

**Ali Tekçe (Dokümantasyon / Sunum + Geliştirici)**

- Proje iskeleti (18 Ekim): Vue, TypeScript, Tailwind ve Firebase kurulumu; giriş, kayıt ve şifre
  sıfırlama altyapısı; sayfa yönlendirmesi; ilk README ve ilk canlı yayın (#1).
- Haftalık ders kartlarının ilk tasarımı (#1).
- Kenar çubuğu: KVKK bağlantısı, menü geçiş efektleri, çıkış onayı ([#75](https://github.com/selinozbay/YG-Proje1-Grup3/pull/75); #33–#36).
- Proje raporunun ara sürümü (`docs/proje-raporu.pdf`; #54).
- Birleştirmeler: #61, #66–#70, #73, #74.
- Birleşmeyi bekleyen: giriş ekranlarının yeni tasarımı ([#80](https://github.com/selinozbay/YG-Proje1-Grup3/pull/80); #3), KVKK iletişim bilgisi
  ([#82](https://github.com/selinozbay/YG-Proje1-Grup3/pull/82); #58).

## Özellikler

| Özellik                                                        | Nerede                   | Durum |
| -------------------------------------------------------------- | ------------------------ | ----- |
| E-posta ve şifreyle kayıt, giriş, şifre sıfırlama              | Giriş / Kayıt            | Hazır |
| Giriş yapmayan kullanıcının uygulamaya girememesi              | Tüm sayfalar             | Hazır |
| Karanlık / aydınlık tema (seçim hatırlanır, açılışta aydınlık) | Üst menü                 | Hazır |
| Masaüstünde sabit sol menü, mobilde soldan açılan menü         | Tüm sayfalar             | Hazır |
| Gizlilik ve KVKK aydınlatma metni                              | Gizlilik                 | Hazır |
| Hesabı ve tüm verileri silme                                   | Profil                   | Hazır |
| Demo modu (Firebase olmadan çalışma)                           | Tüm sayfalar             | Hazır |
| Klavyeyle kullanım, "İçeriğe geç" bağlantısı                   | Tüm sayfalar             | Hazır |
| Ders kartları, durum grafiği, arama ve filtre                  | Derslerim                | Hazır |
| Haftalık ders kartları ve öğrenme hedefleri                    | Ders ve hafta detayı     | Hazır |
| Görev listesi ve durum değiştirme                              | Görevlerim, hafta detayı | Hazır |
| Duruma, derse ve haftaya göre filtre; arama                    | Görevlerim               | Hazır |
| Genel ve ders bazında ilerleme, yaklaşan görevler, bu hafta    | Ana Sayfa                | Hazır |

## Sayfalar

| Sayfa            | Adres                               | Giriş gerekir mi? | İçerik                                                |
| ---------------- | ----------------------------------- | ----------------- | ----------------------------------------------------- |
| Ana Sayfa        | `/`                                 | Evet              | Dönem çizelgesi, yaklaşan görevler, bu haftanın dersi |
| Derslerim        | `/derslerim`                        | Evet              | Ders kartları, durum grafiği, arama ve filtre         |
| Ders detayı      | `/derslerim/:dersId`                | Evet              | Dersin haftaları, ilerlemesi ve zaman çizelgesi       |
| Hafta detayı     | `/derslerim/:dersId/hafta/:haftaNo` | Evet              | Öğrenme hedefleri ve o haftanın görevleri             |
| Görevlerim       | `/gorevlerim`                       | Evet              | Tüm görevler, filtre, arama, kendi görevini ekleme    |
| Profil           | `/profil`                           | Evet              | Hesap bilgileri, tercihler, hesabı silme              |
| Giriş yap        | `/giris`                            | Hayır             | E-posta ve şifreyle giriş                             |
| Kayıt ol         | `/kayit`                            | Hayır             | Yeni hesap, KVKK onayı                                |
| Şifremi unuttum  | `/sifremi-unuttum`                  | Hayır             | Şifre sıfırlama e-postası                             |
| Gizlilik ve KVKK | `/gizlilik`                         | Hayır             | Aydınlatma metni                                      |
| Bulunamadı       | Diğer tüm adresler                  | Hayır             | 404 sayfası                                           |

## Kullanılan teknolojiler

| Teknoloji                                                            | Sürüm | Projede ne için kullanılıyor                                                  |
| -------------------------------------------------------------------- | ----- | ----------------------------------------------------------------------------- |
| [Vue](https://vuejs.org/)                                            | 3.5   | Arayüzü bileşenlere bölerek oluşturmak (HTML + CSS + TypeScript)              |
| [TypeScript](https://www.typescriptlang.org/)                        | 6.0   | JavaScript'e tip denetimi eklemek; hataları çalıştırmadan yakalamak           |
| [Vite](https://vite.dev/)                                            | 8.3   | Geliştirme sunucusu ve yayın için derleme                                     |
| [Vue Router](https://router.vuejs.org/)                              | 5.4   | Sayfalar arası geçiş, giriş yapılmadan sayfaların açılmasını önleme           |
| [Pinia](https://pinia.vuejs.org/)                                    | 4.1   | Sayfaların ortak kullandığı veri: oturum, ilerleme, tema                      |
| [Tailwind CSS](https://tailwindcss.com/)                             | 4.3   | Stil, responsive tasarım ve karanlık tema                                     |
| [Firebase Authentication](https://firebase.google.com/docs/auth)     | 13.0  | E-posta ve şifreyle kayıt, giriş, şifre sıfırlama                             |
| [Cloud Firestore](https://firebase.google.com/docs/firestore)        | 13.0  | Kullanıcının görev durumlarını ve kendi görevlerini saklamak                  |
| [Fuse.js](https://www.fusejs.io/)                                    | 7.5   | Görev ve ders aramada küçük yazım hatalarını ve şapkalı harfleri tolere etmek |
| [Firebase Hosting](https://firebase.google.com/docs/hosting)         | —     | Uygulamayı internette yayınlamak                                              |
| ESLint, Oxlint, Prettier                                             | —     | Kod hatalarını yakalamak ve herkesin aynı biçimde kod yazması                 |
| [Vitest](https://vitest.dev/)                                        | 5.0   | Birim ve bileşen testleri                                                     |
| [Vue Test Utils](https://test-utils.vuejs.org/)                      | 2.5   | Bileşenleri testte çalıştırıp çıktısını kontrol etmek                         |
| [Playwright](https://playwright.dev/)                                | 1.64  | Gerçek tarayıcıda uçtan uca (E2E) testler                                     |
| [Firebase Emulator](https://firebase.google.com/docs/emulator-suite) | —     | Firestore kurallarını gerçek veritabanına dokunmadan test etmek               |
| [GitHub Actions](https://docs.github.com/actions)                    | —     | Her push ve PR'da lint, tip kontrolü, derleme ve testleri çalıştırmak         |
| GitHub Projects                                                      | —     | Görev takibi ve iş bölümü (issue'lar ve pano)                                 |
| Git ve GitHub                                                        | —     | Sürüm kontrolü ve bireysel katkının kaydı                                     |

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

- Kayıtta öğrenci e-postası (`123456@ogr.ktu.edu.tr`) ve güçlü bir şifre istenir (kayıt
  formu kuralları demo modunda da geçerlidir). Girişte ise herhangi bir e-posta ve en az 6
  karakterlik herhangi bir şifre yeterlidir. Şifre saklanmaz ve kontrol edilmez.
- Görev durumları yalnızca o tarayıcıda (`localStorage`) tutulur.
- Bu sayede repo, Firebase anahtarları olmadan da kurulup denenebilir.

### Test hesabı

Hazır bir test hesabı yoktur.

- **Kayıt kuralları:** Kayıt yalnızca KTÜ öğrenci e-postasıyla (öğrenci numarası +
  `@ogr.ktu.edu.tr`) yapılabilir. Şifre güçlü olmalıdır: en az 10 karakter ve küçük harf, büyük
  harf, rakam, simgeden en az üçü. Formdaki gösterge "Güçlü" olmadan kayıt olunmaz. Giriş ve şifre
  sıfırlamada bu kurallar yoktur.
- **Firebase modunda:** "Kayıt ol" sayfasından öğrenci e-postanızla hesap açın. Şifre olarak
  e-posta hesabınızın şifresini değil, **bu uygulamaya özel yeni bir şifre** belirleyin. Gerçek
  e-posta kullanırsanız "Şifremi unuttum" e-postası da size ulaşır.
- **Demo modunda:** Kayıt için `123456@ogr.ktu.edu.tr` gibi uydurma bir öğrenci adresi ve
  `Parola-2026` gibi bir şifre; giriş için `deneme@example.com` gibi herhangi bir adres ve en az 6
  karakterlik bir şifre yeterlidir.
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

| Tür                 | Klasör              | Neyi kapsar                                                                        | Çalıştırma              |
| ------------------- | ------------------- | ---------------------------------------------------------------------------------- | ----------------------- |
| Birim ve bileşen    | `src/**/__tests__/` | Store'lar, hesaplamalar, filtre ve arama, bileşenler, sayfalar                     | `npm test`              |
| Uçtan uca (E2E)     | `e2e/`              | Kayıt, giriş, şifremi unuttum, menü, Ana Sayfa, Derslerim, Görevlerim, haftalar    | `npm run test:e2e`      |
| Firebase (emülatör) | `test/`             | Firestore güvenlik kuralları, gerçek giriş ve kayıt, kullanıcı verisi, hesap silme | `npm run test:firebase` |

- Birim testleri ve E2E her zaman demo modunda çalışır; `.env.local` dolu olsa bile gerçek
  Firebase'e bağlanmaz.
- E2E için ilk seferde tarayıcıyı kurun: `npx playwright install chromium`. Açık bir
  `npm run dev` varsa önce kapatın (Playwright onu kullanırsa demo girişi yapan testler bozulur).
- Firebase testleri canlı projeye dokunmadan bilgisayarda açılan emülatörlerle çalışır; Java 21+ ve
  Firebase CLI gerekir.
- Elle yapılan test senaryoları ve bulunan hatalar:
  [`docs/test-senaryolari.md`](docs/test-senaryolari.md).

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

Site https://ders.c1h4n.com ve https://ders-ogrenci-bilgi-ekip.web.app adreslerinde yayınlanır
(ikisi aynı sitedir).

### Alan adı ve e-posta gönderimi

Şifre sıfırlama e-postaları Firebase Authentication'ın kendi servisiyle, `noreply@ders.c1h4n.com`
adresinden gönderilir. Daha önce kullanılan Gmail SMTP ayarı 1 Kasım 2026'da kapatıldı: KTÜ öğrenci
postası (Microsoft 365) varsayılan `firebaseapp.com` göndericisinden gelen e-postaları teslim
etmiyordu.

- **Alan adı:** `ders.c1h4n.com`, Cihan'ın `c1h4n.com` alan adının alt alan adıdır. DNS kayıtları
  Vercel'de (Domains → c1h4n.com → DNS Records) tutulur; her kaydın açıklamasında "ders projesi"
  yazar. Bu kayıtlar silinirse site ve e-posta gönderimi bozulur.
- **Site:** Firebase Console → Hosting'de `ders.c1h4n.com` bağlıdır (`A` kaydı `199.36.158.100`,
  `TXT hosting-site=...` ve SSL için `_acme-challenge.ders`).
- **E-posta:** Firebase Console → Authentication → Templates'te gönderici alan adı
  `ders.c1h4n.com` olarak doğrulanmıştır. Teslim edilebilirlik için `ders` alt alan adında SPF
  (`include:_spf.firebasemail.com`), iki DKIM kaydı (`firebase1/firebase2._domainkey.ders`) ve
  DMARC (`_dmarc.ders`, `p=none`) kayıtları vardır.
- **Yetkili alan adları:** Authentication → Settings → Authorized domains listesinde
  `ders.c1h4n.com` vardır.
- **E-postadaki bağlantı:** `ders-ogrenci-bilgi-ekip.firebaseapp.com/__/auth/action` adresine gider
  ve olduğu gibi bırakıldı. Templates → Password reset → Customize action URL ile
  `https://ders.c1h4n.com/__/auth/action` yapılmak istendi; Firebase Console "An error occurred
  updating action URL" dedi. Konsolun gönderdiği istek
  (`PATCH .../config?updateMask=notification.sendEmail.callbackUri`) sunucudan
  `400 INVALID_ARGUMENT: EMAIL_TEMPLATE_UPDATE_NOT_ALLOWED` cevabını alıyor: Firebase bu projede
  e-posta şablonlarının değiştirilmesine izin vermiyor. Proje ücretsiz Spark planında; Google
  oltalamayı önlemek için ücretsiz projelerde şablon değişikliklerini kısıtlıyor (gönderici alan
  adının değiştirilmesine ise izin verdi). Ücretli Blaze planına geçilirse yeniden denenebilir;
  ders projesi için gerekli görülmedi.

**KTÜ adreslerinde Gereksiz klasörü:** Alan adı yeni olduğu için şifre sıfırlama e-postası KTÜ
öğrenci adreslerinde Gereksiz (Spam) klasörüne düşebilir. Kullanıcı e-postayı orada bulup
"Gereksiz değil" olarak işaretlerse sonrakiler gelen kutusuna gelir. Sorun sürerse KTÜ Bilgi
İşlem'den `ders.c1h4n.com` göndericisinin izin listesine eklenmesi istenebilir.

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
│   │   ├── home/       Ana Sayfa kartları
│   │   ├── layout/     Menü, üst bar, alt bilgi, tema düğmesi
│   │   ├── lessons/    Ders ve hafta kartları, ders grafiği, filtre, zaman çizelgesi
│   │   └── tasks/      Görev kartı, durum seçici, filtre, kendi görev formu
│   ├── composables/    Tekrar kullanılan mantık (filtre, arama, ilerleme hesapları)
│   ├── data/           Ders kataloğu (JSON)
│   ├── firebase/       Firebase bağlantısı
│   ├── layouts/        Sayfa çerçeveleri
│   ├── router/         Sayfa adresleri ve giriş kontrolü
│   ├── services/       Veri okuma/yazma (Firebase veya demo modu)
│   ├── stores/         Ortak veri (Pinia)
│   ├── types/          TypeScript tipleri
│   ├── utils/          Küçük yardımcılar (Türkçe tarih biçimi)
│   ├── views/          Sayfalar
│   ├── App.vue         Kök bileşen
│   ├── config.ts       Ortak sabitler
│   └── main.ts         Uygulamanın başladığı yer
├── scripts/            Ekip katkı tablosunu üreten betik
├── test/               Firebase emülatör testleri (kurallar, giriş, kullanıcı verisi)
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

| Klasör     | İçindekiler                                                                                                                                                  |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `layout/`  | Kenar çubuğu (`AppSidebar`), mobil üst bar, logo, alt bilgi, tema düğmesi, demo uyarısı, "İçeriğe geç" bağlantısı                                            |
| `common/`  | Ortak parçalar: ikonlar (`AppIcon`), durum simgesi (`StatusIcon`), sayfa başlığı, metin kutusu, onay penceresi, geri bağlantısı, ilerleme ve durum çubukları |
| `auth/`    | Giriş, kayıt ve şifre sıfırlama formlarının ortak kartı, gönder düğmesi, şifre gücü göstergesi                                                               |
| `home/`    | Ana Sayfa: `TermOverview` (dönem çizelgesi), `UpcomingTasks` (güne göre yaklaşan görevler), `HomeCourses` (ders ilerlemesi ve bu haftanın konusu)            |
| `lessons/` | Ders kartı, ders grafiği ve filtresi (Derslerim); hafta kartı ve zaman çizelgesi (Ders detayı); ders renkleri                                                |
| `tasks/`   | Görev kartı, durum seçici, görev filtresi, kendi görevini ekleme formu; görev durumlarının renkleri                                                          |

### `src/composables/` — tekrar kullanılan mantık

| Dosya                    | Ne işe yarar                                                                                                     |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `useTaskFilters.ts`      | Görevleri duruma, derse, haftaya ve aramaya göre süzer (Fuse.js)                                                 |
| `useTaskStatusChange.ts` | Görev durumunu değiştirir; kayıt başarısız olursa hata mesajı hazırlar                                           |
| `useCustomTaskForm.ts`   | Kendi görevini ekleme formunun kuralları (başlık ve açıklama uzunluğu)                                           |
| `useCourseProgress.ts`   | Her dersin görevleri, ilerlemesi ve durumu (Başlanmadı / Devam ediyor / Tamamlandı)                              |
| `useCourseFilters.ts`    | Dersleri duruma ve aramaya göre süzer (Fuse.js)                                                                  |
| `useDashboard.ts`        | Ana Sayfa hesapları: dönemin haftaları, geçen süre, bugüne göre her dersin haftası, yaklaşan ve geciken görevler |
| `useLayoutTransition.ts` | Giriş ve çıkışta çerçeveler arası geçiş efekti                                                                   |
| `useMediaQuery.ts`       | Bir ekran koşulunun (masaüstü genişliği, sistemin karanlık teması) o an geçerli olup olmadığı                    |

`src/utils/date.ts` tarihleri Türkçe yazar ("4 Kasım", "1 Kasım Pazar").

### `src/views/` — sayfalar

| Dosya                         | Adres                               | Ne işe yarar                                                            |
| ----------------------------- | ----------------------------------- | ----------------------------------------------------------------------- |
| `HomeView.vue`                | `/`                                 | Genel ilerleme, yaklaşan görevler, bu haftanın dersleri, ders özetleri  |
| `CoursesView.vue`             | `/derslerim`                        | Ders kartları, durum grafiği, arama ve filtre                           |
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

| Dosya            | Ne işe yarar                                                                                                           |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `auth.ts`        | Giriş yapan kullanıcı; kayıt, giriş, çıkış, şifre sıfırlama, hesap silme işlemleri                                     |
| `catalog.ts`     | Ders kataloğu (dersler, haftalar, görevler). `getCourse`, `getWeeks`, `getWeek` yardımcıları                           |
| `progress.ts`    | Kullanıcının görev durumları ve kendi görevleri: `tasks`, `overall`, `setStatus`, `saveCustomTask`, `deleteCustomTask` |
| `preferences.ts` | Tema tercihi (aydınlık / karanlık / sistem); `localStorage`'a kaydedilir                                               |

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

- Her kartın bir issue numarası (`#12`), bir **Öncelik** alanı (En yüksek / Yüksek / Orta / Düşük)
  ve bir etiketi vardır: `enhancement` (özellik), `bug` (hata), `documentation` (doküman).
- Eski Jira görevleri (`KAN-…`) 20 Ekim'de GitHub'a aktarıldı; her issue'nun altında Jira anahtarı
  ve görevi açan kişi yazar.

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

- Başlık kısa olsun (~72 karakter), issue numarası başlığın **sonuna** yazılsın. `update`,
  `final`, `son hali` gibi açıklamasız mesajlar kullanılmaz.
- Issue'yu kapatan `Closes #12` satırı PR açıklamasına yazılır (şablonda hazır).

### Commitlere nereden bakılır?

- **GitHub'da tüm commitler:** Repo ana sayfasında dosya listesinin sağ üstündeki
  **"Commits"** bağlantısı ya da
  https://github.com/selinozbay/YG-Proje1-Grup3/commits/main. Bir commit'e tıklayınca hangi
  dosyada neyin değiştiği görünür.
- **Kişi bazında katkı:** **Insights → Contributors**
  (https://github.com/selinozbay/YG-Proje1-Grup3/graphs/contributors). Burada yalnızca `main`
  dalına giren ve git e-postası GitHub hesabıyla eşleşen commitler sayılır.
- **Ekip katkı tablosu:** [`docs/katki-tablosu.md`](docs/katki-tablosu.md) her üyenin birleşen
  PR'larını, kapattığı issue'ları ve commit sayısını bağlantılarıyla listeler (hocanın P1-19
  maddesi). `node scripts/katki-tablosu.mjs > docs/katki-tablosu.md` ile GitHub'dan yeniden
  üretilir (gh CLI ile giriş gerekir).

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
  ve kullanıcının kendi eklediği görevler (Firestore). Tema tercihi yalnızca tarayıcıda kalır.
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

- Profil sayfası henüz iskelet halindedir; tamamlanmış hâli
  [#81](https://github.com/selinozbay/YG-Proje1-Grup3/pull/81) ile gelecek.
- Gizlilik sayfasındaki iletişim e-postası henüz eklenmedi (`src/config.ts` → `CONTACT_EMAIL`,
  [#58](https://github.com/selinozbay/YG-Proje1-Grup3/issues/58)).
- Canlı demo 1 Kasım'daki `main` sürümünü gösterir; teslimden önce son sürümle yeniden yayınlanacaktır
  ([#59](https://github.com/selinozbay/YG-Proje1-Grup3/issues/59)).
- Şifre sıfırlama e-postası KTÜ öğrenci adreslerinde Gereksiz klasörüne düşebilir; e-postadaki
  bağlantı, Firebase ücretsiz planda izin vermediği için `firebaseapp.com` adresinde kaldı (bkz.
  [Alan adı ve e-posta gönderimi](#alan-adı-ve-e-posta-gönderimi)).
- Demo modunda şifre kontrol edilmez; bu mod yalnızca denemek içindir.

## Teslim dosyaları

| Dosya                         | İçerik                                                                              |
| ----------------------------- | ----------------------------------------------------------------------------------- |
| `docs/proje-raporu.pdf`       | Proje raporu ([#54](https://github.com/selinozbay/YG-Proje1-Grup3/issues/54))       |
| `docs/kullanici-dokumani.pdf` | Kullanıcı dokümanı ([#55](https://github.com/selinozbay/YG-Proje1-Grup3/issues/55)) |
| `presentation/`               | Sunum dosyası ([#56](https://github.com/selinozbay/YG-Proje1-Grup3/issues/56))      |
| `docs/katki-tablosu.md`       | Ekip katkı tablosu ([#65](https://github.com/selinozbay/YG-Proje1-Grup3/issues/65)) |
