<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import ProgressBar from '@/components/common/ProgressBar.vue'
import { STATUS_CLASSES } from '@/components/tasks/statusStyles'
import { COURSE_STATUS_LABELS, type CourseProgress } from '@/composables/useCourseProgress'
import { TASK_STATUS_LABELS } from '@/types/task'
import { formatDate } from '@/utils/date'
import { COURSE_STATUS_CLASSES } from './courseStatusStyles'

/**
 * Ders kartı (#14, #16, #17). Derslerim'de tam hâliyle, Ana Sayfa'da `compact` olarak
 * (açıklama ve görev listesi olmadan) kullanılır; iki sayfada da aynı görünür.
 */
const props = withDefaults(
  defineProps<{
    item: CourseProgress
    compact?: boolean
    /** Başlık seviyesi: kartlar bir h2 bölümünün içindeyse 3 verin. */
    headingLevel?: 2 | 3
  }>(),
  { compact: false, headingLevel: 2 },
)

const course = computed(() => props.item.course)
const to = computed(() => `/derslerim/${course.value.id}`)

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
    class="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    data-test="course-card"
  >
    <div class="mb-3 flex items-center justify-between gap-3">
      <span
        class="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold tracking-wide text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300"
        data-test="course-code"
      >
        {{ course.code }}
      </span>
      <span
        class="rounded-full px-2.5 py-0.5 text-xs font-medium"
        :class="COURSE_STATUS_CLASSES[item.status]"
        data-test="course-status"
      >
        {{ COURSE_STATUS_LABELS[item.status] }}
      </span>
    </div>

    <component :is="`h${headingLevel}`" class="text-lg leading-snug font-semibold">
      <RouterLink
        :to="to"
        class="rounded hover:text-indigo-700 hover:underline focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:hover:text-indigo-300"
      >
        {{ course.title }}
      </RouterLink>
    </component>
    <p class="mt-0.5 text-sm text-slate-600 dark:text-slate-400" data-test="course-instructor">
      {{ course.instructor }}
    </p>
    <p v-if="!compact" class="mt-3 text-sm text-slate-700 dark:text-slate-300">
      {{ course.description }}
    </p>

    <div class="mt-auto pt-4">
      <p class="mb-1.5 text-xs text-slate-600 dark:text-slate-400" data-test="course-summary">
        {{ item.counts.done }} / {{ item.counts.total }} görev tamamlandı
      </p>
      <ProgressBar :value="item.counts.percent" :label="`${course.title} ilerlemesi`" />

      <p
        v-if="nextTask"
        class="mt-3 text-xs text-slate-600 dark:text-slate-400"
        data-test="next-task"
      >
        Sıradaki görev:
        <span class="font-medium text-slate-900 dark:text-slate-100">{{ nextTask.title }}</span>
        <template v-if="nextTask.dueDate"> · {{ formatDate(nextTask.dueDate) }}</template>
      </p>
    </div>

    <details
      v-if="!compact && item.tasks.length"
      class="group mt-4 border-t border-slate-200 pt-3 dark:border-slate-800"
      data-test="course-tasks"
    >
      <summary
        class="cursor-pointer rounded text-sm font-medium text-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-indigo-300"
      >
        <span class="group-open:hidden">Görevleri göster</span>
        <span class="hidden group-open:inline">Görevleri gizle</span>
        ({{ item.tasks.length }})
      </summary>
      <ul class="mt-3 space-y-2" :aria-label="`${course.title} görevleri`">
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
            class="shrink-0 rounded-full px-2 py-0.5 text-xs font-medium"
            :class="STATUS_CLASSES[task.status]"
          >
            {{ TASK_STATUS_LABELS[task.status] }}
          </span>
        </li>
      </ul>
    </details>
  </article>
</template>
