<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import PublicLayout from '@/layouts/PublicLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { usePreferencesStore } from '@/stores/preferences'

usePreferencesStore() // temayı uygular ve sistem teması değişikliklerini dinler

const route = useRoute()
const auth = useAuthStore()

const layout = computed(() => {
  const { layout } = route.meta
  // 'auto': herkese açık sayfa (ör. Gizlilik), giriş yapmışsa menüsüyle birlikte gösterilir.
  const isPublic = layout === 'public' || (layout === 'auto' && !auth.isAuthenticated)
  return isPublic ? PublicLayout : AppLayout
})
</script>

<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>
