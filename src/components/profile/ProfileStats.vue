<script setup lang="ts">
import ProgressBar from '@/components/common/ProgressBar.vue'
import type { ProfileStats } from './stats'

// Kişisel istatistikler ve grafikler (#29).
const props = defineProps<{ stats: ProfileStats }>()

/** Durum dağılımı çubuğunun parçaları; boş parçalar çizilmez. */
const segments = () =>
  [
    { key: 'done', label: 'Tamamlandı', value: props.stats.tasks.done, color: 'bg-emerald-500' },
    {
      key: 'in-progress',
      label: 'Devam ediyor',
      value: props.stats.tasks.inProgress,
      color: 'bg-amber-400',
    },
    {
      key: 'todo',
      label: 'Yapılacak',
      value: props.stats.tasks.todo,
      color: 'bg-slate-300 dark:bg-slate-600',
    },
  ] as const
</script>

<template>
  <section
    aria-labelledby="stats-title"
    class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
  >
    <h2 id="stats-title" class="mb-4 font-semibold">İstatistikler</h2>

    <dl class="grid grid-cols-2 gap-3">
      <div class="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60" data-test="stat-done">
        <dt class="text-xs text-slate-600 dark:text-slate-400">Tamamlanan görev</dt>
        <dd class="mt-1 text-xl font-semibold tabular-nums">
          {{ stats.tasks.done }} / {{ stats.tasks.total }}
          <span class="text-sm font-medium text-slate-500 dark:text-slate-400">
            %{{ stats.tasks.percent }}
          </span>
        </dd>
      </div>
      <div class="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60" data-test="stat-in-progress">
        <dt class="text-xs text-slate-600 dark:text-slate-400">Devam eden görev</dt>
        <dd class="mt-1 text-xl font-semibold tabular-nums">{{ stats.tasks.inProgress }}</dd>
      </div>
      <div class="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60" data-test="stat-active-courses">
        <dt class="text-xs text-slate-600 dark:text-slate-400">Aktif ders</dt>
        <dd class="mt-1 text-xl font-semibold tabular-nums">{{ stats.activeCourses }}</dd>
      </div>
      <div
        class="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60"
        data-test="stat-completed-courses"
      >
        <dt class="text-xs text-slate-600 dark:text-slate-400">Tamamlanan ders</dt>
        <dd class="mt-1 text-xl font-semibold tabular-nums">{{ stats.completedCourses }}</dd>
      </div>
    </dl>

    <h3 class="mt-6 mb-2 text-sm font-semibold">Görev durumları</h3>
    <div
      role="img"
      :aria-label="`${stats.tasks.done} tamamlandı, ${stats.tasks.inProgress} devam ediyor, ${stats.tasks.todo} yapılacak`"
      class="flex h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
    >
      <template v-for="segment in segments()" :key="segment.key">
        <span
          v-if="segment.value > 0"
          :class="segment.color"
          :style="{ width: `${(segment.value / stats.tasks.total) * 100}%` }"
        />
      </template>
    </div>
    <ul
      class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-400"
      aria-hidden="true"
    >
      <li v-for="segment in segments()" :key="segment.key" class="flex items-center gap-1.5">
        <span class="size-2.5 rounded-full" :class="segment.color" />
        {{ segment.label }}: {{ segment.value }}
      </li>
    </ul>

    <h3 class="mt-6 mb-3 text-sm font-semibold">Derslere göre ilerleme</h3>
    <ul class="space-y-3">
      <li v-for="course in stats.courses" :key="course.id" data-test="course-progress">
        <div class="mb-1 flex justify-between gap-3 text-sm">
          <span class="truncate">{{ course.title }}</span>
          <span class="shrink-0 text-slate-600 tabular-nums dark:text-slate-400">
            {{ course.done }} / {{ course.total }}
          </span>
        </div>
        <ProgressBar :value="course.percent" :label="`${course.title} ilerlemesi`" />
      </li>
    </ul>
  </section>
</template>
