<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import CustomTaskForm from '@/components/tasks/CustomTaskForm.vue'
import TaskCard from '@/components/tasks/TaskCard.vue'
import TaskFilterBar from '@/components/tasks/TaskFilterBar.vue'
import { useTaskFilters } from '@/composables/useTaskFilters'
import { useTaskStatusChange } from '@/composables/useTaskStatusChange'
import { useCatalogStore } from '@/stores/catalog'
import { useProgressStore } from '@/stores/progress'
import type { CustomTaskInput } from '@/types/task'

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

const { saveError, changeStatus } = useTaskStatusChange()

// --- Kendi görevini ekleme, düzenleme, silme (#23) ---

/** Form kapalıysa null; yeni görev için 'new'; düzenlenen görevin id'si. */
const formTarget = ref<'new' | string | null>(null)
const formSaving = ref(false)
const formError = ref('')
/** Ekran okuyucuya duyurulan kısa bilgi: "Görev eklendi." gibi. */
const announcement = ref('')

const editingInitial = computed<CustomTaskInput | undefined>(() => {
  if (!formTarget.value || formTarget.value === 'new') return undefined
  const task = progress.customTasks[formTarget.value]
  return task && { ...task }
})

function openForm(target: 'new' | string) {
  formTarget.value = target
  formError.value = ''
  announcement.value = ''
}

function closeForm() {
  formTarget.value = null
  formError.value = ''
}

async function submitCustomTask(input: CustomTaskInput) {
  const editingId = formTarget.value === 'new' ? undefined : (formTarget.value ?? undefined)
  formSaving.value = true
  formError.value = ''
  try {
    await progress.saveCustomTask(input, editingId)
    closeForm()
    // Yeni görev bir filtre yüzünden gizli kalmasın.
    if (!editingId) resetFilters()
    announcement.value = editingId ? 'Görev güncellendi.' : 'Görev eklendi.'
  } catch {
    formError.value = 'Görev kaydedilemedi. Bağlantını kontrol edip tekrar dene.'
  } finally {
    formSaving.value = false
  }
}

async function deleteCustomTask(taskId: string) {
  saveError.value = ''
  try {
    await progress.deleteCustomTask(taskId)
    if (formTarget.value === taskId) closeForm()
    announcement.value = 'Görev silindi.'
  } catch {
    saveError.value = 'Görev silinemedi. Bağlantını kontrol edip tekrar dene.'
  }
}
</script>

<template>
  <PageHeader title="Görevlerim" description="Tüm derslerindeki görevler tek listede." />

  <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
    <p class="text-sm text-slate-600 dark:text-slate-400" data-test="summary">
      {{ summary.done }} / {{ summary.total }} görev tamamlandı
    </p>
    <button
      v-if="formTarget !== 'new'"
      type="button"
      class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none dark:bg-indigo-500 dark:hover:bg-indigo-400"
      data-test="add-task"
      @click="openForm('new')"
    >
      + Görev ekle
    </button>
  </div>

  <p class="sr-only" role="status" aria-live="polite">{{ announcement }}</p>

  <CustomTaskForm
    v-if="formTarget"
    :key="formTarget"
    :mode="formTarget === 'new' ? 'create' : 'edit'"
    :initial="editingInitial"
    :courses="courses"
    :saving="formSaving"
    :error="formError"
    @submit="submitCustomTask"
    @cancel="closeForm"
  />

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
    class="mb-8 divide-y divide-slate-200 overflow-hidden rounded-lg border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900"
    aria-label="Görevler"
  >
    <li v-for="task in filteredTasks" :key="task.id">
      <TaskCard
        :task="task"
        :course-title="courseTitle(task.courseId)"
        editable
        @status-change="changeStatus(task.id, $event)"
        @edit="openForm(task.id)"
        @delete="deleteCustomTask(task.id)"
      />
    </li>
  </ul>

  <div
    v-else
    class="rounded-lg border border-dashed border-slate-300 p-8 text-center dark:border-slate-700"
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
