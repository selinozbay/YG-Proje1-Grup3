<script setup lang="ts">
import { useId } from 'vue'
import { COURSE_STATUS_LABELS } from '@/composables/useCourseProgress'
import { COURSE_STATUS_FILTERS, type CourseStatusFilter } from '@/composables/useCourseFilters'

/** Derslerim'de arama ve duruma göre filtre (#19). Görünümü Görevlerim'deki filtreyle aynı. */
defineProps<{ counts: Record<CourseStatusFilter, number> }>()

const query = defineModel<string>('query', { required: true })
const status = defineModel<CourseStatusFilter>('status', { required: true })

const labelOf = (value: CourseStatusFilter) =>
  value === 'all' ? 'Tümü' : COURSE_STATUS_LABELS[value]

const searchId = useId()
</script>

<template>
  <section
    class="mb-5 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3 sm:p-4 lg:flex-row lg:items-end dark:border-slate-800 dark:bg-slate-900"
    aria-label="Arama ve filtreler"
  >
    <div class="flex-1">
      <label
        :for="searchId"
        class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400"
        >Ders ara</label
      >
      <input
        :id="searchId"
        v-model="query"
        type="search"
        placeholder="Ders kodu, adı ya da öğretim elemanı yaz"
        autocomplete="off"
        class="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-none dark:border-slate-700 dark:bg-slate-950"
      />
    </div>

    <div
      class="inline-flex flex-wrap gap-0.5 self-start rounded-md bg-slate-100 p-0.5 lg:self-auto dark:bg-slate-800"
      role="group"
      aria-label="Duruma göre filtrele"
    >
      <button
        v-for="value in COURSE_STATUS_FILTERS"
        :key="value"
        type="button"
        :aria-pressed="status === value"
        class="rounded px-2.5 py-1 text-sm transition-colors focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        :class="
          status === value
            ? 'bg-white font-medium text-slate-900 shadow-[0_1px_2px_rgb(15_23_42/0.08)] dark:bg-slate-950 dark:text-slate-100'
            : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
        "
        @click="status = value"
      >
        {{ labelOf(value) }}
        <span class="ml-0.5 text-xs text-slate-500 dark:text-slate-400">{{ counts[value] }}</span>
      </button>
    </div>
  </section>
</template>
