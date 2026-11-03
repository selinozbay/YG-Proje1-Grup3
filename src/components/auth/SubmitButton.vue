<script setup lang="ts">
import AppIcon from '@/components/common/AppIcon.vue'

defineProps<{ loading?: boolean }>()
</script>

<template>
  <button
    type="submit"
    :disabled="loading"
    :aria-busy="loading || undefined"
    class="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 focus-visible:ring-4 focus-visible:ring-indigo-500/30 active:scale-[0.99] disabled:cursor-wait disabled:opacity-70 motion-reduce:transition-none dark:bg-indigo-400 dark:text-slate-950 dark:shadow-indigo-400/20 dark:hover:bg-indigo-300"
  >
    <!-- İşlem sürerken dönen yükleniyor simgesi, diğer zamanlarda ok. -->
    <slot />
    <svg
      v-if="loading"
      class="size-4 animate-spin motion-reduce:animate-none"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" class="opacity-25" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" stroke-width="3" />
    </svg>
    <AppIcon
      v-else
      name="arrow-right"
      class="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
    />
  </button>
</template>
