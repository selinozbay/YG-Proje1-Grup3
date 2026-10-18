<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { APP_NAME } from '@/config'
import AppFooter from '@/components/layout/AppFooter.vue'
import SkipLink from '@/components/layout/SkipLink.vue'
import ThemeToggle from '@/components/layout/ThemeToggle.vue'
</script>

<!-- Giriş, kayıt, gizlilik ve 404 sayfalarının sade çerçevesi. -->
<template>
  <SkipLink />
  <div class="flex min-h-screen flex-col">
    <header class="flex items-center justify-between px-4 py-4 md:px-8">
      <RouterLink to="/" class="text-lg font-bold">{{ APP_NAME }}</RouterLink>
      <ThemeToggle />
    </header>
    <main id="main" tabindex="-1" class="flex flex-1 justify-center px-4 py-8">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
