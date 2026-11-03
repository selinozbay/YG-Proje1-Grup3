<script setup lang="ts">
import { useId } from 'vue'
import StatusIcon from '@/components/common/StatusIcon.vue'
import { TASK_STATUS_LABELS, type TaskStatus } from '@/types/task'
import type { StatusFilter, WeekFilter } from '@/composables/useTaskFilters'

defineProps<{
  courses: { id: string; title: string }[]
  weekNos: number[]
  counts: Record<StatusFilter, number>
}>()

const query = defineModel<string>('query', { required: true })
const status = defineModel<StatusFilter>('status', { required: true })
const courseId = defineModel<string>('courseId', { required: true })
const weekNo = defineModel<WeekFilter>('weekNo', { required: true })

const statusOptions: [StatusFilter, string][] = [
  ['all', 'Tümü'],
  ...(Object.entries(TASK_STATUS_LABELS) as [TaskStatus, string][]),
]

const searchId = useId()
const courseSelectId = useId()
const weekSelectId = useId()

const labelClass = 'mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300'
const fieldClass =
  'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-none dark:border-slate-700 dark:bg-slate-950'
</script>

<!-- Görevlerim'de arama, ders, hafta ve duruma göre filtre (#20–#22). -->
<template>
  <section
    class="mb-5 space-y-4 rounded-2xl bg-white p-4 ring-1 ring-slate-200 sm:p-5 dark:bg-slate-900 dark:ring-slate-800"
    aria-label="Arama ve filtreler"
  >
    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div class="sm:col-span-2">
        <label :for="searchId" :class="labelClass">Görev ara</label>
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
            placeholder="Başlık, açıklama ya da etiket yaz"
            autocomplete="off"
            :class="[fieldClass, 'pl-9 placeholder:text-slate-400']"
          />
        </div>
      </div>
      <div>
        <label :for="courseSelectId" :class="labelClass">Ders</label>
        <select :id="courseSelectId" v-model="courseId" :class="fieldClass">
          <option value="all">Tüm dersler</option>
          <option v-for="course in courses" :key="course.id" :value="course.id">
            {{ course.title }}
          </option>
        </select>
      </div>
      <div>
        <label :for="weekSelectId" :class="labelClass">Hafta</label>
        <select :id="weekSelectId" v-model="weekNo" :class="fieldClass">
          <option value="all">Tüm haftalar</option>
          <option v-for="no in weekNos" :key="no" :value="no">{{ no }}. hafta</option>
        </select>
      </div>
    </div>

    <div class="flex flex-wrap gap-1.5" role="group" aria-label="Duruma göre filtrele">
      <button
        v-for="[value, label] in statusOptions"
        :key="value"
        type="button"
        :aria-pressed="status === value"
        class="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-colors"
        :class="
          status === value
            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
        "
        @click="status = value"
      >
        <StatusIcon v-if="value !== 'all'" :status="value" class="size-4" />
        {{ label }}
        <span
          class="text-xs tabular-nums"
          :class="status === value ? 'opacity-80' : 'text-slate-500 dark:text-slate-400'"
          >{{ counts[value] }}</span
        >
      </button>
    </div>
  </section>
</template>
