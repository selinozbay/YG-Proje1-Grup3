<script setup lang="ts">
import StatusLegend from '@/components/common/StatusLegend.vue'
import StatusSplitBar from '@/components/common/StatusSplitBar.vue'
import type { CourseProgress } from '@/composables/useCourseProgress'

/**
 * Derslerim'deki grafik (#18): her ders için görevlerin durum dağılımı. Dersleri yan yana
 * karşılaştırmak içindir; her satırda sayılar yazılı, renkler bir kez açıklanır.
 */
defineProps<{ items: CourseProgress[] }>()
</script>

<template>
  <section
    aria-labelledby="course-chart-title"
    class="mb-6 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
    data-test="course-chart"
  >
    <div class="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
      <h2 id="course-chart-title" class="font-semibold">Derslere göre görev durumu</h2>
      <StatusLegend />
    </div>

    <ul class="space-y-4">
      <li v-for="item in items" :key="item.course.id" data-test="course-chart-row">
        <div class="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
          <span class="min-w-0 truncate">
            <span class="font-semibold">{{ item.course.code }}</span>
            <span class="text-slate-600 dark:text-slate-400"> · {{ item.course.title }}</span>
          </span>
          <span class="shrink-0 text-slate-600 tabular-nums dark:text-slate-400">
            {{ item.counts.done }} / {{ item.counts.total }} · %{{ item.counts.percent }}
          </span>
        </div>
        <StatusSplitBar :counts="item.counts" :label="`${item.course.title} görev durumu`" />
      </li>
    </ul>
  </section>
</template>
