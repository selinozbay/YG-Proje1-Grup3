<script setup lang="ts">
import StatusIcon from './StatusIcon.vue'
import { STATUS_SEGMENTS } from './statusSegments'

/**
 * Durum renklerinin açıklaması. `counts` verilirse her durumun yanında sayısı da yazar
 * (tek çubuklu kartlarda); verilmezse yalnızca adlar (birden çok satırlı grafiklerde).
 */
defineProps<{ counts?: { done: number; inProgress: number; todo: number } }>()
</script>

<template>
  <ul
    class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-400"
    data-test="status-legend"
  >
    <li v-for="segment in STATUS_SEGMENTS" :key="segment.key" class="flex items-center gap-1.5">
      <StatusIcon :status="segment.status" class="size-3.5" />
      <span>{{ counts ? `${segment.label}:` : segment.label }}</span>
      <span
        v-if="counts"
        class="font-semibold text-slate-900 tabular-nums dark:text-slate-100"
        :data-test="`legend-${segment.key}`"
      >
        {{ counts[segment.key] }}
      </span>
    </li>
  </ul>
</template>
