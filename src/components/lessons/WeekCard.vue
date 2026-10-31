<script setup lang="ts">
import { RouterLink } from 'vue-router'
import ProgressBar from '@/components/common/ProgressBar.vue'
import type { Week } from '@/types/course'
import { WEEK_STATE_CLASSES, WEEK_STATE_LABELS, type WeekState } from './weekState'

// Ders detayındaki hafta kartı (#40, #41). Kartın tamamı hafta detayına götüren bağlantıdır.
defineProps<{
  week: Week
  to: string
  progress: { done: number; total: number; percent: number }
  state: WeekState
}>()
</script>

<template>
  <RouterLink
    :to="to"
    class="flex h-full flex-col rounded-xl border bg-white p-5 shadow-sm transition-colors hover:border-indigo-400 dark:bg-slate-900 dark:hover:border-indigo-500"
    :class="
      state === 'current'
        ? 'border-indigo-300 ring-1 ring-indigo-300 dark:border-indigo-500/60 dark:ring-indigo-500/60'
        : 'border-slate-200 dark:border-slate-800'
    "
    data-test="week-card"
  >
    <div class="mb-2 flex items-center justify-between gap-3">
      <span class="text-sm font-medium text-indigo-700 dark:text-indigo-300">
        {{ week.weekNo }}. Hafta
      </span>
      <span
        class="rounded-full px-2.5 py-0.5 text-xs font-medium"
        :class="WEEK_STATE_CLASSES[state]"
      >
        {{ WEEK_STATE_LABELS[state] }}
      </span>
    </div>
    <h3 class="text-lg font-semibold">{{ week.title }}</h3>
    <p class="mt-1 mb-4 flex-1 text-sm text-slate-600 dark:text-slate-400">
      {{ week.description }}
    </p>
    <p class="mb-1.5 text-xs text-slate-600 dark:text-slate-400">
      {{ progress.done }} / {{ progress.total }} görev tamamlandı
    </p>
    <ProgressBar :value="progress.percent" :label="`${week.weekNo}. haftanın ilerlemesi`" />
  </RouterLink>
</template>
