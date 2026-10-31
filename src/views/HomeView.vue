<script setup lang="ts">
import { computed } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import HomeCourses from '@/components/home/HomeCourses.vue'
import TermOverview from '@/components/home/TermOverview.vue'
import UpcomingTasks from '@/components/home/UpcomingTasks.vue'
import { countStatuses, useCourseProgress } from '@/composables/useCourseProgress'
import {
  countOverdue,
  getCurrentWeeks,
  getElapsedPercent,
  getTermWeeks,
  getUpcomingTasks,
} from '@/composables/useDashboard'
import { useTaskStatusChange } from '@/composables/useTaskStatusChange'
import { useAuthStore } from '@/stores/auth'
import { useCatalogStore } from '@/stores/catalog'
import { useProgressStore } from '@/stores/progress'
import { formatDayLong, toISODate } from '@/utils/date'

const auth = useAuthStore()
const catalog = useCatalogStore()
const progress = useProgressStore()
const courses = useCourseProgress()
const { saveError, changeStatus } = useTaskStatusChange()

const now = new Date()
const today = toISODate(now)

const greeting = computed(() =>
  auth.user?.displayName ? `Merhaba, ${auth.user.displayName}` : 'Merhaba',
)

const overall = computed(() => countStatuses(progress.tasks))
// Dönem çizelgesi ders haftalarına göre; kendi görevlerin haftası olmadığı için sayılmaz.
const termWeeks = computed(() =>
  getTermWeeks(
    progress.tasks.filter((task) => !task.custom),
    today,
  ),
)
const elapsedPercent = computed(() => getElapsedPercent(termWeeks.value, today))
const upcoming = computed(() => getUpcomingTasks(progress.tasks, today, 6))
const overdueCount = computed(() => countOverdue(progress.tasks, today))
const currentWeeks = getCurrentWeeks(catalog.courses, catalog.weeks, catalog.tasks, today)

const courseTitle = (courseId: string) => catalog.getCourse(courseId)?.title ?? ''
</script>

<template>
  <PageHeader :title="greeting" :description="formatDayLong(now)" />

  <p
    v-if="saveError"
    role="alert"
    class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
  >
    {{ saveError }}
  </p>

  <TermOverview :weeks="termWeeks" :elapsed-percent="elapsedPercent" :counts="overall" />

  <div class="grid items-start gap-5 lg:grid-cols-5">
    <UpcomingTasks
      class="lg:col-span-3"
      :tasks="upcoming"
      :overdue-count="overdueCount"
      :today="today"
      :course-title="courseTitle"
      @status-change="changeStatus"
    />
    <HomeCourses class="lg:col-span-2" :courses="courses" :current-weeks="currentWeeks" />
  </div>
</template>
