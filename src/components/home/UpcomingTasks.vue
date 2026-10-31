<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import TaskStatusSelect from '@/components/tasks/TaskStatusSelect.vue'
import { courseColor } from '@/components/lessons/courseColors'
import { daysLeftText, groupByDueDate } from '@/composables/useDashboard'
import type { TaskStatus, TaskWithStatus } from '@/types/task'
import { formatDayLong } from '@/utils/date'

/**
 * Ana Sayfa'daki yaklaşan görevler (#13): son tarihe göre günlere ayrılmış bir ajanda.
 * Durum buradan da değiştirilebilir; tamamlanan görev listeden çıkar.
 */
const props = defineProps<{
  tasks: TaskWithStatus[]
  /** Son tarihi geçmiş, bitmemiş görev sayısı. */
  overdueCount: number
  today: string
  courseTitle: (courseId: string) => string
}>()

const emit = defineEmits<{ 'status-change': [taskId: string, status: TaskStatus] }>()

const groups = computed(() => groupByDueDate(props.tasks))

function metaText(task: TaskWithStatus) {
  const title = props.courseTitle(task.courseId)
  if (task.custom) return title ? `Kendi görevim, ${title}` : 'Kendi görevim'
  return `${title}, ${task.weekNo}. hafta`
}
</script>

<template>
  <section
    aria-labelledby="upcoming-title"
    class="rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
    data-test="upcoming-tasks"
  >
    <div
      class="flex items-baseline justify-between gap-3 border-b border-slate-200 px-4 py-3 sm:px-5 dark:border-slate-800"
    >
      <h2 id="upcoming-title" class="font-semibold">Yaklaşan görevler</h2>
      <RouterLink
        to="/gorevlerim"
        class="rounded text-sm text-indigo-700 hover:underline focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-indigo-300"
      >
        Tüm görevlerim
      </RouterLink>
    </div>

    <p
      v-if="overdueCount"
      class="border-b border-slate-200 bg-red-50 px-4 py-2 text-sm text-red-800 sm:px-5 dark:border-slate-800 dark:bg-red-500/10 dark:text-red-300"
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

    <div v-if="groups.length">
      <section
        v-for="group in groups"
        :key="group.date"
        :aria-label="formatDayLong(group.date)"
        class="border-b border-slate-200 last:border-b-0 dark:border-slate-800"
      >
        <h3
          class="flex items-baseline justify-between gap-3 bg-slate-50 px-4 py-1.5 text-xs font-medium text-slate-600 sm:px-5 dark:bg-slate-800/40 dark:text-slate-400"
        >
          <time :datetime="group.date">{{ formatDayLong(group.date) }}</time>
          <span data-test="days-left">{{ daysLeftText(group.date, today) }}</span>
        </h3>
        <ul class="divide-y divide-slate-100 dark:divide-slate-800">
          <li
            v-for="task in group.tasks"
            :key="task.id"
            class="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4 sm:px-5"
            data-test="upcoming-task"
          >
            <div class="flex min-w-0 gap-3">
              <span
                class="mt-1.5 size-2 shrink-0 rounded-sm"
                :class="courseColor(task.courseId).bar"
                aria-hidden="true"
              />
              <div class="min-w-0">
                <p class="text-sm leading-snug font-medium">{{ task.title }}</p>
                <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {{ metaText(task) }}
                </p>
              </div>
            </div>
            <TaskStatusSelect
              class="shrink-0 self-start max-sm:ml-5"
              :model-value="task.status"
              :label="`Durum: ${task.title}`"
              @update:model-value="emit('status-change', task.id, $event)"
            />
          </li>
        </ul>
      </section>
    </div>
    <p
      v-else
      class="px-4 py-6 text-sm text-slate-600 sm:px-5 dark:text-slate-400"
      data-test="no-upcoming"
    >
      Son tarihi yaklaşan görevin yok. Yeni görevler Görevlerim'de.
    </p>
  </section>
</template>
