<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatusSplitBar from '@/components/common/StatusSplitBar.vue'
import CustomTaskForm from '@/components/tasks/CustomTaskForm.vue'
import TaskCard from '@/components/tasks/TaskCard.vue'
import TaskFilterBar from '@/components/tasks/TaskFilterBar.vue'
import { countStatuses } from '@/composables/useCourseProgress'
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

const summary = computed(() => countStatuses(progress.tasks))
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
  <PageHeader title="Görevlerim" description="Tüm derslerindeki görevler tek listede.">
    <template #aside>
      <button
        v-if="formTarget !== 'new'"
        type="button"
        class="inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-semibold shadow-[0_6px_16px_-8px_rgb(194_65_12/0.6)] bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-400 dark:text-slate-950 dark:hover:bg-indigo-300"
        data-test="add-task"
        @click="openForm('new')"
      >
        + Görev ekle
      </button>
    </template>
  </PageHeader>

  <!-- Özet: kaç görev bitti, durumların dağılımı. Sayılar filtre düğmelerinde de yazar. -->
  <div
    class="mb-6 flex flex-col gap-3 rounded-2xl bg-white p-4 ring-1 ring-slate-200 sm:flex-row sm:items-center sm:gap-6 sm:p-5 dark:bg-slate-900 dark:ring-slate-800"
  >
    <p class="shrink-0 text-slate-600 dark:text-slate-400" data-test="summary">
      <span
        class="text-3xl font-bold font-stretch-condensed text-slate-900 tabular-nums dark:text-white"
        >{{ summary.done }} / {{ summary.total }}</span
      >{{ ' ' }}<span class="text-sm">görev tamamlandı</span>
    </p>
    <StatusSplitBar
      class="w-full sm:flex-1"
      size="lg"
      :counts="summary"
      label="Görevlerin durumu"
    />
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
    class="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800 ring-1 ring-red-200 dark:bg-red-500/10 dark:text-red-200 dark:ring-red-900"
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
      class="rounded text-sm font-semibold text-indigo-700 underline underline-offset-4 hover:no-underline dark:text-indigo-300"
      @click="resetFilters"
    >
      Filtreleri temizle
    </button>
  </div>

  <ul
    v-if="filteredTasks.length"
    class="mb-8 divide-y divide-slate-200 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 dark:divide-slate-800 dark:bg-slate-900 dark:ring-slate-800"
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
    class="rounded-2xl border-2 border-dashed border-slate-300 px-6 py-10 text-center dark:border-slate-700"
    data-test="empty-state"
  >
    <p class="text-lg font-bold font-stretch-condensed">
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
      class="mt-5 rounded-xl px-4 py-2.5 text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-400 dark:text-slate-950 dark:hover:bg-indigo-300"
      @click="resetFilters"
    >
      Filtreleri temizle
    </button>
  </div>
</template>
