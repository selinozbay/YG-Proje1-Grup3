<script setup lang="ts">
defineProps<{ loading?: boolean }>()
</script>

<template>
  <button
    type="submit"
    :disabled="loading"
    :aria-busy="loading || undefined"
    class="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 font-semibold text-white shadow-sm shadow-indigo-600/30 transition hover:bg-indigo-700 focus-visible:ring-4 focus-visible:ring-indigo-500/30 active:scale-[0.99] disabled:cursor-wait disabled:opacity-70 motion-reduce:transition-none dark:bg-indigo-500 dark:hover:bg-indigo-400"
  >
    <!-- İşlem sürerken dönen yükleniyor simgesi. -->
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
    <slot />
  </button>
</template>
