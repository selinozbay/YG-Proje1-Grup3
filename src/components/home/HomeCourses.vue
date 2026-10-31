<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import ProgressBar from '@/components/common/ProgressBar.vue'
import { courseColor } from '@/components/lessons/courseColors'
import type { CourseProgress } from '@/composables/useCourseProgress'
import type { CurrentWeek } from '@/composables/useDashboard'

/**
 * Ana Sayfa'da derslerin özeti (#12, #48): her dersin ilerlemesi ve bugünün tarihine göre
 * bu haftanın konusu ile öğrenme hedefleri.
 */
const props = defineProps<{ courses: CourseProgress[]; currentWeeks: CurrentWeek[] }>()

const rows = computed(() =>
  props.courses.map((item) => ({
    ...item,
    current: props.currentWeeks.find((week) => week.course.id === item.course.id)?.week,
  })),
)
</script>

<template>
  <section
    aria-labelledby="home-courses-title"
    class="rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
    data-test="this-week"
  >
    <div
      class="flex items-baseline justify-between gap-3 border-b border-slate-200 px-4 py-3 sm:px-5 dark:border-slate-800"
    >
      <h2 id="home-courses-title" class="font-semibold">Derslerim</h2>
      <RouterLink
        to="/derslerim"
        class="rounded text-sm text-indigo-700 hover:underline focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-indigo-300"
      >
        Tüm dersler
      </RouterLink>
    </div>

    <ul class="divide-y divide-slate-200 dark:divide-slate-800">
      <li
        v-for="{ course, counts, current } in rows"
        :key="course.id"
        class="px-4 py-4 sm:px-5"
        data-test="home-course"
      >
        <div class="flex items-center justify-between gap-3">
          <RouterLink
            :to="`/derslerim/${course.id}`"
            class="flex min-w-0 items-center gap-2 rounded hover:underline focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <span
              class="shrink-0 rounded px-1.5 py-px text-xs font-semibold"
              :class="courseColor(course.id).badge"
              >{{ course.code }}</span
            >
            <span class="truncate text-sm font-medium">{{ course.title }}</span>
          </RouterLink>
          <span
            class="shrink-0 text-xs text-slate-500 dark:text-slate-400"
            data-test="course-summary"
          >
            {{ counts.done }} / {{ counts.total }}
          </span>
        </div>
        <ProgressBar
          class="mt-2"
          :value="counts.percent"
          :label="`${course.title} ilerlemesi`"
          :show-value="false"
        />

        <div v-if="current" class="mt-3" data-test="this-week-item">
          <RouterLink
            :to="`/derslerim/${course.id}/hafta/${current.weekNo}`"
            class="rounded text-sm hover:underline focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            :aria-label="`${course.title}, ${current.weekNo}. haftaya git`"
          >
            <span class="text-slate-500 dark:text-slate-400">{{ current.weekNo }}. hafta:</span>
            {{ current.title }}
          </RouterLink>
          <ul
            class="mt-1.5 space-y-1 text-xs text-slate-600 dark:text-slate-400"
            :aria-label="`${current.title} öğrenme hedefleri`"
          >
            <li v-for="goal in current.learningGoals" :key="goal" class="flex gap-2">
              <span
                class="mt-[0.4rem] h-px w-2 shrink-0 bg-slate-400 dark:bg-slate-500"
                aria-hidden="true"
              />
              {{ goal }}
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </section>
</template>
