<script setup lang="ts">
import AppIcon from '@/components/common/AppIcon.vue'
import ProgressBar from '@/components/common/ProgressBar.vue'

const features = [
  { icon: 'book', text: 'Derslerini ve haftalık içeriklerini kart kart gör' },
  { icon: 'tasks', text: 'Görevlerini işaretle, filtrele ve ara' },
  { icon: 'check-circle', text: 'İlerlemeni tek bakışta takip et' },
] as const
</script>

<!--
  Giriş, kayıt ve şifremi unuttum ekranlarının solundaki tanıtım paneli (#3).
  Yalnızca masaüstünde görünür; mobilde form tek başına gösterilir.
  Sayfada tek bir h1 olsun diye başlık <p> ile yazılır (başlık formun üstünde).
-->
<template>
  <div
    class="relative hidden overflow-hidden bg-linear-to-br from-indigo-600 via-indigo-600 to-violet-700 p-10 text-white md:flex md:flex-col"
  >
    <!-- Arka plandaki yumuşak ışık halkaları (yalnızca süs). -->
    <div
      aria-hidden="true"
      class="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-white/10 blur-2xl"
    />
    <div
      aria-hidden="true"
      class="pointer-events-none absolute -bottom-28 -left-20 size-72 rounded-full bg-violet-400/30 blur-3xl"
    />

    <div class="relative flex items-center gap-3">
      <span class="grid size-10 place-items-center rounded-xl bg-white/15 ring-1 ring-white/25">
        <AppIcon name="logo" class="size-5" />
      </span>
      <span class="font-semibold">Ders Panosu</span>
    </div>

    <p class="relative mt-10 text-3xl leading-tight font-bold">
      Derslerini, haftalarını ve görevlerini tek panoda takip et.
    </p>

    <ul class="relative mt-8 space-y-4 text-indigo-50">
      <li v-for="feature in features" :key="feature.text" class="flex items-center gap-3">
        <span class="grid size-8 shrink-0 place-items-center rounded-lg bg-white/15">
          <AppIcon :name="feature.icon" class="size-4" />
        </span>
        {{ feature.text }}
      </li>
    </ul>

    <!-- Uygulamadan küçük bir örnek: haftanın ilerleme kartı (panelin altına yaslanır). -->
    <div aria-hidden="true" class="relative mt-auto pt-10">
      <div
        class="rounded-2xl bg-white p-4 text-slate-900 shadow-2xl shadow-indigo-950/40 dark:bg-slate-900 dark:text-slate-100"
      >
        <p class="text-xs font-medium text-slate-500 dark:text-slate-400">
          Yazılım Geliştirme · 3. Hafta
        </p>
        <p class="mt-1 mb-3 font-semibold">Geliştirme ve Test</p>
        <ProgressBar :value="67" label="Örnek ilerleme" />
      </div>
    </div>
  </div>
</template>
