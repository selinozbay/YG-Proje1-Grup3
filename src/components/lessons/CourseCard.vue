<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import ProgressBar from '@/components/common/ProgressBar.vue'
import StatusIcon from '@/components/common/StatusIcon.vue'
import { STATUS_CLASSES } from '@/components/tasks/statusStyles'
import {
  COURSE_STATUS_LABELS,
  type CourseProgress,
  type CourseStatus,
} from '@/composables/useCourseProgress'
import { TASK_STATUS_LABELS, type TaskStatus } from '@/types/task'
import { formatDate } from '@/utils/date'
import { courseColor } from './courseColors'

/**
 * Derslerim'deki ders kartı (#14, #16, #17). Üstte dersin renginde bir ayraç: büyük ders kodu
 * ve ders durumu. Altında ad, öğretim elemanı, açıklama, ilerleme, sıradaki görev ve açılır
 * görev listesi.
 */
const props = withDefaults(
  defineProps<{
    item: CourseProgress
    /** Başlık seviyesi: kartlar bir h2 bölümünün içindeyse 3 verin. */
    headingLevel?: 2 | 3
  }>(),
  { headingLevel: 2 },
)

const course = computed(() => props.item.course)
const to = computed(() => `/derslerim/${course.value.id}`)
const color = computed(() => courseColor(course.value.id))

/** Ders durumunun simgesi görev durumu simgeleriyle aynı. */
const STATUS_ICON: Record<CourseStatus, TaskStatus> = {
  'not-started': 'todo',
  'in-progress': 'in-progress',
  done: 'done',
}

/** Tamamlanmamış görevlerden son tarihi en yakın olan; tarihi olmayanlar sonda. */
const nextTask = computed(
  () =>
    props.item.tasks
      .filter((task) => task.status !== 'done')
      .sort((a, b) => (a.dueDate ?? '9999').localeCompare(b.dueDate ?? '9999'))[0],
)
</script>

<template>
  <article
    class="flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
    data-test="course-card"
  >
    <!-- Ayraç: dersin rengi, büyük kod ve durum. -->
    <div class="flex items-start justify-between gap-3 px-5 pt-4 pb-3" :class="color.solid">
      <span
        class="text-[2.75rem] leading-none font-bold font-stretch-condensed"
        data-test="course-code"
        >{{ course.code }}</span
      >
      <span
        class="mt-1 inline-flex items-center gap-1.5 rounded-full bg-white px-2 py-1 text-xs font-semibold text-slate-900"
        data-test="course-status"
      >
        <StatusIcon :status="STATUS_ICON[item.status]" class="size-3.5" />{{
          COURSE_STATUS_LABELS[item.status]
        }}
      </span>
    </div>

    <div class="flex flex-1 flex-col p-5">
      <component
        :is="`h${headingLevel}`"
        class="text-lg leading-snug font-bold font-stretch-condensed"
      >
        <RouterLink :to="to" class="rounded underline-offset-4 hover:underline">
          {{ course.title }}
        </RouterLink>
      </component>
      <p class="mt-0.5 text-sm text-slate-500 dark:text-slate-400" data-test="course-instructor">
        {{ course.instructor }}
      </p>
      <p class="mt-3 text-sm text-slate-700 dark:text-slate-300">
        {{ course.description }}
      </p>

      <div class="mt-auto pt-5">
        <p class="mb-1.5 text-xs text-slate-600 dark:text-slate-400" data-test="course-summary">
          {{ item.counts.done }} / {{ item.counts.total }} görev tamamlandı
        </p>
        <ProgressBar
          :value="item.counts.percent"
          :label="`${course.title} ilerlemesi`"
          :bar-class="color.bar"
          size="md"
        />

        <p
          v-if="nextTask"
          class="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:bg-slate-800/60 dark:text-slate-400"
          data-test="next-task"
        >
          Sıradaki görev:
          <span class="font-semibold text-slate-900 dark:text-slate-100">{{ nextTask.title }}</span>
          <template v-if="nextTask.dueDate"> · {{ formatDate(nextTask.dueDate) }}</template>
        </p>
      </div>
    </div>

    <details
      v-if="item.tasks.length"
      class="group border-t border-slate-200 dark:border-slate-800"
      data-test="course-tasks"
    >
      <summary
        class="flex cursor-pointer list-none items-center gap-2 px-5 py-3 text-sm font-semibold text-indigo-700 hover:bg-slate-50 dark:text-indigo-300 dark:hover:bg-white/[0.03] [&::-webkit-details-marker]:hidden"
      >
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          class="size-4 shrink-0 transition-transform group-open:rotate-90 motion-reduce:transition-none"
        >
          <path
            fill-rule="evenodd"
            d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.17 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="group-open:hidden">Görevleri göster</span>
        <span class="hidden group-open:inline">Görevleri gizle</span>
        ({{ item.tasks.length }})
      </summary>
      <ul class="space-y-2.5 px-5 pb-4" :aria-label="`${course.title} görevleri`">
        <li
          v-for="task in item.tasks"
          :key="task.id"
          class="flex items-start justify-between gap-3 text-sm"
        >
          <span>
            <span v-if="task.weekNo" class="text-slate-500 dark:text-slate-400"
              >{{ task.weekNo }}. hafta ·
            </span>
            <span v-else class="text-slate-500 dark:text-slate-400">Kendi görevim · </span>
            {{ task.title }}
          </span>
          <span
            class="inline-flex shrink-0 items-center gap-1 rounded-full py-0.5 pr-2 pl-1 text-xs font-semibold"
            :class="STATUS_CLASSES[task.status]"
          >
            <StatusIcon :status="task.status" class="size-3.5" />{{
              TASK_STATUS_LABELS[task.status]
            }}
          </span>
        </li>
      </ul>
    </details>
  </article>
</template>
