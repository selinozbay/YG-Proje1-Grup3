<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AuthBrandPanel from '@/components/auth/AuthBrandPanel.vue'
import AppLogo from '@/components/layout/AppLogo.vue'
import DemoBanner from '@/components/layout/DemoBanner.vue'
import SkipLink from '@/components/layout/SkipLink.vue'
import ThemeToggle from '@/components/layout/ThemeToggle.vue'
</script>

<!--
  Giriş, kayıt ve şifremi unuttum ekranlarının çerçevesi (#3).
  Geniş ekranda tam yükseklikte iki bölüm: solda tanıtım paneli, sağda form.
  Dar ekranda yalnızca form ve üstte logo görünür.
-->
<template>
  <SkipLink />
  <div class="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
    <AuthBrandPanel />

    <div class="flex min-h-screen flex-col bg-white dark:bg-slate-950">
      <DemoBanner />
      <header class="flex items-center justify-between px-6 pt-6 sm:px-10">
        <RouterLink to="/" class="rounded-xl lg:invisible">
          <AppLogo />
        </RouterLink>
        <ThemeToggle />
      </header>

      <main id="main" tabindex="-1" class="flex flex-1 items-center justify-center px-6 py-10">
        <div class="w-full max-w-md">
          <slot />
        </div>
      </main>

      <footer class="px-6 pb-6 text-center text-sm text-slate-500 dark:text-slate-400">
        <RouterLink to="/gizlilik" class="hover:text-indigo-600 dark:hover:text-indigo-400">
          Gizlilik ve KVKK
        </RouterLink>
      </footer>
    </div>
  </div>
</template>
