<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef } from 'vue'
import { TASK_STATUS_LABELS, type TaskStatus, type TaskWithStatus } from '@/types/task'
import StatusIcon from '@/components/common/StatusIcon.vue'
import { courseColor } from '@/components/lessons/courseColors'
import { toISODate } from '@/utils/date'
import TaskStatusSelect from './TaskStatusSelect.vue'
import { STATUS_CLASSES } from './statusStyles'

const props = withDefaults(
  defineProps<{
    task: TaskWithStatus
    courseTitle: string
    /**
     * true ise durum rozeti yerine durumu değiştiren seçici gösterilir;
     * kullanıcının kendi görevlerinde Düzenle ve Sil düğmeleri de çıkar.
     */
    editable?: boolean
    /** Başlık seviyesi: kartlar bir h2 bölümünün içindeyse 3 verin. */
    headingLevel?: 2 | 3
  }>(),
  { editable: false, headingLevel: 2 },
)

const emit = defineEmits<{
  'status-change': [status: TaskStatus]
  edit: []
  delete: []
}>()

// "2026-10-21" → "21 Ekim 2026". Saati eklemek tarihin yerel saatle okunmasını sağlar;
// yoksa bazı saat dilimlerinde bir önceki gün görünür.
const dueDateText = computed(() =>
  props.task.dueDate
    ? new Date(`${props.task.dueDate}T00:00:00`).toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '',
)

/** Ders görevinde "Ders · N. hafta"; kendi görevinde (haftası yok) yalnızca ders adı. */
const metaText = computed(() =>
  props.task.custom ? props.courseTitle : `${props.courseTitle} · ${props.task.weekNo}. hafta`,
)

/** Son tarihi geçmiş, bitmemiş görev: tarih kırmızı yazılır ve "Süresi geçti" eklenir. */
const late = computed(
  () =>
    props.task.status !== 'done' &&
    !!props.task.dueDate &&
    props.task.dueDate < toISODate(new Date()),
)

/** Soldaki şerit dersin renginde; derse bağlı olmayan kendi görevinde gri. */
const stripClass = computed(() =>
  props.task.courseId ? courseColor(props.task.courseId).bar : 'bg-slate-300 dark:bg-slate-600',
)

// Silmeden önce kartın içinde onay istenir.
const confirmingDelete = ref(false)
const cancelDeleteButton = useTemplateRef<HTMLButtonElement>('cancelDeleteButton')

async function askDelete() {
  confirmingDelete.value = true
  await nextTick()
  cancelDeleteButton.value?.focus()
}

function confirmDelete() {
  confirmingDelete.value = false
  emit('delete')
}

const actionClass = 'rounded-md px-2 py-1 font-semibold'
</script>

<template>
  <!--
    Listede bir satır: solda dersin renginde ince şerit, başlık ve ayrıntılar; sağda durum.
    Tamamlanan görevin başlığı üstü çizili görünür. Liste çerçevesini sayfa çizer.
  -->
  <article
    class="relative flex flex-col gap-3 py-4 pr-4 pl-5 sm:flex-row sm:items-start sm:gap-6 sm:pr-5 sm:pl-6"
  >
    <span
      class="absolute top-4 bottom-4 left-0 w-1 rounded-r-full"
      :class="stripClass"
      aria-hidden="true"
    />
    <div class="min-w-0 flex-1">
      <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
        <component
          :is="`h${headingLevel}`"
          class="text-base leading-snug font-semibold"
          :class="
            task.status === 'done' &&
            'text-slate-500 line-through decoration-emerald-500/70 decoration-2 dark:text-slate-400'
          "
        >
          {{ task.title }}
        </component>
        <span
          v-if="task.custom"
          class="rounded-md bg-slate-100 px-1.5 py-px text-[0.6875rem] font-semibold text-slate-700 ring-1 ring-slate-200 ring-inset dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700"
          data-test="custom-badge"
        >
          Kendi görevim
        </span>
      </div>
      <p v-if="metaText" class="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
        {{ metaText }}
      </p>

      <p v-if="task.description" class="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
        {{ task.description }}
      </p>

      <div
        v-if="task.dueDate || task.tags.length"
        class="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs"
      >
        <span
          v-if="task.dueDate"
          class="inline-flex items-center gap-1.5"
          :class="
            late
              ? 'font-semibold text-red-700 dark:text-red-400'
              : 'text-slate-600 dark:text-slate-400'
          "
        >
          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="size-3.5 shrink-0">
            <path
              fill-rule="evenodd"
              d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z"
              clip-rule="evenodd"
            />
          </svg>
          <time :datetime="task.dueDate" data-test="due-date">Son tarih: {{ dueDateText }}</time>
          <span
            v-if="late"
            class="rounded bg-red-100 px-1.5 py-px font-semibold text-red-800 dark:bg-red-500/15 dark:text-red-300"
            >Süresi geçti</span
          >
        </span>
        <ul v-if="task.tags.length" class="flex flex-wrap gap-1.5" aria-label="Etiketler">
          <li
            v-for="tag in task.tags"
            :key="tag"
            class="rounded-md bg-slate-100 px-1.5 py-px text-slate-600 dark:bg-slate-800 dark:text-slate-400"
          >
            #{{ tag }}
          </li>
        </ul>
      </div>

      <div v-if="editable && task.custom" class="mt-3 flex flex-wrap items-center gap-1 text-xs">
        <template v-if="!confirmingDelete">
          <button
            type="button"
            :class="[
              actionClass,
              'text-indigo-700 hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-indigo-500/15',
            ]"
            :aria-label="`${task.title} görevini düzenle`"
            data-test="edit-task"
            @click="emit('edit')"
          >
            Düzenle
          </button>
          <button
            type="button"
            :class="[
              actionClass,
              'text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/15',
            ]"
            :aria-label="`${task.title} görevini sil`"
            data-test="delete-task"
            @click="askDelete"
          >
            Sil
          </button>
        </template>
        <template v-else>
          <span class="mr-2 font-semibold">Bu görev silinsin mi?</span>
          <button
            type="button"
            :class="[actionClass, 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-500']"
            data-test="confirm-delete"
            @click="confirmDelete"
          >
            Evet, sil
          </button>
          <button
            ref="cancelDeleteButton"
            type="button"
            :class="[actionClass, 'hover:bg-slate-100 dark:hover:bg-slate-800']"
            data-test="cancel-delete"
            @click="confirmingDelete = false"
          >
            Vazgeç
          </button>
        </template>
      </div>
    </div>

    <div class="shrink-0 sm:pt-px">
      <TaskStatusSelect
        v-if="editable"
        :model-value="task.status"
        :label="`Durum: ${task.title}`"
        @update:model-value="emit('status-change', $event)"
      />
      <span
        v-else
        class="inline-flex items-center gap-1.5 rounded-full py-1 pr-2.5 pl-1.5 text-xs font-semibold"
        :class="STATUS_CLASSES[task.status]"
        data-test="status"
      >
        <StatusIcon :status="task.status" class="size-4" />{{ TASK_STATUS_LABELS[task.status] }}
      </span>
    </div>
  </article>
</template>
