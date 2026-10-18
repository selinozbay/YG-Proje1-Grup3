<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AppFooter from '@/components/layout/AppFooter.vue'
import AppLogo from '@/components/layout/AppLogo.vue'
import DemoBanner from '@/components/layout/DemoBanner.vue'
import SkipLink from '@/components/layout/SkipLink.vue'
import ThemeToggle from '@/components/layout/ThemeToggle.vue'
</script>

<!-- Giriş, kayıt, gizlilik ve 404 sayfalarının sade çerçevesi. -->
<template>
  <SkipLink />
  <div class="flex min-h-screen flex-col">
    <DemoBanner />
    <header class="flex items-center justify-between px-4 py-4 md:px-8">
      <RouterLink to="/" class="rounded-xl">
        <AppLogo />
      </RouterLink>
      <ThemeToggle />
    </header>
    <main id="main" tabindex="-1" class="flex flex-1 justify-center px-4 py-8">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
