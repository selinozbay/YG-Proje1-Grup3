<script setup lang="ts">
import { computed } from 'vue'
import type { StatusCounts } from '@/composables/useCourseProgress'
import { STATUS_SEGMENTS } from './statusSegments'

/**
 * Görevlerin durumlara göre dağılımını gösteren ince çubuk (tamamlandı / devam ediyor /
 * yapılacak). Sayılar çubuğun yanında yazılı olmalı; çubuk yalnızca oranı gösterir.
 * Ekran okuyucu bütün sayıları `label` ile birlikte okur, fareyle üstüne gelince her
 * parçanın adı ve sayısı görünür. Renklerin açıklaması için StatusLegend kullanın.
 */
const props = defineProps<{
  counts: StatusCounts
  /** Ekran okuyucunun okuyacağı ad, ör. "Veri Tabanı görev durumu". */
  label: string
}>()

const share = (value: number) =>
  props.counts.total === 0 ? 0 : Math.round((value / props.counts.total) * 100)

/** Boş parçalar çizilmez. */
const segments = computed(() =>
  STATUS_SEGMENTS.map((segment) => ({ ...segment, value: props.counts[segment.key] })).filter(
    (segment) => segment.value > 0,
  ),
)

const description = computed(
  () =>
    `${props.label}: ` +
    STATUS_SEGMENTS.map(
      (segment) => `${props.counts[segment.key]} ${segment.label.toLocaleLowerCase('tr-TR')}`,
    ).join(', '),
)
</script>

<template>
  <div
    role="img"
    :aria-label="description"
    class="flex h-2 gap-0.5 overflow-hidden rounded-full"
    :class="counts.total === 0 && 'bg-slate-200 dark:bg-slate-800'"
    data-test="status-split-bar"
  >
    <span
      v-for="segment in segments"
      :key="segment.key"
      class="h-full rounded-full"
      :class="segment.swatch"
      :style="{ flexGrow: segment.value, flexBasis: 0 }"
      :title="`${segment.label}: ${segment.value} (%${share(segment.value)})`"
      :data-test="`segment-${segment.key}`"
    />
  </div>
</template>
