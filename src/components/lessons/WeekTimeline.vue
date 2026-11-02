<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Week } from '@/types/course'
import { WEEK_STATE_LABELS, type WeekState } from './weekState'

// Haftaların akışı (#42): bir hat üstünde duraklar gibi; mobilde dikey, geniş ekranda yatay.
// Tamamlanan duraklar yeşil, şu anki durak fosforlu sarı, sıradakiler boş halka.
// Şu anki hafta aria-current="step" ile ekran okuyucuya da bildirilir.
defineProps<{
  items: { week: Week; to: string; state: WeekState }[]
}>()

const DOT_CLASSES: Record<WeekState, string> = {
  done: 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950',
  current: 'bg-marker text-ink ring-[5px] ring-marker/35',
  upcoming:
    'bg-white text-slate-500 ring-2 ring-slate-300 ring-inset dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-700',
}
</script>

<template>
  <ol class="flex flex-col sm:flex-row">
    <li
      v-for="(item, i) in items"
      :key="item.week.id"
      class="relative flex flex-1 gap-4 pb-6 last:pb-0 sm:flex-col sm:items-center sm:gap-0 sm:pb-0 sm:text-center"
      data-test="timeline-step"
    >
      <!-- Sonraki haftaya uzanan hat: mobilde aşağı, geniş ekranda sağa. -->
      <span
        v-if="i < items.length - 1"
        aria-hidden="true"
        class="absolute top-10 bottom-0 left-5 w-1 -translate-x-1/2 rounded-full sm:top-5 sm:right-0 sm:bottom-auto sm:left-1/2 sm:h-1 sm:w-full sm:translate-x-0 sm:-translate-y-1/2"
        :class="item.state === 'done' ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'"
      />
      <span
        aria-hidden="true"
        class="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full text-base font-bold font-stretch-condensed"
        :class="DOT_CLASSES[item.state]"
      >
        <svg
          v-if="item.state === 'done'"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-5"
        >
          <path d="m5 10.5 3.2 3L15 6.5" />
        </svg>
        <template v-else>{{ item.week.weekNo }}</template>
      </span>
      <RouterLink
        :to="item.to"
        :aria-current="item.state === 'current' ? 'step' : undefined"
        class="rounded-md px-1 hover:underline sm:mt-3"
      >
        <span class="block text-sm font-bold">{{ item.week.weekNo }}. Hafta</span>
        <span class="block text-sm text-slate-600 dark:text-slate-400">{{ item.week.title }}</span>
        <span
          class="mt-1 inline-block text-xs font-semibold"
          :class="
            item.state === 'current'
              ? 'rounded bg-marker px-1.5 py-px text-ink'
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
