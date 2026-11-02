<script setup lang="ts">
import PageHeader from '@/components/common/PageHeader.vue'
import CourseCard from '@/components/lessons/CourseCard.vue'
import CourseFilterBar from '@/components/lessons/CourseFilterBar.vue'
import CourseStatusChart from '@/components/lessons/CourseStatusChart.vue'
import { useCourseFilters } from '@/composables/useCourseFilters'
import { useCourseProgress } from '@/composables/useCourseProgress'

const courses = useCourseProgress()
const { filters, filteredCourses, statusCounts, isFiltered, resetFilters } =
  useCourseFilters(courses)
</script>

<template>
  <PageHeader title="Derslerim" description="Takip ettiğin dersler ve her dersteki ilerlemen." />

  <CourseStatusChart :items="courses" />

  <CourseFilterBar
    v-model:query="filters.query"
    v-model:status="filters.status"
    :counts="statusCounts"
  />

  <p
    class="mb-4 text-sm text-slate-600 dark:text-slate-400"
    role="status"
    aria-live="polite"
    data-test="course-count"
  >
    <template v-if="isFiltered">{{ filteredCourses.length }} / {{ courses.length }} ders</template>
    <template v-else>{{ courses.length }} ders</template>
  </p>

  <ul
    v-if="filteredCourses.length"
    class="grid items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-3"
    aria-label="Dersler"
  >
    <li v-for="item in filteredCourses" :key="item.course.id">
      <CourseCard :item="item" />
    </li>
  </ul>

  <div
    v-else
    class="rounded-2xl border-2 border-dashed border-slate-300 px-6 py-10 text-center dark:border-slate-700"
    data-test="empty-state"
  >
    <p class="text-lg font-bold font-stretch-condensed">Aramana uyan ders bulunamadı.</p>
    <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
      Farklı bir sözcük dene ya da filtreleri temizle.
    </p>
    <button
      type="button"
      class="mt-5 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-ink-soft dark:bg-marker dark:text-ink dark:hover:bg-marker/90"
      @click="resetFilters"
    >
      Filtreleri temizle
    </button>
  </div>
</template>
