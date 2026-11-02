<script setup lang="ts">
import { APP_NAME } from '@/config'
import AppIcon from '@/components/common/AppIcon.vue'

/**
 * Uygulama logosu ve adı: kenar çubuğunda, mobil üst barda ve giriş sayfalarında.
 * tone="inverse": lacivert zeminde (kenar çubuğu, mobil üst bar) açık renkli yazı.
 */
withDefaults(defineProps<{ subtitle?: string; tone?: 'default' | 'inverse' }>(), {
  subtitle: undefined,
  tone: 'default',
})
</script>

<template>
  <span class="flex min-w-0 items-center gap-3">
    <span
      class="grid size-9 shrink-0 place-items-center rounded-lg"
      :class="
        tone === 'inverse'
          ? 'bg-marker text-ink'
          : 'bg-ink text-marker dark:bg-marker dark:text-ink'
      "
    >
      <AppIcon name="logo" class="size-5" />
    </span>
    <span class="min-w-0">
      <span
        class="block truncate text-lg leading-tight font-bold font-stretch-condensed"
        :class="tone === 'inverse' && 'text-white'"
        >{{ APP_NAME }}</span
      >
      <span
        v-if="subtitle"
        class="block truncate text-xs"
        :class="tone === 'inverse' ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'"
      >
        {{ subtitle }}
      </span>
    </span>
  </span>
</template>
