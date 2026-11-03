<script setup lang="ts">
import { computed } from 'vue'

/**
 * Tamamlanma yüzdesini gösteren çubuk. Ana sayfa, Derslerim, Ders detayı, Hafta detayı
 * ve Profil'deki ilerleme göstergeleri bu bileşeni kullanır. Yüzdeyi hesaplamak için:
 * progress.summarize(görevler).percent
 * Çubuğun rengi `barClass` ile değiştirilebilir (ör. dersin rengi).
 */
const props = withDefaults(
  defineProps<{
    /** 0–100 arası yüzde; dışındaki değerler sınıra çekilir. */
    value: number
    /** Ekran okuyucunun okuyacağı ad, ör. "Bu haftanın ilerlemesi". */
    label: string
    showValue?: boolean
    /** Dolu kısmın rengi; verilmezse yeşil (tamamlanan görevler). */
    barClass?: string
    /** İnce (varsayılan) ya da kalın çubuk. */
    size?: 'sm' | 'md'
    /** Renkli zemin üstünde (ör. ders sayfasının başlığı): açık renkli boşluk ve yazı. */
    inverse?: boolean
  }>(),
  { showValue: true, barClass: 'bg-emerald-500', size: 'sm', inverse: false },
)

const percent = computed(() => Math.min(100, Math.max(0, Math.round(props.value || 0))))
</script>

<template>
  <div class="flex items-center gap-3">
    <div
      class="flex-1 overflow-hidden rounded-full"
      :class="[
        size === 'md' ? 'h-2.5' : 'h-1.5',
        inverse ? 'bg-white/25' : 'bg-slate-200 dark:bg-slate-800',
      ]"
      role="progressbar"
      :aria-label="label"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="percent"
    >
      <div
        class="h-full rounded-full transition-[width] duration-500 ease-out motion-reduce:transition-none"
        :class="barClass"
        :style="{ width: `${percent}%` }"
      />
    </div>
    <span
      v-if="showValue"
      class="w-10 text-right text-sm font-semibold font-stretch-condensed tabular-nums"
      :class="inverse ? 'text-white' : 'text-slate-700 dark:text-slate-300'"
    >
      %{{ percent }}
    </span>
  </div>
</template>
