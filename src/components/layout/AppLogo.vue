<script setup lang="ts">
import { APP_NAME } from '@/config'
import AppIcon from '@/components/common/AppIcon.vue'

/** Uygulama logosu ve adı: kenar çubuğunda, mobil üst barda ve giriş sayfalarında. */
defineProps<{ subtitle?: string }>()
</script>

<template>
  <span class="flex min-w-0 items-center gap-3">
    <span
      class="grid size-9 shrink-0 place-items-center rounded-lg bg-indigo-600 text-white dark:bg-indigo-400 dark:text-slate-950"
    >
      <AppIcon name="logo" class="size-5" />
    </span>
    <span class="min-w-0">
      <span class="block truncate text-lg leading-tight font-bold font-stretch-condensed">{{
        APP_NAME
      }}</span>
      <span v-if="subtitle" class="block truncate text-xs text-slate-500 dark:text-slate-400">
        {{ subtitle }}
      </span>
    </span>
  </span>
</template>
