<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import TaskStatusSelect from '@/components/tasks/TaskStatusSelect.vue'
import { courseColor } from '@/components/lessons/courseColors'
import { daysLeftText, groupByDueDate } from '@/composables/useDashboard'
import type { TaskStatus, TaskWithStatus } from '@/types/task'
import { formatDayLong } from '@/utils/date'

/**
 * Ana Sayfa'daki yaklaşan görevler (#13): bir ajanda sayfası gibi, solda gün, sağda o gün
 * teslim edilecek görevler. En yakın gün fosforlu sarıyla işaretlidir.
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

const groups = computed(() =>
  groupByDueDate(props.tasks).map((group) => {
    // "2 Kasım Pazartesi" → büyük gün sayısı ve yanında ay ile gün adı.
    const [day = '', ...rest] = formatDayLong(group.date).split(' ')
    return { ...group, day, rest: rest.join(' ') }
  }),
)

function metaText(task: TaskWithStatus) {
  const title = props.courseTitle(task.courseId)
  if (task.custom) return title ? `Kendi görevim, ${title}` : 'Kendi görevim'
  return `${title}, ${task.weekNo}. hafta`
}

/** Kendi görevi bir derse bağlı değilse renk şeridi nötr gri olur. */
const stripClass = (task: TaskWithStatus) =>
  task.courseId ? courseColor(task.courseId).bar : 'bg-slate-300 dark:bg-slate-600'
</script>

<template>
  <section
    aria-labelledby="upcoming-title"
    class="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
    data-test="upcoming-tasks"
  >
    <div class="flex items-baseline justify-between gap-3 px-4 pt-5 pb-4 sm:px-6">
      <h2 id="upcoming-title" class="text-xl font-bold font-stretch-condensed">
        Yaklaşan görevler
      </h2>
      <RouterLink
        to="/gorevlerim"
        class="rounded text-sm font-medium text-indigo-700 underline-offset-4 hover:underline dark:text-indigo-300"
      >
        Tüm görevlerim
      </RouterLink>
    </div>

    <p
      v-if="overdueCount"
      class="mx-4 mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-800 sm:mx-6 dark:bg-red-500/10 dark:text-red-300"
      data-test="overdue"
    >
      <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="size-4 shrink-0">
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm.75-11.25a.75.75 0 0 0-1.5 0v4a.75.75 0 0 0 1.5 0v-4zM10 14.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
          clip-rule="evenodd"
        />
      </svg>
      <span>{{ overdueCount }} görevin son tarihi geçti.</span>
      <RouterLink to="/gorevlerim" class="rounded font-semibold underline underline-offset-2">
        Görevlerim'de bak
      </RouterLink>
    </p>

    <div v-if="groups.length" class="border-t border-slate-200 dark:border-slate-800">
      <section
        v-for="(group, g) in groups"
        :key="group.date"
        :aria-label="formatDayLong(group.date)"
        class="grid grid-cols-[5.75rem_minmax(0,1fr)] border-b border-slate-200 last:border-b-0 sm:grid-cols-[8rem_minmax(0,1fr)] dark:border-slate-800"
      >
        <!-- Gün: büyük sayı, ay ve gün adı, kalan süre. -->
        <h3
          class="flex flex-col items-start gap-1.5 border-r border-slate-200 px-3 py-3.5 sm:px-5 dark:border-slate-800"
        >
          <time :datetime="group.date" class="flex flex-col leading-none">
            <span class="text-3xl font-bold font-stretch-condensed tabular-nums">{{
              group.day
            }}</span
            >{{ ' '
            }}<span class="mt-1 text-xs font-medium text-slate-600 dark:text-slate-400">{{
              group.rest
            }}</span>
          </time>
          <span
            class="rounded px-1.5 py-0.5 text-[0.6875rem] leading-tight font-semibold whitespace-nowrap"
            :class="
              g === 0
                ? 'bg-marker text-ink'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
            "
            data-test="days-left"
            >{{ daysLeftText(group.date, today) }}</span
          >
        </h3>

        <ul class="divide-y divide-slate-100 dark:divide-slate-800">
          <li
            v-for="task in group.tasks"
            :key="task.id"
            class="flex flex-col gap-2 py-3 pr-4 pl-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pr-6 sm:pl-4"
            data-test="upcoming-task"
          >
            <div class="flex min-w-0 gap-3">
              <span
                class="w-1 shrink-0 self-stretch rounded-full"
                :class="stripClass(task)"
                aria-hidden="true"
              />
              <div class="min-w-0">
                <p class="text-[0.9375rem] leading-snug font-medium">{{ task.title }}</p>
                <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {{ metaText(task) }}
                </p>
              </div>
            </div>
            <TaskStatusSelect
              class="shrink-0 self-start max-sm:ml-4 sm:self-center"
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
      class="border-t border-slate-200 px-4 py-8 text-sm text-slate-600 sm:px-6 dark:border-slate-800 dark:text-slate-400"
      data-test="no-upcoming"
    >
      Son tarihi yaklaşan görevin yok. Yeni görevler Görevlerim'de.
    </p>
  </section>
</template>
