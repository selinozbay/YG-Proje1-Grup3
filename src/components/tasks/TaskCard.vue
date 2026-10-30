<script setup lang="ts">
import { computed } from 'vue'
import { TASK_STATUS_LABELS, type TaskStatus, type TaskWithStatus } from '@/types/task'

const props = defineProps<{ task: TaskWithStatus; courseTitle: string }>()

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

const STATUS_CLASSES: Record<TaskStatus, string> = {
  todo: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  'in-progress': 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
  done: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300',
}
</script>

<template>
  <article
    class="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
  >
    <div class="flex items-start justify-between gap-3">
      <h2 class="leading-snug font-semibold">{{ task.title }}</h2>
      <span
        class="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium"
        :class="STATUS_CLASSES[task.status]"
        data-test="status"
      >
        {{ TASK_STATUS_LABELS[task.status] }}
      </span>
    </div>

    <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
      {{ courseTitle }} · {{ task.weekNo }}. hafta
    </p>

    <p class="mt-3 text-sm text-slate-700 dark:text-slate-300">{{ task.description }}</p>

    <div class="mt-auto flex flex-wrap items-center gap-2 pt-4 text-xs">
      <time
        v-if="task.dueDate"
        :datetime="task.dueDate"
        class="text-slate-600 dark:text-slate-400"
        data-test="due-date"
      >
        Son tarih: {{ dueDateText }}
      </time>
      <ul class="flex flex-wrap gap-1.5" aria-label="Etiketler">
        <li
          v-for="tag in task.tags"
          :key="tag"
          class="rounded-md bg-indigo-50 px-2 py-0.5 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300"
        >
          #{{ tag }}
        </li>
      </ul>
    </div>
  </article>
</template>
