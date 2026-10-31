<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import PageHeader from '@/components/common/PageHeader.vue'
import OverallProgressCard from '@/components/home/OverallProgressCard.vue'
import ThisWeekCard from '@/components/home/ThisWeekCard.vue'
import UpcomingTasks from '@/components/home/UpcomingTasks.vue'
import CourseCard from '@/components/lessons/CourseCard.vue'
import { countStatuses, useCourseProgress } from '@/composables/useCourseProgress'
import { countOverdue, getCurrentWeeks, getUpcomingTasks } from '@/composables/useDashboard'
import { useTaskStatusChange } from '@/composables/useTaskStatusChange'
import { useAuthStore } from '@/stores/auth'
import { useCatalogStore } from '@/stores/catalog'
import { useProgressStore } from '@/stores/progress'
import { toISODate } from '@/utils/date'

const auth = useAuthStore()
const catalog = useCatalogStore()
const progress = useProgressStore()
const courses = useCourseProgress()
const { saveError, changeStatus } = useTaskStatusChange()

const today = toISODate(new Date())

const greeting = computed(() =>
  auth.user?.displayName ? `Merhaba, ${auth.user.displayName}` : 'Merhaba',
)

const overall = computed(() => countStatuses(progress.tasks))
const upcoming = computed(() => getUpcomingTasks(progress.tasks, today))
const overdueCount = computed(() => countOverdue(progress.tasks, today))
const currentWeeks = getCurrentWeeks(catalog.courses, catalog.weeks, catalog.tasks, today)

const courseTitle = (courseId: string) => catalog.getCourse(courseId)?.title ?? ''
</script>

<template>
  <PageHeader :title="greeting" description="Derslerindeki genel durumun." />

  <p
    v-if="saveError"
    role="alert"
    class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
  >
    {{ saveError }}
  </p>

  <div class="mb-6 grid items-start gap-4 lg:grid-cols-3">
    <OverallProgressCard :counts="overall" />
    <UpcomingTasks
      class="lg:col-span-2"
      :tasks="upcoming"
      :overdue-count="overdueCount"
      :today="today"
      :course-title="courseTitle"
      @status-change="changeStatus"
    />
  </div>

  <ThisWeekCard class="mb-6" :items="currentWeeks" />

  <section aria-labelledby="home-courses-title">
    <div class="mb-3 flex items-baseline justify-between gap-3">
      <h2 id="home-courses-title" class="font-semibold">Derslerim</h2>
      <RouterLink
        to="/derslerim"
        class="rounded text-sm font-medium text-indigo-700 hover:underline focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-indigo-300"
      >
        Tüm dersler
      </RouterLink>
    </div>
    <ul class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Derslerim özeti">
      <li v-for="item in courses" :key="item.course.id">
        <CourseCard :item="item" compact :heading-level="3" />
      </li>
    </ul>
  </section>
</template>
