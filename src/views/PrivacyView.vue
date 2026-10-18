<script setup lang="ts">
import { APP_NAME, CONTACT_EMAIL } from '@/config'

// Metni güncellediğinizde bu tarihi de değiştirin.
const LAST_UPDATED = '18 Ekim 2026'
</script>

<!--
  KVKK (6698 sayılı Kanun) m.10 kapsamında aydınlatma metni.
  Ders projesi için hazırlanmış bir şablondur; hukuki görüş yerine geçmez.
-->
<template>
  <article
    class="w-full max-w-3xl space-y-3 leading-relaxed [&_h2]:pt-4 [&_h2]:text-lg [&_h2]:font-semibold [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5"
  >
    <h1 class="text-2xl font-bold tracking-tight">Gizlilik ve KVKK Aydınlatma Metni</h1>
    <p class="text-sm text-slate-500 dark:text-slate-400">Son güncelleme: {{ LAST_UPDATED }}</p>

    <p>
      Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu’nun (KVKK) 10. maddesi uyarınca,
      {{ APP_NAME }} uygulamasını kullanırken hangi kişisel verilerinizin, hangi amaçla ve nasıl
      işlendiğini açıklar. {{ APP_NAME }}, Yazılım Geliştirme dersi kapsamında geliştirilen bir
      öğrenci projesidir ve ticari amaç taşımaz.
    </p>

    <h2>1. Veri sorumlusu</h2>
    <p>
      Uygulamayı geliştiren YG-Proje1-Grup3 proje ekibi. İletişim:
      <a
        v-if="CONTACT_EMAIL"
        :href="`mailto:${CONTACT_EMAIL}`"
        class="text-indigo-600 underline dark:text-indigo-400"
        >{{ CONTACT_EMAIL }}</a
      >
      <span v-else>iletişim adresi henüz eklenmedi.</span>
    </p>

    <h2>2. İşlenen kişisel veriler</h2>
    <ul>
      <li><strong>Kimlik ve iletişim:</strong> kayıt sırasında girdiğiniz ad soyad ve e-posta.</li>
      <li>
        <strong>Hesap güvenliği:</strong> şifreniz. Firebase Authentication tarafından geri
        çözülemeyecek biçimde (hash) saklanır; ekip şifrenizi göremez.
      </li>
      <li>
        <strong>Kullanım verisi:</strong> görevlerinizin durumu (yapılacak, devam ediyor,
        tamamlandı).
      </li>
      <li>
        <strong>Tercihler:</strong> tema tercihiniz. Yalnızca tarayıcınızda tutulur, sunucuya
        gönderilmez.
      </li>
    </ul>

    <h2>3. İşleme amaçları</h2>
    <ul>
      <li>Hesabınızı oluşturmak ve giriş yapmanızı sağlamak</li>
      <li>Görev durumlarınızı ve ilerlemenizi kaydedip farklı cihazlarda göstermek</li>
      <li>İstediğinizde şifre sıfırlama e-postası göndermek</li>
    </ul>
    <p>
      Verileriniz reklam, profilleme veya pazarlama amacıyla kullanılmaz ve üçüncü kişilere
      satılmaz.
    </p>

    <h2>4. Hukuki sebep</h2>
    <p>
      Verileriniz, KVKK m.5/2-c uyarınca, hesabınızın oluşturulması ve uygulamanın size sunulmasıyla
      doğrudan ilgili olduğu için işlenir.
    </p>

    <h2>5. Verilerin saklandığı yer ve aktarım</h2>
    <p>
      Veriler, Google’ın Firebase hizmetlerinde (Authentication, Cloud Firestore, Hosting) saklanır.
      Bu hizmetlerin veri merkezleri yurt dışında bulunabilir; bu nedenle verileriniz yurt dışındaki
      sunucularda tutulur. Veriler bunun dışında hiçbir kişi veya kurumla paylaşılmaz.
    </p>

    <h2>6. Saklama süresi</h2>
    <p>
      Verileriniz hesabınız açık olduğu sürece saklanır. Hesabınızı sildiğinizde hesabınız ve
      ilerleme verileriniz silinir. Proje dönemi sona erdiğinde kalan tüm hesaplar ve veriler ekip
      tarafından silinir.
    </p>

    <h2>7. Çerezler ve tarayıcı depolaması</h2>
    <p>
      Uygulama reklam veya izleme çerezi kullanmaz. Tarayıcınızda yalnızca uygulamanın çalışması
      için gereken veriler tutulur: Firebase’in oturumunuzu açık tutmak için kaydettiği bilgi ve
      tema tercihiniz.
    </p>

    <h2>8. Haklarınız (KVKK m.11)</h2>
    <ul>
      <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme ve işlenmişse bilgi isteme</li>
      <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
      <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
      <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
      <li>Silinmesini veya yok edilmesini isteme</li>
      <li>Düzeltme ve silme işlemlerinin aktarıldığı üçüncü kişilere bildirilmesini isteme</li>
      <li>
        Yalnızca otomatik sistemlerle yapılan analiz sonucunda aleyhinize bir sonuç çıkmasına itiraz
        etme
      </li>
      <li>Kanuna aykırı işleme nedeniyle zarara uğrarsanız zararın giderilmesini isteme</li>
    </ul>
    <p>
      Hesabınızı ve verilerinizi <strong>Profil › Hesabı sil</strong> bölümünden kendiniz
      silebilirsiniz. Diğer talepleriniz için veri sorumlusuna e-posta ile başvurabilirsiniz.
    </p>
  </article>
</template>
