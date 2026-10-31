<script setup lang="ts">
import AppIcon from '@/components/common/AppIcon.vue'
import AuthBrandPanel from './AuthBrandPanel.vue'

defineProps<{ title: string; subtitle?: string; error?: string }>()
defineEmits<{ submit: [] }>()
</script>

<!--
  Giriş, kayıt ve şifre sıfırlama formlarının ortak kartı (#3).
  Masaüstünde solda tanıtım paneli, sağda form; mobilde yalnızca form.
-->
<template>
  <div
    class="grid w-full max-w-sm self-start overflow-hidden rounded-3xl bg-white shadow-xl ring-1 shadow-slate-900/5 ring-slate-200 md:max-w-4xl md:grid-cols-2 dark:bg-slate-900 dark:shadow-black/30 dark:ring-slate-800"
  >
    <AuthBrandPanel />

    <div class="p-6 sm:p-8 md:p-10">
      <h1 class="text-2xl font-bold tracking-tight">{{ title }}</h1>
      <p v-if="subtitle" class="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
        {{ subtitle }}
      </p>

      <form class="mt-8 space-y-5" @submit.prevent="$emit('submit')">
        <slot />
        <p
          v-if="error"
          role="alert"
          class="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/60 dark:text-red-200"
        >
          <AppIcon name="alert" class="mt-0.5 size-4 shrink-0" />
          <span>{{ error }}</span>
        </p>
      </form>

      <div
        class="mt-8 space-y-2 border-t border-slate-200 pt-6 text-center text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400"
      >
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>
