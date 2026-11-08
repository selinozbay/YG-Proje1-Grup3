<script setup lang="ts">
import { useId } from 'vue'
import StatusIcon from '@/components/common/StatusIcon.vue'
import { COURSE_STATUS_LABELS } from '@/composables/useCourseProgress'
import { COURSE_STATUS_FILTERS, type CourseStatusFilter } from '@/composables/useCourseFilters'
import type { TaskStatus } from '@/types/task'

/** Derslerim'de arama ve duruma göre filtre (#19). Görünümü Görevlerim'deki filtreyle aynı. */
defineProps<{ counts: Record<CourseStatusFilter, number> }>()

const query = defineModel<string>('query', { required: true })
const status = defineModel<CourseStatusFilter>('status', { required: true })

const labelOf = (value: CourseStatusFilter) =>
  value === 'all' ? 'Tümü' : COURSE_STATUS_LABELS[value]

/** Filtre düğmelerindeki simge; "Tümü"nün simgesi yok. */
const ICONS: Partial<Record<CourseStatusFilter, TaskStatus>> = {
  'not-started': 'todo',
  'in-progress': 'in-progress',
  done: 'done',
}

const searchId = useId()
</script>

<template>
  <section
    class="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between"
    aria-label="Arama ve filtreler"
  >
    <div class="w-full lg:max-w-md">
      <label
        :for="searchId"
        class="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300"
        >Ders ara</label
      >
      <div class="relative">
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400"
        >
          <path
            fill-rule="evenodd"
            d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11zM2 9a7 7 0 1 1 12.45 4.39l3.08 3.08a.75.75 0 1 1-1.06 1.06l-3.08-3.08A7 7 0 0 1 2 9z"
            clip-rule="evenodd"
          />
        </svg>
        <input
          :id="searchId"
          v-model="query"
          type="search"
          placeholder="Ders kodu, adı ya da öğretim elemanı yaz"
          autocomplete="off"
          class="field pl-9"
        />
      </div>
    </div>

    <div class="flex flex-wrap gap-1.5" role="group" aria-label="Duruma göre filtrele">
      <button
        v-for="value in COURSE_STATUS_FILTERS"
        :key="value"
        type="button"
        :aria-pressed="status === value"
        class="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-colors"
        :class="
          status === value
            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
            : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-800'
        "
        @click="status = value"
      >
        <StatusIcon v-if="ICONS[value]" :status="ICONS[value]!" class="size-4" />
        {{ labelOf(value) }}
        <span
          class="text-xs tabular-nums"
          :class="status === value ? 'opacity-80' : 'text-slate-500 dark:text-slate-400'"
          >{{ counts[value] }}</span
        >
      </button>
    </div>
  </section>
</template>
