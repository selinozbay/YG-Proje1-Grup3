<script setup lang="ts">
import { RouterLink } from 'vue-router'
import TaskStatusSelect from '@/components/tasks/TaskStatusSelect.vue'
import { daysLeftText } from '@/composables/useDashboard'
import type { TaskStatus, TaskWithStatus } from '@/types/task'
import { formatDate } from '@/utils/date'

/**
 * Ana Sayfa'daki yaklaşan görevler (#13): son tarihe göre sıralı, durumu buradan da
 * değiştirilebilir. Tamamlanan görev listeden çıkar.
 */
defineProps<{
  tasks: TaskWithStatus[]
  /** Son tarihi geçmiş, bitmemiş görev sayısı. */
  overdueCount: number
  today: string
  courseTitle: (courseId: string) => string
}>()

const emit = defineEmits<{ 'status-change': [taskId: string, status: TaskStatus] }>()

const linkClass =
  'rounded text-sm font-medium text-indigo-700 hover:underline focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-indigo-300'
</script>

<template>
  <section
    aria-labelledby="upcoming-title"
    class="flex flex-col rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
    data-test="upcoming-tasks"
  >
    <div class="mb-3 flex items-baseline justify-between gap-3">
      <h2 id="upcoming-title" class="font-semibold">Yaklaşan görevler</h2>
      <RouterLink to="/gorevlerim" :class="linkClass">Tüm görevlerim</RouterLink>
    </div>

    <p
      v-if="overdueCount"
      class="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-500/10 dark:text-red-300"
      data-test="overdue"
    >
      {{ overdueCount }} görevin son tarihi geçti.
      <RouterLink
        to="/gorevlerim"
        class="rounded font-medium underline focus:ring-2 focus:ring-red-500 focus:outline-none"
      >
        Görevlerim'de bak
      </RouterLink>
    </p>

    <ul v-if="tasks.length" class="divide-y divide-slate-200 dark:divide-slate-800">
      <li
        v-for="task in tasks"
        :key="task.id"
        class="flex flex-col gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between sm:gap-3"
        data-test="upcoming-task"
      >
        <div class="min-w-0">
          <p class="leading-snug font-medium">{{ task.title }}</p>
          <p class="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
            <template v-if="task.custom"
              >Kendi görevim<template v-if="courseTitle(task.courseId)">
                · {{ courseTitle(task.courseId) }}</template
              ></template
            >
            <template v-else>{{ courseTitle(task.courseId) }} · {{ task.weekNo }}. hafta</template>
          </p>
          <p class="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
            <time :datetime="task.dueDate">{{ formatDate(task.dueDate!) }}</time>
            ·
            <span class="font-medium text-slate-900 dark:text-slate-100" data-test="days-left">{{
              daysLeftText(task.dueDate!, today)
            }}</span>
          </p>
        </div>
        <TaskStatusSelect
          class="shrink-0 self-start"
          :model-value="task.status"
          :label="`Durum: ${task.title}`"
          @update:model-value="emit('status-change', task.id, $event)"
        />
      </li>
    </ul>
    <p v-else class="text-sm text-slate-600 dark:text-slate-400" data-test="no-upcoming">
      Yaklaşan görevin yok.
    </p>
  </section>
</template>
