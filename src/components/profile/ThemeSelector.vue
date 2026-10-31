<script setup lang="ts">
import { computed } from 'vue'
import { usePreferencesStore } from '@/stores/preferences'
import type { ThemePreference } from '@/types/user'

// Tema seçimi (#52). Seçim preferences store'da localStorage'a kaydedilir;
// sayfa yenilenince index.html'deki betik ve store aynı tercihi okur.
const preferences = usePreferencesStore()

const theme = computed({
  get: () => preferences.theme,
  set: (value: ThemePreference) => preferences.setTheme(value),
})

const OPTIONS: { value: ThemePreference; label: string; hint: string; icon: string[] }[] = [
  {
    value: 'light',
    label: 'Aydınlık',
    hint: 'Her zaman açık renkler',
    icon: [
      'M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z',
      'M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
    ],
  },
  {
    value: 'dark',
    label: 'Karanlık',
    hint: 'Her zaman koyu renkler',
    icon: ['M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z'],
  },
  {
    value: 'system',
    label: 'Sistem',
    hint: 'Cihazın temasını izler',
    icon: [
      'M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
      'M8 21h8M12 17v4',
    ],
  },
]
</script>

<template>
  <fieldset
    class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
  >
    <legend class="float-left mb-3 w-full font-semibold">Tema</legend>
    <div class="clear-both grid gap-2">
      <label
        v-for="option in OPTIONS"
        :key="option.value"
        class="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-3 transition-colors focus-within:ring-2 focus-within:ring-indigo-500 hover:bg-slate-50 has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50 dark:border-slate-700 dark:hover:bg-slate-800 dark:has-[:checked]:border-indigo-400 dark:has-[:checked]:bg-indigo-500/10"
        data-test="theme-option"
      >
        <input v-model="theme" type="radio" name="theme" :value="option.value" class="sr-only" />
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          class="size-5 shrink-0 text-slate-500 dark:text-slate-400"
        >
          <path v-for="d in option.icon" :key="d" :d="d" />
        </svg>
        <span>
          <span class="block text-sm font-medium">{{ option.label }}</span>
          <span class="block text-xs text-slate-500 dark:text-slate-400">{{ option.hint }}</span>
        </span>
      </label>
    </div>
  </fieldset>
</template>
