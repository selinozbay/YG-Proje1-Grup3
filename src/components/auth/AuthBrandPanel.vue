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
  Giriş, kayıt ve şifremi unuttum ekranlarının sol paneli (#3). Yalnızca geniş
  ekranlarda görünür. Sayfada tek bir h1 olsun diye başlık <p> ile yazılır.
-->
<template>
  <aside
    class="relative hidden overflow-hidden bg-[#0b1530] px-14 py-12 text-white lg:flex lg:flex-col"
    aria-label="Uygulama tanıtımı"
  >
    <!-- Sağ üstteki iç içe halkalar (yalnızca süs). -->
    <div aria-hidden="true" class="pointer-events-none absolute -top-48 -right-40">
      <div class="size-[38rem] rounded-full border-[3.5rem] border-white/[0.03]">
        <div class="m-10 size-[28rem] rounded-full border-[3rem] border-white/[0.04]">
          <div class="m-10 size-[16rem] rounded-full bg-indigo-500/10" />
        </div>
      </div>
    </div>
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-[#070d20] to-transparent"
    />

    <div class="relative flex items-center gap-4">
      <span
        class="grid size-14 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur"
      >
        <AppIcon name="logo" class="size-8" />
      </span>
      <span class="leading-tight">
        <span class="block text-2xl font-bold tracking-tight">Ders Panosu</span>
        <span class="block text-xs tracking-wide text-slate-400">YG · Proje 1 · Grup 3</span>
      </span>
    </div>

    <div class="relative my-auto max-w-lg py-12">
      <p class="text-xs font-bold tracking-[0.2em] text-indigo-400 uppercase">
        Etkileşimli Ders Deneyimi
      </p>
      <p class="mt-4 text-4xl leading-tight font-bold tracking-tight">
        Derslerinize ve görevlerinize tek noktadan ulaşın.
      </p>
      <p class="mt-5 leading-relaxed text-slate-300">
        Haftalık ders akışınızı, görevlerinizi ve öğrenme ilerlemenizi tek bir panoda, düzenli ve
        güvenli şekilde takip edin.
      </p>
      <ul class="mt-8 space-y-3.5">
        <li v-for="feature in features" :key="feature" class="flex items-center gap-3">
          <AppIcon name="check" class="size-5 shrink-0 text-indigo-400" />
          <span class="text-slate-200">{{ feature }}</span>
        </li>
      </ul>
    </div>

    <p class="relative font-mono text-xs text-slate-500">
      © {{ year }} YG-Proje1-Grup3 · Yazılım Geliştirme
    </p>
  </aside>
</template>
