<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
import AppNav from '@/components/layout/AppNav.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import SkipLink from '@/components/layout/SkipLink.vue'
</script>

<!-- Giriş yapmış kullanıcının çerçevesi: masaüstünde sol menü, mobilde alt menü. -->
<template>
  <SkipLink />
  <div class="min-h-screen md:flex">
    <AppNav />
    <div class="flex min-h-screen min-w-0 flex-1 flex-col">
      <AppHeader />
      <main id="main" tabindex="-1" class="flex-1 px-4 py-6 pb-24 md:px-8 md:pb-8">
        <slot />
      </main>
      <AppFooter class="pb-20 md:pb-4" />
    </div>
  </div>
</template>
