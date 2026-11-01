<script setup lang="ts">
import { useId } from 'vue'
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

const fieldClass =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-none dark:border-slate-700 dark:bg-slate-950'
</script>

<template>
  <section
    class="mb-5 space-y-3 rounded-lg border border-slate-200 bg-white p-3 sm:p-4 dark:border-slate-800 dark:bg-slate-900"
    aria-label="Arama ve filtreler"
  >
    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div class="sm:col-span-2">
        <label
          :for="searchId"
          class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400"
          >Görev ara</label
        >
        <input
          :id="searchId"
          v-model="query"
          type="search"
          placeholder="Başlık, açıklama ya da etiket yaz"
          autocomplete="off"
          :class="fieldClass"
        />
      </div>
      <div>
        <label
          :for="courseSelectId"
          class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400"
          >Ders</label
        >
        <select :id="courseSelectId" v-model="courseId" :class="fieldClass">
          <option value="all">Tüm dersler</option>
          <option v-for="course in courses" :key="course.id" :value="course.id">
            {{ course.title }}
          </option>
        </select>
      </div>
      <div>
        <label
          :for="weekSelectId"
          class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400"
          >Hafta</label
        >
        <select :id="weekSelectId" v-model="weekNo" :class="fieldClass">
          <option value="all">Tüm haftalar</option>
          <option v-for="no in weekNos" :key="no" :value="no">{{ no }}. hafta</option>
        </select>
      </div>
    </div>

    <div
      class="inline-flex flex-wrap gap-0.5 rounded-md bg-slate-100 p-0.5 dark:bg-slate-800"
      role="group"
      aria-label="Duruma göre filtrele"
    >
      <button
        v-for="[value, label] in statusOptions"
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
        {{ label }}
        <span class="ml-0.5 text-xs text-slate-500 dark:text-slate-400">{{ counts[value] }}</span>
      </button>
    </div>
  </section>
</template>
