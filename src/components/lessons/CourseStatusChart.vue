<script setup lang="ts">
import StatusLegend from '@/components/common/StatusLegend.vue'
import StatusSplitBar from '@/components/common/StatusSplitBar.vue'
import type { CourseProgress } from '@/composables/useCourseProgress'
import { courseColor } from './courseColors'

/**
 * Derslerim'deki grafik (#18): her ders için görevlerin durum dağılımı. Dersleri yan yana
 * karşılaştırmak içindir; her satırda sayılar yazılı, renkler bir kez açıklanır.
 */
defineProps<{ items: CourseProgress[] }>()
</script>

<template>
  <section
    aria-labelledby="course-chart-title"
    class="mb-6 rounded-2xl bg-white p-4 ring-1 ring-slate-200 sm:p-6 dark:bg-slate-900 dark:ring-slate-800"
    data-test="course-chart"
  >
    <div class="mb-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
      <h2 id="course-chart-title" class="text-xl font-bold font-stretch-condensed">
        Derslere göre görev durumu
      </h2>
      <StatusLegend />
    </div>

    <ul class="space-y-4">
      <li
        v-for="item in items"
        :key="item.course.id"
        class="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 sm:grid-cols-[minmax(0,16rem)_minmax(0,1fr)_5.5rem]"
        data-test="course-chart-row"
      >
        <span class="flex min-w-0 items-center gap-2.5 text-sm">
          <span
            class="shrink-0 rounded-md px-1.5 py-0.5 text-xs font-bold font-stretch-condensed"
            :class="courseColor(item.course.id).solid"
            >{{ item.course.code }}</span
          >
          <span class="truncate font-medium text-slate-800 dark:text-slate-200">{{
            item.course.title
          }}</span>
        </span>
        <StatusSplitBar
          class="col-span-2 max-sm:order-last sm:col-span-1"
          size="lg"
          :counts="item.counts"
          :label="`${item.course.title} görev durumu`"
        />
        <span
          class="text-right text-sm font-semibold font-stretch-condensed text-slate-700 tabular-nums dark:text-slate-300"
        >
          {{ item.counts.done }} / {{ item.counts.total }} · %{{ item.counts.percent }}
        </span>
      </li>
    </ul>
  </section>
</template>
