<script setup lang="ts">
import { APP_NAME } from '@/config'
import AppIcon from '@/components/common/AppIcon.vue'

defineProps<{ subtitle?: string }>()
</script>

<!-- Uygulama logosu ve adı: kenar çubuğunda, mobil üst barda ve giriş sayfalarında. -->
<template>
  <span class="flex min-w-0 items-center gap-3">
    <span
      class="grid size-8 shrink-0 place-items-center rounded-md bg-indigo-600 text-white dark:bg-indigo-500"
    >
      <AppIcon name="logo" class="size-[18px]" />
    </span>
    <span class="min-w-0">
      <span class="block truncate leading-tight font-semibold">{{ APP_NAME }}</span>
      <span v-if="subtitle" class="block truncate text-xs text-slate-500 dark:text-slate-400">
        {{ subtitle }}
      </span>
    </span>
  </span>
</template>
