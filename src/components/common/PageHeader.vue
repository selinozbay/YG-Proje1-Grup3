<script setup lang="ts">
defineProps<{ title: string; description?: string }>()
</script>

<template>
  <div class="mb-6 border-b border-slate-200 pb-5 dark:border-slate-800">
    <h1 class="text-2xl font-semibold tracking-tight">{{ title }}</h1>
    <p v-if="description" class="mt-1 text-sm text-slate-600 dark:text-slate-400">
      {{ description }}
    </p>
  </div>
</template>
