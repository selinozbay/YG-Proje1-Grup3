<script setup lang="ts">
// GEÇİCİ: Sayfası tamamlanan ekip üyesi bu bileşeni sayfasından kaldırır.
// Bütün sayfalardan kaldırılınca bu dosya da silinebilir.
defineProps<{ title: string; items: string[] }>()
</script>

<template>
  <section
    class="rounded-lg border border-dashed border-slate-300 p-5 dark:border-slate-700"
    aria-label="Geliştirilecek özellikler"
  >
    <p class="text-sm font-semibold text-slate-500 dark:text-slate-400">
      Geliştirilecek · {{ title }}
    </p>
    <ul class="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-400">
      <li v-for="item in items" :key="item">{{ item }}</li>
    </ul>
  </section>
</template>
