<script setup lang="ts">
import { computed } from 'vue'

/**
 * Tamamlanma yüzdesini gösteren çubuk. Ana sayfa, Derslerim, Ders detayı, Hafta detayı
 * ve Profil'deki ilerleme göstergeleri bu bileşeni kullanır. Yüzdeyi hesaplamak için:
 * progress.summarize(görevler).percent
 */
const props = withDefaults(
  defineProps<{
    /** 0–100 arası yüzde; dışındaki değerler sınıra çekilir. */
    value: number
    /** Ekran okuyucunun okuyacağı ad, ör. "Bu haftanın ilerlemesi". */
    label: string
    showValue?: boolean
  }>(),
  { showValue: true },
)

const percent = computed(() => Math.min(100, Math.max(0, Math.round(props.value || 0))))
</script>

<template>
  <div class="flex items-center gap-3">
    <div
      class="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
      role="progressbar"
      :aria-label="label"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="percent"
    >
      <div
        class="h-full rounded-full bg-indigo-600 transition-[width] duration-300 dark:bg-indigo-500"
        :style="{ width: `${percent}%` }"
      />
    </div>
    <span v-if="showValue" class="w-11 text-right text-sm font-medium tabular-nums">
      %{{ percent }}
    </span>
  </div>
</template>
