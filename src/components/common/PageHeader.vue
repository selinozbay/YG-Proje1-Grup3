<script setup lang="ts">
/**
 * Sayfa başlığı: dar kesimli büyük başlık ve altında kısa açıklama.
 * Sağ tarafa (geniş ekranda) sayfaya özel bir öğe koymak için `aside` yuvası kullanılır.
 */
defineProps<{ title: string; description?: string }>()
</script>

<template>
  <div class="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
    <div class="min-w-0">
      <h1
        class="text-[2rem] leading-[1.05] font-bold font-stretch-condensed text-balance sm:text-[2.5rem]"
      >
        {{ title }}
      </h1>
      <p
        v-if="description"
        class="mt-2 max-w-[62ch] text-[0.9375rem] text-slate-600 dark:text-slate-400"
      >
        {{ description }}
      </p>
    </div>
    <div v-if="$slots.aside" class="shrink-0">
      <slot name="aside" />
    </div>
  </div>
</template>
