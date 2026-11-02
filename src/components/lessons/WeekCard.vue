<script setup lang="ts">
import { RouterLink } from 'vue-router'
import ProgressBar from '@/components/common/ProgressBar.vue'
import type { Week } from '@/types/course'
import { WEEK_STATE_CLASSES, WEEK_STATE_LABELS, type WeekState } from './weekState'

/**
 * Ders detayındaki hafta kartı (#40, #41). Kartın tamamı hafta detayına götüren bağlantıdır.
 * Solda büyük hafta numarası; şu anki hafta fosforlu sarı çerçeveyle işaretlidir.
 */
withDefaults(
  defineProps<{
    week: Week
    to: string
    progress: { done: number; total: number; percent: number }
    state: WeekState
    /** İlerleme çubuğunun rengi (dersin rengi). */
    barClass?: string
  }>(),
  { barClass: 'bg-emerald-500' },
)
</script>

<template>
  <RouterLink
    :to="to"
    class="group flex h-full gap-4 rounded-2xl bg-white p-5 ring-1 transition-shadow hover:shadow-[0_6px_24px_-12px_rgb(20_24_58/0.35)] dark:bg-slate-900"
    :class="
      state === 'current'
        ? 'ring-[3px] ring-marker'
        : 'ring-slate-200 hover:ring-slate-300 dark:ring-slate-800 dark:hover:ring-slate-700'
    "
    data-test="week-card"
  >
    <span
      class="w-10 shrink-0 text-5xl leading-[0.85] font-bold font-stretch-condensed tabular-nums"
      :class="
        state === 'upcoming' ? 'text-slate-300 dark:text-slate-600' : 'text-ink dark:text-white'
      "
      aria-hidden="true"
      >{{ week.weekNo }}</span
    >
    <div class="flex min-w-0 flex-1 flex-col">
      <div class="mb-1.5 flex flex-wrap items-center justify-between gap-2">
        <span class="text-sm font-semibold text-slate-600 dark:text-slate-400">
          {{ week.weekNo }}. Hafta
        </span>
        <span
          class="rounded-full px-2.5 py-0.5 text-xs font-semibold"
          :class="WEEK_STATE_CLASSES[state]"
        >
          {{ WEEK_STATE_LABELS[state] }}
        </span>
      </div>
      <h3 class="text-lg leading-snug font-bold font-stretch-condensed group-hover:underline">
        {{ week.title }}
      </h3>
      <p class="mt-1 mb-4 flex-1 text-sm text-slate-600 dark:text-slate-400">
        {{ week.description }}
      </p>
      <p class="mb-1.5 text-xs text-slate-600 dark:text-slate-400">
        {{ progress.done }} / {{ progress.total }} görev tamamlandı
      </p>
      <ProgressBar
        :value="progress.percent"
        :label="`${week.weekNo}. haftanın ilerlemesi`"
        :bar-class="barClass"
      />
    </div>
  </RouterLink>
</template>
