<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { useLayoutTransition } from '@/composables/useLayoutTransition'
import AppLayout from '@/layouts/AppLayout.vue'
import PublicLayout from '@/layouts/PublicLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { usePreferencesStore } from '@/stores/preferences'

usePreferencesStore() // temayı uygular ve sistem teması değişikliklerini dinler

const route = useRoute()
const auth = useAuthStore()
const { leaving } = useLayoutTransition()

const isPublicLayout = computed(() => {
  const { layout } = route.meta
  // 'auto': herkese açık sayfa (ör. Gizlilik), giriş yapmışsa menüsüyle birlikte gösterilir.
  return layout === 'public' || (layout === 'auto' && !auth.isAuthenticated)
})
</script>

<template>
  <!--
    Çerçeve geçişi (#35): giriş ekranı ile menülü çerçeve arasında geçerken yeni ekran
    aşağıdan kayarak gelir. Eski ekranın solması useLayoutTransition ile önceden yapılır.
  -->
  <!-- Eski çerçeve zaten soldurulduğu için beklemeden kalkar (leave: 0). -->
  <Transition name="layout" :duration="{ enter: 300, leave: 0 }">
    <div
      :key="isPublicLayout ? 'public' : 'app'"
      class="layout-shell"
      :class="{ 'is-leaving': leaving }"
    >
      <component :is="isPublicLayout ? PublicLayout : AppLayout">
        <!-- Sayfa geçişi (#34): eski sayfa solar, yenisi hafifçe yukarı kayarak gelir. -->
        <RouterView v-slot="{ Component, route: current }">
          <!--
            Eski sayfa beklemeden kalkar (leave: 0); yoksa geçiş sırasında eski sayfanın
            form alanları kısa bir an ekranda kalır ve yazılanlar yanlış sayfaya gider.
          -->
          <Transition name="page" mode="out-in" :duration="{ enter: 180, leave: 0 }">
            <!-- Sayfaların birden çok kök öğesi olabildiği için tek bir sarmalayıcıya alınır. -->
            <div
              :key="current.path"
              :class="isPublicLayout && 'flex w-full items-start justify-center'"
            >
              <component :is="Component" />
            </div>
          </Transition>
        </RouterView>
      </component>
    </div>
  </Transition>
</template>
