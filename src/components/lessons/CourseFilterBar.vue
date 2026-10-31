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
    class="mb-6 space-y-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
    aria-label="Arama ve filtreler"
  >
    <div>
      <label :for="searchId" class="mb-1 block text-sm font-medium">Ders ara</label>
      <input
        :id="searchId"
        v-model="query"
        type="search"
        placeholder="Ders kodu, adı ya da öğretim elemanı yaz"
        autocomplete="off"
        class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-none dark:border-slate-700 dark:bg-slate-950"
      />
    </div>

    <div class="flex flex-wrap gap-2" role="group" aria-label="Duruma göre filtrele">
      <button
        v-for="value in COURSE_STATUS_FILTERS"
        :key="value"
        type="button"
        :aria-pressed="status === value"
        class="rounded-full border px-3 py-1 text-sm transition-colors focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        :class="
          status === value
            ? 'border-indigo-600 bg-indigo-600 text-white dark:border-indigo-500 dark:bg-indigo-500'
            : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
        "
        @click="status = value"
      >
        {{ labelOf(value) }} <span class="ml-1 opacity-75">{{ counts[value] }}</span>
      </button>
    </div>
  </section>
</template>
