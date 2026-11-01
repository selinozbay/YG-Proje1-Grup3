<script setup lang="ts">
import AppIcon from '@/components/common/AppIcon.vue'
import AppLogo from './AppLogo.vue'
import ThemeToggle from './ThemeToggle.vue'

defineProps<{ menuOpen: boolean }>()
defineEmits<{ openMenu: [] }>()
</script>

<!-- Yalnızca mobilde görünen üst bar: menü düğmesi, logo, tema düğmesi. -->
<template>
  <header
    class="sticky top-0 z-20 flex items-center gap-2 border-b border-slate-200 bg-white px-4 py-2.5 md:hidden dark:border-slate-800 dark:bg-slate-900"
  >
    <button
      id="menu-button"
      type="button"
      aria-label="Menüyü aç"
      aria-controls="app-sidebar"
      :aria-expanded="menuOpen"
      class="-ml-2 rounded-md p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
      @click="$emit('openMenu')"
    >
      <AppIcon name="menu" class="size-6" />
    </button>
    <AppLogo />
    <ThemeToggle class="ml-auto" />
  </header>
</template>
