<script setup lang="ts">
import { useRouter } from 'vue-router'
import { APP_NAME } from '@/config'
import { useAuthStore } from '@/stores/auth'
import ThemeToggle from './ThemeToggle.vue'

const auth = useAuthStore()
const router = useRouter()

async function logout() {
  await auth.logout()
  await router.replace({ name: 'login' })
}
</script>

<template>
  <header
    class="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 md:px-8 dark:border-slate-800 dark:bg-slate-900"
  >
    <p class="font-bold md:hidden">{{ APP_NAME }}</p>
    <div class="ml-auto flex items-center gap-3">
      <span class="hidden truncate text-sm text-slate-600 sm:inline dark:text-slate-400">
        {{ auth.user?.displayName || auth.user?.email }}
      </span>
      <ThemeToggle />
      <button
        type="button"
        class="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        @click="logout"
      >
        Çıkış yap
      </button>
    </div>
  </header>
</template>
