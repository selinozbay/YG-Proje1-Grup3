<script setup lang="ts">
defineProps<{ loading?: boolean }>()
</script>

<template>
  <button
    type="submit"
    :disabled="loading"
    class="w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60"
  >
    <slot />
  </button>
</template>
