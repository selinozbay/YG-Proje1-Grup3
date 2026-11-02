<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import ProgressBar from '@/components/common/ProgressBar.vue'
import { courseColor } from '@/components/lessons/courseColors'
import type { CourseProgress } from '@/composables/useCourseProgress'
import type { CurrentWeek } from '@/composables/useDashboard'

/**
 * Ana Sayfa'da derslerin özeti (#12, #48): her dersin ilerlemesi (dersin renginde) ve
 * bugünün tarihine göre bu haftanın konusu ile öğrenme hedefleri.
 */
const props = defineProps<{ courses: CourseProgress[]; currentWeeks: CurrentWeek[] }>()

const rows = computed(() =>
  props.courses.map((item) => ({
    ...item,
    color: courseColor(item.course.id),
    current: props.currentWeeks.find((week) => week.course.id === item.course.id)?.week,
  })),
)
</script>

<template>
  <section
    aria-labelledby="home-courses-title"
    class="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
    data-test="this-week"
  >
    <div class="flex items-baseline justify-between gap-3 px-4 pt-5 pb-4 sm:px-6">
      <h2 id="home-courses-title" class="text-xl font-bold font-stretch-condensed">Derslerim</h2>
      <RouterLink
        to="/derslerim"
        class="rounded text-sm font-medium text-indigo-700 underline-offset-4 hover:underline dark:text-indigo-300"
      >
        Tüm dersler
      </RouterLink>
    </div>

    <ul
      class="divide-y divide-slate-200 border-t border-slate-200 dark:divide-slate-800 dark:border-slate-800"
    >
      <li
        v-for="{ course, counts, current, color } in rows"
        :key="course.id"
        class="px-4 py-4 sm:px-6"
        data-test="home-course"
      >
        <div class="flex items-center justify-between gap-3">
          <RouterLink
            :to="`/derslerim/${course.id}`"
            class="group flex min-w-0 items-center gap-2.5 rounded"
          >
            <span
              class="shrink-0 rounded-md px-1.5 py-0.5 text-xs font-bold font-stretch-condensed"
              :class="color.solid"
              >{{ course.code }}</span
            >
            <span class="truncate text-sm font-semibold group-hover:underline">{{
              course.title
            }}</span>
          </RouterLink>
          <span
            class="shrink-0 text-sm font-semibold font-stretch-condensed tabular-nums text-slate-600 dark:text-slate-300"
            data-test="course-summary"
          >
            {{ counts.done }} / {{ counts.total }}
          </span>
        </div>
        <ProgressBar
          class="mt-2.5"
          :value="counts.percent"
          :label="`${course.title} ilerlemesi`"
          :show-value="false"
          :bar-class="color.bar"
        />

        <div
          v-if="current"
          class="mt-3 border-l-2 pl-3"
          :class="color.border"
          data-test="this-week-item"
        >
          <RouterLink
            :to="`/derslerim/${course.id}/hafta/${current.weekNo}`"
            class="rounded text-sm font-medium hover:underline"
            :aria-label="`${course.title}, ${current.weekNo}. haftaya git`"
          >
            <span class="font-semibold" :class="color.text">{{ current.weekNo }}. hafta:</span>
            {{ current.title }}
          </RouterLink>
          <ul
            class="mt-1.5 space-y-1 text-xs text-slate-600 dark:text-slate-400"
            :aria-label="`${current.title} öğrenme hedefleri`"
          >
            <li v-for="goal in current.learningGoals" :key="goal" class="flex gap-2">
              <span
                class="mt-[0.45rem] h-px w-2 shrink-0 bg-slate-400 dark:bg-slate-500"
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
