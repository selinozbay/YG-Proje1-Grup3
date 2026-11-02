<script setup lang="ts">
import { computed } from 'vue'
import AppIcon from '@/components/common/AppIcon.vue'
import { usePreferencesStore } from '@/stores/preferences'

/** tone="inverse": lacivert zeminde (kenar çubuğu, mobil üst bar) açık renkli düğme. */
withDefaults(defineProps<{ tone?: 'default' | 'inverse' }>(), { tone: 'default' })

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
    class="rounded-lg p-2"
    :class="
      tone === 'inverse'
        ? 'text-slate-300 hover:bg-white/10 hover:text-white focus-visible:outline-marker'
        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
    "
    @click="toggle"
  >
    <!-- Karanlık temadayken güneş, aydınlık temadayken ay gösterilir. -->
    <AppIcon :name="preferences.isDark ? 'sun' : 'moon'" class="size-5" />
  </button>
</template>
