<script setup lang="ts">
defineProps<{ title: string; error?: string }>()
defineEmits<{ submit: [] }>()
</script>

<!-- Giriş, kayıt ve şifre sıfırlama formlarının ortak kartı. -->
<template>
  <div
    class="w-full max-w-sm self-start rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
  >
    <h1 class="mb-6 text-2xl font-bold tracking-tight">{{ title }}</h1>
    <form class="space-y-4" @submit.prevent="$emit('submit')">
      <slot />
      <p
        v-if="error"
        role="alert"
        class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300"
      >
        {{ error }}
      </p>
    </form>
    <div class="mt-6 space-y-2 text-center text-sm text-slate-600 dark:text-slate-400">
      <slot name="footer" />
    </div>
  </div>
</template>
