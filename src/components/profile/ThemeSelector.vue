<script setup lang="ts">
import { computed } from 'vue'
import { usePreferencesStore } from '@/stores/preferences'
import type { ThemePreference } from '@/types/user'

// Tema seçimi (#52). Seçim preferences store'da localStorage'a kaydedilir;
// sayfa yenilenince index.html'deki betik ve store aynı tercihi okur.
// Her seçenekte o temanın küçük bir önizlemesi çizilir.
const preferences = usePreferencesStore()

const theme = computed({
  get: () => preferences.theme,
  set: (value: ThemePreference) => preferences.setTheme(value),
})

const OPTIONS: { value: ThemePreference; label: string; hint: string }[] = [
  { value: 'light', label: 'Aydınlık', hint: 'Her zaman açık renkler' },
  { value: 'dark', label: 'Karanlık', hint: 'Her zaman koyu renkler' },
  { value: 'system', label: 'Sistem', hint: 'Cihazın temasını izler' },
]
</script>

<template>
  <fieldset
    class="rounded-2xl bg-white p-5 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
  >
    <legend class="float-left mb-4 w-full text-lg font-bold font-stretch-condensed">Tema</legend>
    <div class="clear-both grid grid-cols-3 gap-2.5">
      <label
        v-for="option in OPTIONS"
        :key="option.value"
        class="group cursor-pointer rounded-xl p-1.5 ring-1 ring-slate-200 transition-shadow focus-within:ring-2 focus-within:ring-indigo-500 hover:ring-slate-400 has-[:checked]:ring-[3px] has-[:checked]:ring-indigo-500 dark:ring-slate-700 dark:hover:ring-slate-500 dark:has-[:checked]:ring-indigo-400"
        data-test="theme-option"
      >
        <input v-model="theme" type="radio" name="theme" :value="option.value" class="sr-only" />
        <!-- Önizleme: temayı izleyen kenar çubuğu, turuncu seçili menü, açık ya da koyu zemin. -->
        <span
          aria-hidden="true"
          class="relative flex h-16 overflow-hidden rounded-lg ring-1 ring-black/5"
          :class="option.value === 'dark' ? 'bg-slate-950' : 'bg-paper'"
        >
          <span
            class="flex w-1/3 flex-col gap-1 border-r p-1.5"
            :class="
              option.value === 'dark'
                ? 'border-slate-800 bg-slate-900'
                : 'border-slate-200 bg-white'
            "
          >
            <span class="h-1.5 w-full rounded-sm bg-indigo-500" />
            <span
              class="h-1 w-3/4 rounded-sm"
              :class="option.value === 'dark' ? 'bg-slate-600' : 'bg-slate-300'"
            />
            <span
              class="h-1 w-2/3 rounded-sm"
              :class="option.value === 'dark' ? 'bg-slate-600' : 'bg-slate-300'"
            />
          </span>
          <span class="flex flex-1 flex-col gap-1.5 p-2">
            <span
              class="h-2 w-3/4 rounded-sm"
              :class="option.value === 'dark' ? 'bg-slate-500' : 'bg-slate-700'"
            />
            <span
              class="h-5 w-full rounded"
              :class="option.value === 'dark' ? 'bg-slate-800' : 'bg-white'"
            />
          </span>
          <!-- Sistem: önizlemenin sağ yarısı koyu. -->
          <span
            v-if="option.value === 'system'"
            class="absolute inset-y-0 right-0 flex w-[36%] flex-col gap-1.5 bg-slate-950 p-2 pl-0"
          >
            <span class="h-2 w-1/2 rounded-r-sm bg-slate-500" />
            <span class="h-5 w-full rounded-r bg-slate-800" />
          </span>
        </span>
        <span class="block px-1 pt-2 pb-0.5">
          <span class="block text-sm font-semibold">{{ option.label }}</span>
          <span class="block text-xs leading-snug text-slate-500 dark:text-slate-400">{{
            option.hint
          }}</span>
        </span>
      </label>
    </div>
  </fieldset>
</template>
