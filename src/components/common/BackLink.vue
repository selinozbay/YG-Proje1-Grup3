<script setup lang="ts">
import { RouterLink } from 'vue-router'

/** Sayfa başlığının üstündeki "bir üst sayfaya dön" bağlantısı (ders ve hafta detayı). */
defineProps<{ to: string }>()
</script>

<template>
  <RouterLink
    :to="to"
    class="group -ml-2 mb-4 inline-flex max-w-full items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-white hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
    data-test="back-link"
  >
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      class="size-4 shrink-0 transition-transform group-hover:-translate-x-0.5"
    >
      <path
        fill-rule="evenodd"
        d="M12.79 5.23a.75.75 0 0 1-.02 1.06L8.83 10l3.94 3.71a.75.75 0 1 1-1.04 1.08l-4.5-4.25a.75.75 0 0 1 0-1.08l4.5-4.25a.75.75 0 0 1 1.06.02z"
        clip-rule="evenodd"
      />
    </svg>
    <span class="truncate"><slot /></span>
  </RouterLink>
</template>
