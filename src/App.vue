<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { useLayoutTransition } from '@/composables/useLayoutTransition'
import AppLayout from '@/layouts/AppLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import PublicLayout from '@/layouts/PublicLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { usePreferencesStore } from '@/stores/preferences'

usePreferencesStore() // temayı uygular ve sistem teması değişikliklerini dinler

const route = useRoute()
const auth = useAuthStore()
const { leaving } = useLayoutTransition()

const LAYOUTS = { app: AppLayout, public: PublicLayout, auth: AuthLayout }

const layoutName = computed<keyof typeof LAYOUTS>(() => {
  const { layout } = route.meta
  // 'auto': herkese açık sayfa (ör. Gizlilik), giriş yapmışsa menüsüyle birlikte gösterilir.
  if (layout === 'auto') return auth.isAuthenticated ? 'app' : 'public'
  return layout ?? 'app'
})

/** Sayfa sarmalayıcısının çerçeveye göre yerleşimi. */
const pageClass = computed(() =>
  layoutName.value === 'public' ? 'flex w-full items-start justify-center' : undefined,
)
</script>

<template>
  <!--
    Geçişler <Transition> yerine "eklenince oynayan" CSS animasyonlarıyla yapılır (main.css):
    anahtar (key) değişince eski öğe aynı anda kaldırılır, yenisi .layout-in / .page-in ile
    belirir. Böylece geçiş sırasında iki sayfa birden ekranda bulunmaz.
  -->
  <!-- Çerçeve geçişi (#35): eski çerçevenin solması useLayoutTransition ile önceden yapılır. -->
  <div :key="layoutName" class="layout-shell layout-in" :class="{ 'is-leaving': leaving }">
    <component :is="LAYOUTS[layoutName]">
      <!-- Sayfa geçişi (#34): yeni sayfa hafifçe yukarı kayarak belirir. -->
      <RouterView v-slot="{ Component, route: current }">
        <!-- Sayfaların birden çok kök öğesi olabildiği için tek bir sarmalayıcıya alınır. -->
        <div :key="current.path" class="page-in" :class="pageClass">
          <component :is="Component" />
        </div>
      </RouterView>
    </component>
  </div>
</template>
