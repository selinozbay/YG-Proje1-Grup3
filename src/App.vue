<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import PublicLayout from '@/layouts/PublicLayout.vue'
import DemoBanner from '@/components/layout/DemoBanner.vue'
import { usePreferencesStore } from '@/stores/preferences'

usePreferencesStore() // temayı uygular ve sistem teması değişikliklerini dinler

const route = useRoute()
const layout = computed(() => (route.meta.layout === 'public' ? PublicLayout : AppLayout))
</script>

<template>
  <DemoBanner />
  <component :is="layout">
    <RouterView />
  </component>
</template>
