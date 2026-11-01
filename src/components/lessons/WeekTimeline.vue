<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Week } from '@/types/course'
import { WEEK_STATE_LABELS, type WeekState } from './weekState'

// Haftaların akışı (#42): mobilde dikey, geniş ekranda yatay çizelge.
// Şu anki hafta aria-current="step" ile ekran okuyucuya da bildirilir.
defineProps<{
  items: { week: Week; to: string; state: WeekState }[]
}>()

const DOT_CLASSES: Record<WeekState, string> = {
  done: 'border-emerald-600 bg-emerald-600 text-white dark:border-emerald-500 dark:bg-emerald-500',
  current:
    'border-indigo-600 bg-white text-indigo-700 ring-4 ring-indigo-100 dark:border-indigo-400 dark:bg-slate-900 dark:text-indigo-300 dark:ring-indigo-500/20',
  upcoming:
    'border-slate-300 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400',
}
</script>

<template>
  <ol class="flex flex-col gap-0 sm:flex-row">
    <li
      v-for="(item, i) in items"
      :key="item.week.id"
      class="relative flex flex-1 gap-3 pb-5 sm:flex-col sm:items-center sm:pb-0 sm:text-center"
      data-test="timeline-step"
    >
      <!-- Sonraki haftaya uzanan çizgi: mobilde aşağı, geniş ekranda sağa. -->
      <span
        v-if="i < items.length - 1"
        aria-hidden="true"
        class="absolute top-8 bottom-0 left-4 w-0.5 -translate-x-1/2 sm:top-4 sm:right-0 sm:bottom-auto sm:left-1/2 sm:h-0.5 sm:w-full sm:translate-x-0"
        :class="
          item.state === 'done'
            ? 'bg-emerald-500 dark:bg-emerald-500'
            : 'bg-slate-200 dark:bg-slate-800'
        "
      />
      <span
        aria-hidden="true"
        class="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold"
        :class="DOT_CLASSES[item.state]"
      >
        {{ item.state === 'done' ? '✓' : item.week.weekNo }}
      </span>
      <RouterLink
        :to="item.to"
        :aria-current="item.state === 'current' ? 'step' : undefined"
        class="rounded-md px-1 hover:underline sm:mt-2"
      >
        <span class="block text-sm font-medium">{{ item.week.weekNo }}. Hafta</span>
        <span class="block text-xs text-slate-600 dark:text-slate-400">{{ item.week.title }}</span>
        <span
          class="block text-xs font-medium"
          :class="
            item.state === 'current'
              ? 'text-indigo-700 dark:text-indigo-300'
              : item.state === 'done'
                ? 'text-emerald-700 dark:text-emerald-400'
                : 'text-slate-500 dark:text-slate-400'
          "
        >
          {{ WEEK_STATE_LABELS[item.state] }}
        </span>
      </RouterLink>
    </li>
  </ol>
</template>
