<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { APP_NAME } from '@/config'

const items = [
  { to: '/', label: 'Ana Sayfa' },
  { to: '/derslerim', label: 'Derslerim' },
  { to: '/gorevlerim', label: 'Görevlerim' },
  { to: '/profil', label: 'Profil' },
]

const route = useRoute()

// "Derslerim" bir dersin ya da haftanın içindeyken de seçili görünsün.
const isActive = (to: string) => (to === '/' ? route.path === '/' : route.path.startsWith(to))
</script>

<template>
  <nav
    aria-label="Ana menü"
    class="fixed inset-x-0 bottom-0 z-10 border-t border-slate-200 bg-white md:static md:w-60 md:shrink-0 md:border-t-0 md:border-r dark:border-slate-800 dark:bg-slate-900"
  >
    <p class="hidden px-6 py-5 text-lg font-bold md:block">{{ APP_NAME }}</p>
    <ul class="grid grid-cols-4 md:block md:space-y-1 md:px-3">
      <li v-for="item in items" :key="item.to">
        <RouterLink
          :to="item.to"
          :aria-current="isActive(item.to) ? 'page' : undefined"
          class="block px-2 py-3 text-center text-xs font-medium sm:text-sm md:rounded-lg md:px-3 md:py-2 md:text-left"
          :class="
            isActive(item.to)
              ? 'text-indigo-700 md:bg-indigo-50 dark:text-indigo-300 md:dark:bg-indigo-950'
              : 'text-slate-600 hover:text-slate-900 md:hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 md:dark:hover:bg-slate-800'
          "
        >
          {{ item.label }}
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>
