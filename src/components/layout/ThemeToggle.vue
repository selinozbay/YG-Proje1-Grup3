<script setup lang="ts">
import { computed } from 'vue'
import { usePreferencesStore } from '@/stores/preferences'

const preferences = usePreferencesStore()
const label = computed(() => (preferences.isDark ? 'Aydınlık temaya geç' : 'Karanlık temaya geç'))

function toggle() {
  preferences.setTheme(preferences.isDark ? 'light' : 'dark')
}
</script>

<template>
  <button
    type="button"
    :aria-label="label"
    :title="label"
    class="rounded-lg p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
    @click="toggle"
  >
    <!-- Güneş (karanlık temadayken) / Ay (aydınlık temadayken) -->
    <svg
      v-if="preferences.isDark"
      class="size-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path
        d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
      />
    </svg>
    <svg
      v-else
      class="size-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      aria-hidden="true"
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  </button>
</template>
