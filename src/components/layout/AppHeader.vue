<script setup lang="ts">
import AppIcon from '@/components/common/AppIcon.vue'
import AppLogo from './AppLogo.vue'
import ThemeToggle from './ThemeToggle.vue'

defineProps<{ menuOpen: boolean }>()
defineEmits<{ openMenu: [] }>()
</script>

<!-- Yalnızca mobilde görünen lacivert üst bar: menü düğmesi, logo, tema düğmesi. -->
<template>
  <header class="sticky top-0 z-20 flex items-center gap-2 bg-ink px-4 py-2.5 md:hidden">
    <button
      id="menu-button"
      type="button"
      aria-label="Menüyü aç"
      aria-controls="app-sidebar"
      :aria-expanded="menuOpen"
      class="-ml-2 rounded-lg p-2 text-white hover:bg-white/10 focus-visible:outline-marker"
      @click="$emit('openMenu')"
    >
      <AppIcon name="menu" class="size-6" />
    </button>
    <AppLogo tone="inverse" />
    <ThemeToggle tone="inverse" class="ml-auto" />
  </header>
</template>
