<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import DemoBanner from '@/components/layout/DemoBanner.vue'
import SkipLink from '@/components/layout/SkipLink.vue'
import { useMediaQuery } from '@/composables/useMediaQuery'

const isDesktop = useMediaQuery('(min-width: 768px)') // Tailwind'in md: kırılımı
const sidebarOpen = ref(false)
const route = useRoute()

function openSidebar() {
  sidebarOpen.value = true
}

/** Mobil menüyü kapatır; Esc, kapatma düğmesi ya da arka plan ile kapanınca odak menü düğmesine döner. */
function closeSidebar(returnFocus = true) {
  if (!sidebarOpen.value) return
  sidebarOpen.value = false
  if (returnFocus) document.getElementById('menu-button')?.focus()
}

// Sayfa değişince ya da ekran masaüstü boyutuna geçince mobil menü kapanır.
watch(
  () => route.fullPath,
  () => closeSidebar(false),
)
watch(isDesktop, () => closeSidebar(false))

// Menü açıkken arkadaki sayfa kaymasın.
watch(sidebarOpen, (open) => document.body.classList.toggle('overflow-hidden', open))

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') closeSidebar()
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.classList.remove('overflow-hidden')
})
</script>

<!-- Giriş yapmış kullanıcının çerçevesi: solda kenar çubuğu, sağda sayfa içeriği. -->
<template>
  <SkipLink />
  <div class="md:flex">
    <!-- Mobilde kapalı menü klavyeyle odaklanamasın diye inert yapılır. -->
    <AppSidebar
      :open="sidebarOpen"
      :inert="(!isDesktop && !sidebarOpen) || undefined"
      @close="closeSidebar()"
    />
    <Transition
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
    >
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-sm md:hidden"
        aria-hidden="true"
        @click="closeSidebar()"
      />
    </Transition>

    <div class="flex min-h-screen min-w-0 flex-1 flex-col">
      <DemoBanner />
      <AppHeader :menu-open="sidebarOpen" @open-menu="openSidebar" />
      <main id="main" tabindex="-1" class="flex-1 px-4 py-6 md:px-10 md:py-10">
        <slot />
      </main>
      <AppFooter />
    </div>
  </div>
</template>
