<script setup lang="ts">
import ProgressBar from '@/components/common/ProgressBar.vue'
import StatusLegend from '@/components/common/StatusLegend.vue'
import StatusSplitBar from '@/components/common/StatusSplitBar.vue'
import { courseColor } from '@/components/lessons/courseColors'
import { useCatalogStore } from '@/stores/catalog'
import type { ProfileStats } from './stats'

// Kişisel istatistikler ve grafikler (#29).
defineProps<{ stats: ProfileStats }>()

const catalog = useCatalogStore()
const codeOf = (courseId: string) => catalog.getCourse(courseId)?.code ?? ''
</script>

<template>
  <section
    aria-labelledby="stats-title"
    class="@container rounded-2xl bg-white p-5 ring-1 ring-slate-200 sm:p-6 dark:bg-slate-900 dark:ring-slate-800"
  >
    <h2 id="stats-title" class="mb-5 text-lg font-bold font-stretch-condensed">İstatistikler</h2>

    <!-- Sütun sayısı kutunun genişliğine göre: Profil'in dar sağ sütununda 2, geniş alanda 4 (#99). -->
    <dl class="grid grid-cols-2 gap-x-4 gap-y-5 @[36rem]:grid-cols-4">
      <div data-test="stat-done">
        <dt class="text-xs text-slate-600 dark:text-slate-400">Tamamlanan görev</dt>
        <dd class="mt-1 leading-none">
          <span class="text-3xl font-bold whitespace-nowrap font-stretch-condensed tabular-nums"
            >{{ stats.tasks.done }} / {{ stats.tasks.total }}</span
          >
          <span class="ml-1 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            %{{ stats.tasks.percent }}
          </span>
        </dd>
      </div>
      <div data-test="stat-in-progress">
        <dt class="text-xs text-slate-600 dark:text-slate-400">Devam eden görev</dt>
        <dd class="mt-1 text-3xl leading-none font-bold font-stretch-condensed tabular-nums">
          {{ stats.tasks.inProgress }}
        </dd>
      </div>
      <div data-test="stat-active-courses">
        <dt class="text-xs text-slate-600 dark:text-slate-400">Aktif ders</dt>
        <dd class="mt-1 text-3xl leading-none font-bold font-stretch-condensed tabular-nums">
          {{ stats.activeCourses }}
        </dd>
      </div>
      <div data-test="stat-completed-courses">
        <dt class="text-xs text-slate-600 dark:text-slate-400">Tamamlanan ders</dt>
        <dd class="mt-1 text-3xl leading-none font-bold font-stretch-condensed tabular-nums">
          {{ stats.completedCourses }}
        </dd>
      </div>
    </dl>

    <h3 class="mt-7 mb-2.5 text-sm font-bold">Görev durumları</h3>
    <StatusSplitBar size="lg" :counts="stats.tasks" label="Görev durumları" />
    <StatusLegend class="mt-2.5" :counts="stats.tasks" />

    <h3 class="mt-7 mb-3 text-sm font-bold">Derslere göre ilerleme</h3>
    <ul class="space-y-3.5">
      <li v-for="course in stats.courses" :key="course.id" data-test="course-progress">
        <div class="mb-1.5 flex items-center justify-between gap-3 text-sm">
          <span class="flex min-w-0 items-center gap-2">
            <span
              class="shrink-0 rounded-md px-1.5 py-0.5 text-xs font-bold font-stretch-condensed"
              :class="courseColor(course.id).solid"
              aria-hidden="true"
              >{{ codeOf(course.id) }}</span
            >
            <span class="truncate font-medium">{{ course.title }}</span>
          </span>
          <span
            class="shrink-0 font-semibold font-stretch-condensed text-slate-600 tabular-nums dark:text-slate-400"
          >
            {{ course.done }} / {{ course.total }}
          </span>
        </div>
        <ProgressBar
          :value="course.percent"
          :label="`${course.title} ilerlemesi`"
          :bar-class="courseColor(course.id).bar"
          :show-value="false"
          size="md"
        />
      </li>
    </ul>
  </section>
</template>
