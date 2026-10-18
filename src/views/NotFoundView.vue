<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="text-center">
    <p class="text-5xl font-bold text-slate-300 dark:text-slate-700">404</p>
    <h1 class="mt-2 text-2xl font-bold">Sayfa bulunamadı</h1>
    <p class="mt-1 text-slate-600 dark:text-slate-400">Aradığınız sayfa taşınmış ya da hiç yok.</p>
    <RouterLink to="/" class="mt-4 inline-block text-indigo-600 underline dark:text-indigo-400">
      Ana sayfaya dön
    </RouterLink>
  </div>
</template>
