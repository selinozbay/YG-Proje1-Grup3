# Test Senaryoları ve Hata Kaydı

Bu belge projenin test senaryosu tablosudur (takip listesindeki **P1-15** maddesi). Her senaryo
için beklenen ve gerçek sonuç yazılıdır. Bulunan hatalar en altta, [Hata listesi](#hata-listesi)
bölümündedir.

Senaryolar rapordaki kullanıcı hikâyelerine (KH-1…KH-11, `docs/rapor-kaynak/proje-raporu.html`
Bölüm 3.2) bağlanmıştır.

## Test ortamı

| Alan              | Değer                                                                          |
| ----------------- | ------------------------------------------------------------------------------ |
| Test tarihi       | 31 Ekim 2026                                                                   |
| Sürüm             | `main` dalı, commit `aab8786` (30 Ekim 2026)                                   |
| Test eden         | Tahir Taş (Test / Kalite)                                                      |
| Uygulama modu     | Demo modu (`npm run dev:demo`), veriler tarayıcıda saklanır                    |
| Tarayıcı          | Chromium (Playwright ve elle deneme)                                           |
| Ekran boyutları   | Masaüstü 1024×768, mobil 375×812                                               |
| Firebase testleri | GitHub Actions, Auth ve Firestore emülatörleri (CI çalıştırması `41088297625`) |

## Sonuç özeti

| Sonuç       | Sayı | Anlamı                                          |
| ----------- | ---: | ----------------------------------------------- |
| ✅ Geçti    |   42 | Beklenen sonuç alındı                           |
| ❌ Kaldı    |    0 | Beklenen sonuç alınmadı, hata kaydı açıldı      |
| ⚠️ Kısmen   |    0 | Çalışıyor ama beklenenden küçük bir sapma var   |
| ⏳ Bekliyor |    8 | Özellik henüz geliştirilmedi, ilgili issue açık |

İlk turda T-11 kaldı, T-20'de küçük bir sapma çıktı. İkisi de düzeltildi, yeniden test edildi
ve tekrar bozulmamaları için E2E testi eklendi (bkz. [Hata listesi](#hata-listesi)).

**Test yöntemleri:** _E2E_ = Playwright (`e2e/`), _Birim_ = Vitest (`src/**/__tests__/`),
_Emülatör_ = Firebase emülatör testleri (`test/`), _Elle_ = tarayıcıda elle deneme,
_CI_ = GitHub Actions.

## Senaryolar

### Giriş ve kayıt (KH-1)

| No   | Senaryo                                   | Adımlar                                                               | Beklenen sonuç                                                        | Gerçek sonuç                                                                                                                                            | Yöntem           | Sonuç             |
| ---- | ----------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ----------------- |
| T-01 | Giriş yapmadan uygulama sayfası açma      | Giriş yapmadan `/` adresini aç                                        | Giriş sayfasına (`/giris`) yönlendirilir                              | `/giris` açıldı, başlık "Giriş yap"                                                                                                                     | E2E              | ✅                |
| T-02 | Geçerli bilgilerle giriş                  | E-posta ve 6+ karakterli şifre gir, "Giriş yap"a bas                  | Ana sayfa açılır, "Merhaba" yazar, demo modu uyarısı görünür          | Beklendiği gibi                                                                                                                                         | E2E              | ✅                |
| T-03 | KVKK onayı olmadan kayıt                  | Kayıt formunu doldur, KVKK kutusunu işaretleme, gönder                | Kayıt yapılmaz, onay istenir                                          | Kayıt yapılmadı, sayfada kalındı                                                                                                                        | E2E              | ✅                |
| T-04 | Eksiksiz bilgilerle kayıt                 | Ad soyad, e-posta, şifre gir, KVKK'yı onayla, gönder                  | Hesap açılır, ana sayfada kullanıcının adı görünür                    | Beklendiği gibi                                                                                                                                         | E2E              | ✅                |
| T-05 | 6 karakterden kısa şifre                  | Şifre olarak `12345` gir, gönder                                      | Türkçe uyarı gösterilir, giriş/kayıt yapılmaz                         | Türkçe uyarı gösterildi                                                                                                                                 | E2E, Emülatör    | ✅                |
| T-06 | Girişten sonra istenen sayfaya dönüş      | Giriş yapmadan `/gorevlerim`'i aç, yönlendirilen sayfada giriş yap    | Giriş sonrası `/gorevlerim` açılır                                    | Beklendiği gibi                                                                                                                                         | E2E              | ✅                |
| T-07 | Girişliyken giriş sayfasını açma          | Giriş yaptıktan sonra `/giris`'i aç                                   | Ana sayfaya yönlendirilir                                             | Beklendiği gibi                                                                                                                                         | E2E              | ✅                |
| T-08 | Çıkış yapma                               | Giriş yap, "Çıkış yap"a bas, ardından `/` adresini aç                 | Giriş sayfasına dönülür, uygulama sayfaları yeniden kapanır           | Beklendiği gibi                                                                                                                                         | E2E              | ✅                |
| T-09 | Aynı e-postayla ikinci kayıt              | Kayıtlı bir e-postayla yeniden kayıt ol                               | Kayıt reddedilir, Türkçe uyarı gösterilir                             | Beklendiği gibi                                                                                                                                         | Emülatör         | ✅                |
| T-10 | Yanlış şifre / kayıtsız e-posta ile giriş | Yanlış şifreyle, sonra kayıtlı olmayan e-postayla giriş dene          | Giriş yapılmaz; hangi bilginin yanlış olduğu söylenmez                | İki durumda da aynı genel Türkçe uyarı                                                                                                                  | Emülatör         | ✅                |
| T-11 | Ad soyad alanına yalnızca boşluk yazma    | Ad soyad alanına üç boşluk yaz, diğer alanları doldur, KVKK'yı onayla | Kayıt yapılmaz, "Ad soyad" alanının doldurulması istenir              | İlk denemede kayıt yapıldı, ad boş kaydedildi ([B-01](#hata-listesi)). Düzeltmeden sonra kayıt yapılmıyor, "Ad soyad alanını doldurun." uyarısı çıkıyor | Elle, E2E        | ✅ (yeniden test) |
| T-48 | Öğrenci e-postası kuralı (#6)             | Kayıtta `ali@ogr.ktu.edu.tr` ve `123456@gmail.com` gir, gönder        | Kayıt yapılmaz, "Öğrenci e-postanızı girin" uyarısı çıkar             | İki adreste de kayıt yapılmadı, uyarı çıktı; `123456@ogr.ktu.edu.tr` ile kayıt yapıldı (birim testinde 3 geçerli, 10 geçersiz adres)                    | Birim, E2E       | ✅                |
| T-49 | Şifre gücü göstergesi (#7)                | Kayıt formunda sırayla `parola`, `parola123`, `Parola-2026` yaz       | Gösterge Zayıf → Orta → Güçlü olur; zayıfta eksikler için ipucu çıkar | Beklendiği gibi; karanlık temada ve 375 px'de okunaklı                                                                                                  | Birim, E2E, Elle | ✅                |
| T-50 | Zayıf şifreyle kayıt (#7)                 | Şifre olarak `parolaparola` yaz, diğer alanları doldur, gönder        | Kayıt yapılmaz, "Şifre çok zayıf" uyarısı çıkar                       | Beklendiği gibi                                                                                                                                         | E2E              | ✅                |

### Şifremi unuttum (KH-2)

| No   | Senaryo                              | Adımlar                                          | Beklenen sonuç                                         | Gerçek sonuç           | Yöntem        | Sonuç |
| ---- | ------------------------------------ | ------------------------------------------------ | ------------------------------------------------------ | ---------------------- | ------------- | ----- |
| T-12 | Sıfırlama bağlantısı isteme          | "Şifremi unuttum" sayfasında e-posta gir, gönder | Bağlantının gönderildiği bildirilir                    | Beklendiği gibi        | E2E, Emülatör | ✅    |
| T-13 | Kayıtlı olmayan e-postayla sıfırlama | Kayıtlı olmayan bir e-posta gir, gönder          | Hata verilmez; hesabın var olup olmadığı belli edilmez | Hata verilmedi         | Emülatör      | ✅    |
| T-14 | Sıfırlama e-postasının dili          | Sıfırlama e-postası gönder                       | E-posta Türkçe gönderilir                              | Dil `tr` olarak ayarlı | Emülatör      | ✅    |

### Dersler ve haftalar (KH-3, KH-4)

| No   | Senaryo                             | Adımlar                                                          | Beklenen sonuç                                                                                                    | Gerçek sonuç                                                                                                                        | Yöntem    | Sonuç             |
| ---- | ----------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | --------- | ----------------- |
| T-15 | Derslerim'de derslerin listelenmesi | Menüden "Derslerim"i aç, bir derse tıkla                         | Her ders kod, ad, öğretim elemanı, açıklama ve ilerleme çubuğuyla kart olarak görünür; tıklayınca haftalar açılır | 3 ders düz liste olarak görünüyor, tıklayınca haftalar açılıyor; kart tasarımı ve ilerleme çubuğu yok                               | Elle      | ⏳ #14, #16       |
| T-16 | Olmayan ders adresi                 | `/derslerim/yok-ders` adresini aç                                | "Ders bulunamadı" ve Derslerim'e dönüş bağlantısı                                                                 | Beklendiği gibi                                                                                                                     | Elle      | ✅                |
| T-17 | Hafta detayının içeriği             | Veri Tabanı → 2. Hafta'yı aç                                     | Haftanın açıklaması, öğrenme hedefleri ve görevleri listelenir                                                    | Açıklama, 2 hedef ve 2 görev (durumlarıyla) listelendi                                                                              | Elle      | ✅                |
| T-18 | Önceki / sonraki haftaya geçiş      | Hafta detayında önceki/sonraki hafta bağlantısına bas            | Komşu haftaya geçilir                                                                                             | Bağlantılar henüz yok                                                                                                               | Elle      | ⏳ #47            |
| T-19 | Olmayan hafta adresi                | `/hafta/9` ve `/hafta/abc` adreslerini aç                        | "Hafta bulunamadı" ve dönüş bağlantısı                                                                            | İki adreste de beklendiği gibi                                                                                                      | Elle      | ✅                |
| T-20 | Ondalıklı hafta numarası            | `/derslerim/veri-tabani/hafta/2.0` ve `/hafta/02` adreslerini aç | "Hafta bulunamadı" gösterilir ya da `/hafta/2` adresine yönlendirilir                                             | İlk denemede 2. hafta açıldı, adres `2.0` olarak kaldı ([B-02](#hata-listesi)). Düzeltmeden sonra iki adreste de "Hafta bulunamadı" | Elle, E2E | ✅ (yeniden test) |

### Görev durumu ve ilerleme (KH-5, KH-8)

| No   | Senaryo                                      | Adımlar                                                             | Beklenen sonuç                                                 | Gerçek sonuç                                          | Yöntem      | Sonuç       |
| ---- | -------------------------------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------- | ----------------------------------------------------- | ----------- | ----------- |
| T-21 | Durumun sayfalar arasında aynı kalması (#25) | Bir görevin durumunu değiştir, Ana Sayfa ve Hafta detayına bak      | İki sayfa da yeni durumu ve yeni ilerlemeyi gösterir           | Beklendiği gibi                                       | Birim       | ✅          |
| T-22 | Durumun yenilemede korunması                 | Görev durumunu kaydet, sayfayı yeniden yükle                        | Kaydedilen durum korunur                                       | Beklendiği gibi                                       | Birim       | ✅          |
| T-23 | Kayıt başarısız olursa geri alma             | Kayıt sırasında hata oluştur                                        | Durum eski haline döner, hata kullanıcıya iletilir             | Beklendiği gibi                                       | Birim       | ✅          |
| T-24 | Arayüzden tek dokunuşla durum değiştirme     | Görevlerim veya Hafta detayında bir görevin durumunu değiştir       | Durum tek dokunuşla değişir, ilerleme hemen güncellenir        | Durum değiştirme düğmesi henüz yok                    | Elle        | ⏳ #45, #49 |
| T-25 | Tamamlanan / toplam görev oranı              | Ana sayfayı aç; birim testte farklı durum kombinasyonlarını hesapla | "X / Y görev tamamlandı (%Z)" doğru hesaplanır, görev yoksa %0 | "0 / 24 görev tamamlandı (%0)"; hesaplama testi geçti | Elle, Birim | ✅          |
| T-26 | Ana sayfada görsel ilerleme göstergesi       | Ana sayfayı aç                                                      | Halka veya çubuk şeklinde genel ve ders bazında ilerleme       | Yalnızca metin var, görsel gösterge henüz yok         | Elle        | ⏳ #11      |

### Görev listesi, filtre ve arama (KH-6, KH-7)

| No   | Senaryo                                 | Adımlar                                    | Beklenen sonuç                                                       | Gerçek sonuç                                                                         | Yöntem      | Sonuç       |
| ---- | --------------------------------------- | ------------------------------------------ | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ----------- | ----------- |
| T-27 | Tüm görevlerin tek listede gösterilmesi | Menüden "Görevlerim"i aç                   | Bütün derslerin görevleri kart olarak listelenir, görev sayısı yazar | 24 görev kart olarak listelendi                                                      | Birim, Elle | ✅          |
| T-28 | Görev kartının içeriği                  | Görev kartına bak                          | Başlık, ders, hafta, açıklama, etiketler ve Türkçe son tarih görünür | Beklendiği gibi; son tarihi olmayan görevde tarih satırı yok                         | Birim       | ✅          |
| T-29 | Duruma, derse ve haftaya göre filtre    | Görevlerim'de filtre seç                   | Liste anında daralır                                                 | Filtreler henüz yok                                                                  | Elle        | ⏳ #24, #50 |
| T-30 | Anahtar sözcükle arama                  | Görevlerim'de arama kutusuna "SQL" yaz     | Başlık veya açıklamada "SQL" geçen görevler listelenir               | Arama kutusu henüz yok (örnek veride "SQL" araması sonuç buluyor, birim testi geçti) | Elle, Birim | ⏳ #26      |
| T-31 | Sonuç yoksa bilgilendirme               | Hiçbir göreve uymayan bir filtre/arama yap | "Sonuç bulunamadı" benzeri bir mesaj gösterilir                      | Henüz yok                                                                            | Elle        | ⏳ #51      |

### Tema (KH-9)

| No   | Senaryo                         | Adımlar                                                                 | Beklenen sonuç        | Gerçek sonuç          | Yöntem | Sonuç |
| ---- | ------------------------------- | ----------------------------------------------------------------------- | --------------------- | --------------------- | ------ | ----- |
| T-32 | Tema düğmesiyle tema değiştirme | Üst çubuktaki "Karanlık temaya geç" düğmesine bas                       | Karanlık tema açılır  | Karanlık tema açıldı  | Elle   | ✅    |
| T-33 | Temanın yenilemede korunması    | Karanlık temaya geç, sayfayı yeniden yükle                              | Karanlık tema korunur | Karanlık tema korundu | Elle   | ✅    |
| T-34 | İlk açılışta tema               | Tema tercihi kayıtlı değilken, sistem karanlık temadayken uygulamayı aç | Aydınlık tema açılır  | Aydınlık tema açıldı  | Elle   | ✅    |

### Mobil görünüm ve erişilebilirlik (KH-10)

| No   | Senaryo                         | Adımlar                                                                                                          | Beklenen sonuç                                                                       | Gerçek sonuç                                   | Yöntem | Sonuç |
| ---- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------- | ------ | ----- |
| T-35 | Mobilde yatay kaydırma olmaması | 375 px genişlikte Ana Sayfa, Derslerim, ders detayı, hafta detayı, Görevlerim, Profil ve Gizlilik sayfalarını aç | Hiçbir sayfada yatay kaydırma çubuğu çıkmaz                                          | 7 sayfanın hepsinde içerik genişliği 375 px    | Elle   | ✅    |
| T-36 | Mobil menü                      | 375 px'de menü düğmesine bas, sonra Esc'ye bas                                                                   | Menü soldan açılır, odak menüye geçer; Esc menüyü kapatır, odak menü düğmesine döner | Beklendiği gibi; menüde 4 bağlantı var         | Elle   | ✅    |
| T-37 | Klavyeyle içeriğe geçme         | Sayfa açılınca Tab'a, ardından Enter'a bas                                                                       | İlk odak "İçeriğe geç" bağlantısı; Enter ile odak ana içeriğe geçer                  | Beklendiği gibi                                | Elle   | ✅    |
| T-38 | Görünür odak çizgisi            | Tab ile bağlantılar arasında gez                                                                                 | Odaktaki öğenin çevresinde görünür bir çizgi olur                                    | Odaktaki bağlantıda düz odak çizgisi görünüyor | Elle   | ✅    |

### Gizlilik, hesap silme ve veri güvenliği (KH-11)

| No   | Senaryo                                       | Adımlar                                                                | Beklenen sonuç                                            | Gerçek sonuç    | Yöntem   | Sonuç  |
| ---- | --------------------------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------- | --------------- | -------- | ------ |
| T-39 | Gizlilik sayfasının herkese açık olması       | Giriş yapmadan `/gizlilik` adresini aç                                 | Sayfa giriş istemeden açılır                              | Beklendiği gibi | Elle     | ✅     |
| T-40 | Hesap ve verilerin silinmesi                  | Hesabı sil                                                             | Hesap ve tüm görev durumları silinir                      | Beklendiği gibi | Emülatör | ✅     |
| T-41 | Kullanıcının yalnızca kendi verisine erişmesi | Bir kullanıcıyla başka bir kullanıcının belgesini okumayı/yazmayı dene | Erişim reddedilir; giriş yapmayan hiçbir belgeye erişemez | Beklendiği gibi | Emülatör | ✅     |
| T-42 | Görev durumlarının Firestore'da saklanması    | Görev durumu kaydet, başka bir görevi kaydet                           | Her kayıt diğer görevleri korur                           | Beklendiği gibi | Emülatör | ✅     |
| T-43 | Canlı sitede gerçek hesapla uçtan uca deneme  | Canlı sitede kayıt, giriş, şifre sıfırlama ve hesap silme              | Hepsi çalışır                                             | Henüz denenmedi | Elle     | ⏳ #60 |

### Genel

| No   | Senaryo                             | Adımlar                                                   | Beklenen sonuç                                                                  | Gerçek sonuç            | Yöntem | Sonuç |
| ---- | ----------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------- | ----------------------- | ------ | ----- |
| T-44 | Olmayan adres                       | `/olmayan-sayfa` adresini aç                              | 404 sayfası ve ana sayfaya dönüş bağlantısı                                     | Beklendiği gibi         | Elle   | ✅    |
| T-45 | Menüden sayfa geçişleri             | Menüden Derslerim, Görevlerim, Profil ve Ana Sayfa'ya geç | Her tıklamada doğru sayfa ve başlık açılır                                      | Beklendiği gibi         | E2E    | ✅    |
| T-46 | Örnek verinin tutarlılığı           | Ders, hafta ve görev JSON dosyalarını denetle             | Id'ler benzersiz, her görev var olan bir ders ve haftaya bağlı, tarihler sıralı | 9 kontrolün hepsi geçti | Birim  | ✅    |
| T-47 | Kod denetimi, tip kontrolü, derleme | Her push'ta CI'ı çalıştır                                 | Lint, TypeScript ve derleme hatasız biter                                       | Hatasız bitti           | CI     | ✅    |

## Hata listesi

| No   | Senaryo | Hata                                                                                                                                                                                                                                                               | Önem  | Durum      | Issue |
| ---- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----- | ---------- | ----- |
| B-01 | T-11    | Ad soyad alanına yalnızca boşluk yazılınca kayıt kabul ediliyor, kullanıcının adı boş kaydediliyor. Alan `required` olduğu hâlde boşluklar tarayıcı denetimini geçiyor; kod adı kırptıktan sonra boş olup olmadığına bakmıyor (`src/views/auth/RegisterView.vue`). | Orta  | Düzeltildi | #71   |
| B-02 | T-20    | Hafta numarası `2.0` gibi ondalıklı yazılınca 2. hafta açılıyor; adres düzeltilmiyor. Kullanıcıyı engellemiyor.                                                                                                                                                    | Düşük | Düzeltildi | #72   |

### Düzeltme kaydı

| Hata | Düzeltme                                                                                                                       | Eklenen test                                                                | Yeniden test sonucu |
| ---- | ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- | ------------------- |
| B-01 | `RegisterView.vue`: ad kırpıldıktan sonra boşsa kayıt yapılmıyor, "Ad soyad alanını doldurun." uyarısı gösteriliyor            | `e2e/auth-flows.spec.ts`: "ad soyad yalnızca boşluksa kayıt olunmaz…"       | ✅ Geçti            |
| B-02 | `router/index.ts`: hafta numarası yalnızca `2` gibi tam sayı yazımıyla kabul ediliyor; `2.0` ve `02` "Hafta bulunamadı" oluyor | `e2e/week-url.spec.ts`: geçerli hafta ile `2.0`, `02`, `9`, `abc` adresleri | ✅ Geçti            |

Eklenen testler düzeltme geri alınınca kalıyor, düzeltmeyle geçiyor; yani hata geri gelirse CI
bunu yakalar. Düzeltmeden sonra lint, tip kontrolü, Vitest (29/29) ve Playwright (16/16) hatasız.
