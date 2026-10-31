<script setup lang="ts">
import { computed } from 'vue'
import type { StatusCounts } from '@/composables/useCourseProgress'
import type { TermWeek } from '@/composables/useDashboard'
import { formatDate } from '@/utils/date'

/**
 * Ana Sayfa'nın üstündeki dönem çizelgesi (#9, #11): dönemin haftaları yan yana, her haftada
 * tamamlanan ve geciken görevler; altında dönemin ne kadarının geçtiği. Geçen süre ile
 * tamamlanan görev oranı yan yana durduğu için öğrenci takvimin önünde mi gerisinde mi, görür.
 */
const props = defineProps<{
  weeks: TermWeek[]
  elapsedPercent: number
  counts: StatusCounts
}>()

const first = computed(() => props.weeks[0])
const last = computed(() => props.weeks[props.weeks.length - 1])

/** "29 Ekim – 4 Kasım"; aynı aydaysa "22 – 28 Ekim". */
function rangeText(week: TermWeek) {
  const [startDay, startMonth] = formatDate(week.start).split(' ')
  const end = formatDate(week.end)
  return end.endsWith(startMonth ?? '')
    ? `${startDay} – ${end}`
    : `${formatDate(week.start)} – ${end}`
}

const share = (week: TermWeek) => (week.total === 0 ? 0 : (week.done / week.total) * 100)
</script>

<template>
  <section
    aria-labelledby="term-title"
    class="mb-5 rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
    data-test="overall-progress"
  >
    <div
      class="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b border-slate-200 px-4 py-3 sm:px-5 dark:border-slate-800"
    >
      <h2 id="term-title" class="font-semibold">Dönem çizelgesi</h2>
      <dl class="flex gap-6 text-sm">
        <div>
          <dt class="text-xs text-slate-500 dark:text-slate-400">Tamamlanan görev</dt>
          <dd class="font-semibold">
            <span data-test="overall-percent">%{{ counts.percent }}</span>
            <span
              class="ml-1 font-normal text-slate-500 dark:text-slate-400"
              data-test="overall-summary"
              >{{ counts.done }} / {{ counts.total }} görev</span
            >
          </dd>
        </div>
        <div>
          <dt class="text-xs text-slate-500 dark:text-slate-400">Geçen süre</dt>
          <dd class="font-semibold" data-test="elapsed">%{{ elapsedPercent }}</dd>
        </div>
      </dl>
    </div>

    <ol v-if="weeks.length" class="grid grid-cols-2 sm:grid-cols-4" aria-label="Dönemin haftaları">
      <li
        v-for="week in weeks"
        :key="week.weekNo"
        class="border-slate-200 px-4 py-3 not-last:border-r max-sm:nth-[2n]:border-r-0 max-sm:nth-[-n+2]:border-b sm:px-5 dark:border-slate-800"
        :class="week.state === 'current' && 'bg-indigo-50/70 dark:bg-indigo-500/10'"
        :aria-current="week.state === 'current' ? 'step' : undefined"
        data-test="term-week"
      >
        <div class="flex items-baseline justify-between gap-2">
          <p
            class="text-sm font-medium"
            :class="week.state === 'current' && 'text-indigo-700 dark:text-indigo-300'"
          >
            {{ week.weekNo }}. hafta
          </p>
          <span
            v-if="week.state === 'current'"
            class="text-xs font-medium text-indigo-700 dark:text-indigo-300"
          >
            Bu hafta
          </span>
        </div>
        <p class="text-xs text-slate-500 dark:text-slate-400">{{ rangeText(week) }}</p>

        <div class="mt-3 flex items-baseline justify-between gap-2">
          <p class="text-sm">
            <span class="text-base font-semibold">{{ week.done }}</span>
            <span class="text-slate-500 dark:text-slate-400"> / {{ week.total }} görev</span>
          </p>
          <p
            v-if="week.overdue"
            class="text-xs font-medium text-red-700 dark:text-red-400"
            data-test="week-overdue"
          >
            {{ week.overdue }} gecikti
          </p>
        </div>
        <div
          class="mt-1.5 h-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
          role="progressbar"
          :aria-label="`${week.weekNo}. haftanın görevleri`"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-valuenow="Math.round(share(week))"
        >
          <div
            class="h-full rounded-full bg-emerald-500 transition-[width] duration-300 motion-reduce:transition-none"
            :style="{ width: `${share(week)}%` }"
          />
        </div>
      </li>
    </ol>

    <!-- Zaman şeridi: haftalar eşit uzunlukta olduğu için dolu kısım hafta sütunlarıyla hizalanır. -->
    <div v-if="first && last" class="px-4 pt-1 pb-3 sm:px-5" aria-hidden="true">
      <div class="relative mt-2 h-1 rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          class="h-full rounded-full bg-indigo-600 dark:bg-indigo-400"
          :style="{ width: `${elapsedPercent}%` }"
        />
        <span
          v-if="elapsedPercent > 0 && elapsedPercent < 100"
          class="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-indigo-600 dark:border-slate-900 dark:bg-indigo-400"
          :style="{ left: `${elapsedPercent}%` }"
        />
      </div>
      <div class="mt-1.5 flex justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>{{ formatDate(first.start) }}</span>
        <span>Teslim: {{ formatDate(last.end) }}</span>
      </div>
    </div>
  </section>
</template>
