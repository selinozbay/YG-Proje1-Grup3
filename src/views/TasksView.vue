<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import TaskCard from '@/components/tasks/TaskCard.vue'
import TaskFilterBar from '@/components/tasks/TaskFilterBar.vue'
import { useTaskFilters } from '@/composables/useTaskFilters'
import { useCatalogStore } from '@/stores/catalog'
import { useProgressStore } from '@/stores/progress'
import type { TaskStatus } from '@/types/task'

const catalog = useCatalogStore()
const progress = useProgressStore()

const { filters, filteredTasks, statusCounts, isFiltered, resetFilters } = useTaskFilters(
  () => progress.tasks,
)

const summary = computed(() => progress.summarize(progress.tasks))
const courses = computed(() => catalog.courses.map(({ id, title }) => ({ id, title })))

/** Hafta seçenekleri: bir ders seçiliyse yalnızca o dersin haftaları. */
const weekNos = computed(() => {
  const weeks = filters.courseId === 'all' ? catalog.weeks : catalog.getWeeks(filters.courseId)
  return [...new Set(weeks.map((week) => week.weekNo))].sort((a, b) => a - b)
})

// Ders değişince seçili hafta o derste yoksa "Tüm haftalar"a dönülür.
watch(weekNos, (available) => {
  if (filters.weekNo !== 'all' && !available.includes(filters.weekNo)) filters.weekNo = 'all'
})

const courseTitle = (courseId: string) => catalog.getCourse(courseId)?.title ?? ''

const saveError = ref('')

async function changeStatus(taskId: string, status: TaskStatus) {
  saveError.value = ''
  try {
    await progress.setStatus(taskId, status)
  } catch {
    // Store eski durumu geri yükler; kullanıcıya neden değişmediğini söyleriz.
    saveError.value = 'Görevin durumu kaydedilemedi. Bağlantını kontrol edip tekrar dene.'
  }
}
</script>

<template>
  <PageHeader title="Görevlerim" description="Tüm derslerindeki görevler tek listede." />

  <p class="mb-4 text-sm text-slate-600 dark:text-slate-400" data-test="summary">
    {{ summary.done }} / {{ summary.total }} görev tamamlandı
  </p>

  <TaskFilterBar
    v-model:query="filters.query"
    v-model:status="filters.status"
    v-model:course-id="filters.courseId"
    v-model:week-no="filters.weekNo"
    :courses="courses"
    :week-nos="weekNos"
    :counts="statusCounts"
  />

  <p
    v-if="saveError"
    role="alert"
    class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
  >
    {{ saveError }}
  </p>

  <div class="mb-3 flex min-h-8 items-center justify-between gap-3">
    <p class="text-sm text-slate-600 dark:text-slate-400" aria-live="polite">
      {{ filteredTasks.length }} görev gösteriliyor
    </p>
    <button
      v-if="isFiltered && filteredTasks.length"
      type="button"
      class="text-sm text-indigo-600 underline hover:no-underline dark:text-indigo-400"
      @click="resetFilters"
    >
      Filtreleri temizle
    </button>
  </div>

  <ul
    v-if="filteredTasks.length"
    class="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
    aria-label="Görevler"
  >
    <li v-for="task in filteredTasks" :key="task.id">
      <TaskCard
        :task="task"
        :course-title="courseTitle(task.courseId)"
        editable
        @status-change="changeStatus(task.id, $event)"
      />
    </li>
  </ul>

  <div
    v-else
    class="rounded-xl border-2 border-dashed border-slate-300 p-8 text-center dark:border-slate-700"
    data-test="empty-state"
  >
    <p class="font-semibold">
      {{ isFiltered ? 'Aradığın görev bulunamadı' : 'Henüz görev yok' }}
    </p>
    <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
      {{
        isFiltered
          ? 'Farklı bir kelime dene ya da filtreleri temizle.'
          : 'Derslerine görev eklendiğinde burada görünecek.'
      }}
    </p>
    <button
      v-if="isFiltered"
      type="button"
      class="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none dark:bg-indigo-500 dark:hover:bg-indigo-400"
      @click="resetFilters"
    >
      Filtreleri temizle
    </button>
  </div>
</template>
