<script setup lang="ts">
import StatusLegend from '@/components/common/StatusLegend.vue'
import StatusSplitBar from '@/components/common/StatusSplitBar.vue'
import type { StatusCounts } from '@/composables/useCourseProgress'

/**
 * Ana Sayfa'daki genel ilerleme (#9, #11): büyük yüzde, tamamlanan/toplam görev ve
 * görevlerin durum dağılımı. Hiç görev yokken %0 gösterir.
 */
defineProps<{ counts: StatusCounts }>()
</script>

<template>
  <section
    aria-labelledby="overall-title"
    class="flex flex-col rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
    data-test="overall-progress"
  >
    <h2 id="overall-title" class="font-semibold">Genel ilerleme</h2>

    <p class="mt-3 text-5xl font-bold tracking-tight tabular-nums" data-test="overall-percent">
      %{{ counts.percent }}
    </p>
    <p class="mt-1 text-sm text-slate-600 dark:text-slate-400" data-test="overall-summary">
      {{ counts.done }} / {{ counts.total }} görev tamamlandı
    </p>

    <StatusSplitBar class="mt-4" :counts="counts" label="Bütün görevlerin durumu" />
    <StatusLegend class="mt-3" :counts="counts" />
  </section>
</template>
