<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef } from 'vue'
import { TASK_STATUS_LABELS, type TaskStatus, type TaskWithStatus } from '@/types/task'
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

const actionClass =
  'rounded-md px-2.5 py-1 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none'
</script>

<template>
  <article
    class="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
  >
    <div class="flex items-start justify-between gap-3">
      <component :is="`h${headingLevel}`" class="leading-snug font-semibold">
        {{ task.title }}
      </component>
      <TaskStatusSelect
        v-if="editable"
        class="shrink-0"
        :model-value="task.status"
        :label="`Durum: ${task.title}`"
        @update:model-value="emit('status-change', $event)"
      />
      <span
        v-else
        class="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium"
        :class="STATUS_CLASSES[task.status]"
        data-test="status"
      >
        {{ TASK_STATUS_LABELS[task.status] }}
      </span>
    </div>

    <p class="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
      <span
        v-if="task.custom"
        class="rounded-md bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-800 dark:bg-violet-500/15 dark:text-violet-300"
        data-test="custom-badge"
      >
        Kendi görevim
      </span>
      <span v-if="metaText">{{ metaText }}</span>
    </p>

    <p v-if="task.description" class="mt-3 text-sm text-slate-700 dark:text-slate-300">
      {{ task.description }}
    </p>

    <div class="mt-auto flex flex-wrap items-center gap-2 pt-4 text-xs">
      <time
        v-if="task.dueDate"
        :datetime="task.dueDate"
        class="text-slate-600 dark:text-slate-400"
        data-test="due-date"
      >
        Son tarih: {{ dueDateText }}
      </time>
      <ul v-if="task.tags.length" class="flex flex-wrap gap-1.5" aria-label="Etiketler">
        <li
          v-for="tag in task.tags"
          :key="tag"
          class="rounded-md bg-indigo-50 px-2 py-0.5 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300"
        >
          #{{ tag }}
        </li>
      </ul>
    </div>

    <div
      v-if="editable && task.custom"
      class="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-3 text-sm dark:border-slate-800"
    >
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
        <span class="mr-auto font-medium">Bu görev silinsin mi?</span>
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
  </article>
</template>
