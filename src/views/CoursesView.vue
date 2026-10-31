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
    class="grid items-start gap-4 sm:grid-cols-2 xl:grid-cols-3"
    aria-label="Dersler"
  >
    <li v-for="item in filteredCourses" :key="item.course.id">
      <CourseCard :item="item" />
    </li>
  </ul>

  <div
    v-else
    class="rounded-xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700"
    data-test="empty-state"
  >
    <p class="font-medium">Aramana uyan ders bulunamadı.</p>
    <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
      Farklı bir sözcük dene ya da filtreleri temizle.
    </p>
    <button
      type="button"
      class="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:border-slate-700 dark:hover:bg-slate-800"
      @click="resetFilters"
    >
      Filtreleri temizle
    </button>
  </div>
</template>
