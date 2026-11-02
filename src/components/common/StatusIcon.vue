<script setup lang="ts">
import type { TaskStatus } from '@/types/task'

/**
 * Görev durumunun simgesi: boş halka (yapılacak), yarısı dolu halka (devam ediyor),
 * onay işaretli dolu daire (tamamlandı). Renge bakmadan da durum şekilden anlaşılır.
 * `late`: son tarihi geçmiş, bitmemiş görev; halka kırmızı çizilir.
 * Yalnızca süstür; durumun adı her zaman yanında ya da bağlantının adında yazılı olmalı.
 */
withDefaults(defineProps<{ status: TaskStatus; late?: boolean }>(), { late: false })
</script>

<template>
  <svg viewBox="0 0 16 16" aria-hidden="true" class="shrink-0" :data-status="status">
    <template v-if="status === 'done'">
      <circle cx="8" cy="8" r="7" class="fill-emerald-600 dark:fill-emerald-500" />
      <path
        d="m5 8.2 2 2 4-4.2"
        fill="none"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="stroke-white dark:stroke-slate-950"
      />
    </template>
    <template v-else-if="status === 'in-progress'">
      <circle
        cx="8"
        cy="8"
        r="6.25"
        fill="none"
        stroke-width="1.5"
        :class="late ? 'stroke-red-500' : 'stroke-indigo-600 dark:stroke-indigo-400'"
      />
      <path d="M8 3.5a4.5 4.5 0 0 1 0 9z" class="fill-indigo-600 dark:fill-indigo-400" />
    </template>
    <circle
      v-else
      cx="8"
      cy="8"
      r="6.25"
      fill="none"
      :stroke-width="late ? 2 : 1.5"
      :class="late ? 'stroke-red-500' : 'stroke-slate-400 dark:stroke-slate-500'"
    />
  </svg>
</template>
