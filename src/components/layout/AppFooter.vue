<script setup lang="ts">
import { RouterLink } from 'vue-router'

const year = new Date().getFullYear()
</script>

<template>
  <footer
    class="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 py-4 text-sm text-slate-500 dark:text-slate-400"
  >
    <span>© {{ year }} YG-Proje1-Grup3</span>
    <RouterLink to="/gizlilik" class="underline hover:text-slate-900 dark:hover:text-slate-100">
      Gizlilik ve KVKK
    </RouterLink>
  </footer>
</template>
