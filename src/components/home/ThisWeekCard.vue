<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { CurrentWeek } from '@/composables/useDashboard'
import { formatDate } from '@/utils/date'

/** Ana Sayfa'da bu haftanın dersleri ve öğrenme hedefleri (#48), her ders için bir sütun. */
defineProps<{ items: CurrentWeek[] }>()
</script>

<template>
  <section
    aria-labelledby="this-week-title"
    class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
    data-test="this-week"
  >
    <h2 id="this-week-title" class="mb-4 font-semibold">Bu haftanın dersleri</h2>

    <ul v-if="items.length" class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      <li
        v-for="{ course, week, deadline } in items"
        :key="week.id"
        class="flex flex-col"
        data-test="this-week-item"
      >
        <p class="text-xs font-semibold tracking-wide text-indigo-700 dark:text-indigo-300">
          {{ course.code }} · {{ week.weekNo }}. hafta
        </p>
        <h3 class="mt-0.5 leading-snug font-semibold">{{ week.title }}</h3>
        <p class="text-sm text-slate-600 dark:text-slate-400">{{ course.title }}</p>

        <ul class="mt-3 space-y-1.5 text-sm" :aria-label="`${week.title} öğrenme hedefleri`">
          <li v-for="goal in week.learningGoals" :key="goal" class="flex items-start gap-2">
            <span
              class="mt-1.5 size-1.5 shrink-0 rounded-full bg-indigo-500 dark:bg-indigo-400"
              aria-hidden="true"
            />
            {{ goal }}
          </li>
        </ul>

        <div class="mt-auto flex items-center justify-between gap-3 pt-3 text-xs">
          <span class="text-slate-600 dark:text-slate-400">
            Son tarih: <time :datetime="deadline">{{ formatDate(deadline) }}</time>
          </span>
          <RouterLink
            :to="`/derslerim/${course.id}/hafta/${week.weekNo}`"
            class="rounded text-sm font-medium text-indigo-700 hover:underline focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-indigo-300"
            :aria-label="`${course.title}, ${week.weekNo}. haftaya git`"
          >
            Haftaya git
          </RouterLink>
        </div>
      </li>
    </ul>
    <p v-else class="text-sm text-slate-600 dark:text-slate-400" data-test="no-current-week">
      Bu dönemin bütün haftaları geride kaldı.
    </p>
  </section>
</template>
