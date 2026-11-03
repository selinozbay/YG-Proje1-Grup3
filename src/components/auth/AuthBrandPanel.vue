<script setup lang="ts">
import AppIcon from '@/components/common/AppIcon.vue'

const features = [
  'Haftalık ders içerikleri ve öğrenme hedefleri',
  'Görev takibi, filtreleme ve arama',
  'Genel ve ders bazında ilerleme göstergesi',
]
const year = new Date().getFullYear()
</script>

<!--
  Giriş, kayıt ve şifremi unuttum ekranlarının sol paneli (#3). Yalnızca geniş ekranlarda
  görünür. Temayı izler: aydınlık temada açık turuncu, karanlık temada koyu zemin (uygulamanın
  kenar çubuğuyla aynı kural). Sayfada tek bir h1 olsun diye başlık <p> ile yazılır.
-->
<template>
  <aside
    class="relative hidden overflow-hidden border-r border-indigo-100 bg-indigo-50 px-14 py-12 text-slate-900 lg:flex lg:flex-col dark:border-slate-800 dark:bg-slate-900 dark:text-white"
    aria-label="Uygulama tanıtımı"
  >
    <!-- Sağ üstteki iç içe halkalar (yalnızca süs). -->
    <div aria-hidden="true" class="pointer-events-none absolute -top-48 -right-40">
      <div
        class="size-[38rem] rounded-full border-[3.5rem] border-indigo-200/40 dark:border-white/[0.03]"
      >
        <div
          class="m-10 size-[28rem] rounded-full border-[3rem] border-indigo-200/50 dark:border-white/[0.04]"
        >
          <div class="m-10 size-[16rem] rounded-full bg-indigo-200/50 dark:bg-indigo-400/10" />
        </div>
      </div>
    </div>

    <div class="relative flex items-center gap-4">
      <span
        class="grid size-14 place-items-center rounded-2xl bg-indigo-600 text-white dark:bg-indigo-400 dark:text-slate-950"
      >
        <AppIcon name="logo" class="size-8" />
      </span>
      <span class="leading-tight">
        <span class="block text-2xl font-bold font-stretch-condensed">Ders Panosu</span>
        <span class="block text-xs text-slate-600 dark:text-slate-400">YG · Proje 1 · Grup 3</span>
      </span>
    </div>

    <div class="relative my-auto max-w-lg py-12">
      <p class="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
        Etkileşimli ders deneyimi
      </p>
      <p class="mt-3 text-[2.75rem] leading-[1.05] font-bold font-stretch-condensed text-balance">
        Derslerinize ve görevlerinize tek noktadan ulaşın.
      </p>
      <p class="mt-5 leading-relaxed text-slate-700 dark:text-slate-300">
        Haftalık ders akışınızı, görevlerinizi ve öğrenme ilerlemenizi tek bir panoda, düzenli ve
        güvenli şekilde takip edin.
      </p>
      <ul class="mt-8 space-y-3.5">
        <li v-for="feature in features" :key="feature" class="flex items-center gap-3">
          <AppIcon name="check" class="size-5 shrink-0 text-indigo-600 dark:text-indigo-300" />
          <span class="text-slate-800 dark:text-slate-200">{{ feature }}</span>
        </li>
      </ul>
    </div>

    <p class="relative text-xs text-slate-600 dark:text-slate-400">
      © {{ year }} YG-Proje1-Grup3 · Yazılım Geliştirme
    </p>
  </aside>
</template>
