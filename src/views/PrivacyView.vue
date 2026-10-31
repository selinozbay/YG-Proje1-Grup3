<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppIcon from '@/components/common/AppIcon.vue'
import { APP_NAME, CONTACT_EMAIL, DATA_DELETION_DATE } from '@/config'
import { useAuthStore } from '@/stores/auth'

// Metni güncellediğinizde bu tarihi de değiştirin.
const LAST_UPDATED = '31 Ekim 2026'

const router = useRouter()
const auth = useAuthStore()

/**
 * Geri dön: uygulama içinden gelindiyse önceki sayfaya (ör. giriş ya da kayıt formu),
 * bağlantı yeni sekmede ya da doğrudan açıldıysa ana sayfaya / giriş ekranına gider.
 */
function goBack() {
  if (window.history.state?.back) router.back()
  else router.push(auth.isAuthenticated ? '/' : '/giris')
}
</script>

<!--
  KVKK (6698 sayılı Kanun) m.10 kapsamında aydınlatma metni.
  Ders projesi için hazırlanmış bir şablondur; hukuki görüş yerine geçmez.
-->
<template>
  <article
    class="w-full max-w-3xl space-y-3 leading-relaxed [&_h2]:pt-4 [&_h2]:text-lg [&_h2]:font-semibold [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5"
  >
    <button
      type="button"
      class="-ml-2 inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-500/10"
      data-test="privacy-back"
      @click="goBack"
    >
      <AppIcon name="arrow-right" class="size-4 rotate-180" />
      Geri dön
    </button>
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
        :href="`mailto:${CONTACT_EMAIL}`"
        class="text-indigo-600 underline dark:text-indigo-400"
        data-test="contact-email"
        >{{ CONTACT_EMAIL }}</a
      >
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
        tamamlandı) ve kendi eklediğiniz görevler (başlık, açıklama, ders, son tarih).
      </li>
      <li>
        <strong>Tercihler:</strong> tema tercihiniz. Yalnızca tarayıcınızda tutulur, sunucuya
        gönderilmez.
      </li>
    </ul>

    <h2>3. İşleme amaçları</h2>
    <ul>
      <li>Hesabınızı oluşturmak ve giriş yapmanızı sağlamak</li>
      <li>
        Görev durumlarınızı, kendi eklediğiniz görevleri ve ilerlemenizi kaydedip farklı cihazlarda
        göstermek
      </li>
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
      sunucularda tutulur.
    </p>
    <p>
      Şifre sıfırlama e-postaları, ekibin {{ CONTACT_EMAIL }} adresli Gmail hesabı üzerinden
      gönderilir. Bu sırada yalnızca e-posta adresiniz ve sıfırlama bağlantısı Google’ın e-posta
      altyapısından geçer. Veriler bunların dışında hiçbir kişi veya kurumla paylaşılmaz.
    </p>

    <h2>6. Saklama süresi</h2>
    <p>
      Verileriniz hesabınız açık olduğu sürece saklanır. Kendi eklediğiniz bir görevi istediğiniz an
      silebilirsiniz. Hesabınızı sildiğinizde hesabınız, ilerleme verileriniz ve kendi eklediğiniz
      görevler silinir. Proje dönemi sona erdiğinde, en geç
      <strong>{{ DATA_DELETION_DATE }}</strong> tarihinde, kalan tüm hesaplar ve veriler ekip
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
      silebilirsiniz.
    </p>

    <h2>9. Başvuru yolu</h2>
    <p>
      Yukarıdaki haklarınızla ilgili taleplerinizi, uygulamada kayıtlı e-posta adresinizden
      <a :href="`mailto:${CONTACT_EMAIL}`" class="text-indigo-600 underline dark:text-indigo-400">{{
        CONTACT_EMAIL
      }}</a>
      adresine yazarak iletebilirsiniz. Kimliğinizi doğrulayabilmemiz için başvurunuzda ad
      soyadınızı ve talebinizi açıkça belirtiniz. Başvurular, KVKK’nın 13. maddesi uyarınca en geç
      <strong>30 gün</strong> içinde ve ücretsiz olarak yanıtlanır.
    </p>
  </article>
</template>
