<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import AppIcon from '@/components/common/AppIcon.vue'
import { useAuthStore } from '@/stores/auth'
import AppLogo from './AppLogo.vue'
import ThemeToggle from './ThemeToggle.vue'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const items = [
  { to: '/', label: 'Ana Sayfa', icon: 'home' },
  { to: '/derslerim', label: 'Derslerim', icon: 'book' },
  { to: '/gorevlerim', label: 'Görevlerim', icon: 'tasks' },
  { to: '/profil', label: 'Profil', icon: 'user' },
] as const

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

// "Derslerim" bir dersin ya da haftanın içindeyken de seçili görünsün.
const isActive = (to: string) => (to === '/' ? route.path === '/' : route.path.startsWith(to))

const displayName = computed(() => auth.user?.displayName || auth.user?.email || '')

/** Ad soyadın baş harfleri (en fazla 2), ad yoksa e-postanın ilk harfi. */
const initials = computed(() =>
  displayName.value
    .split(/[\s@]+/)
    .filter(Boolean)
    .slice(0, auth.user?.displayName ? 2 : 1)
    .map((word) => word.charAt(0).toLocaleUpperCase('tr-TR'))
    .join(''),
)

// Mobilde menü açılınca odak kapatma düğmesine geçer (klavye ve ekran okuyucu için).
const closeButton = ref<HTMLButtonElement | null>(null)
watch(
  () => props.open,
  async (open) => {
    if (!open) return
    await nextTick()
    closeButton.value?.focus()
  },
)

async function logout() {
  await auth.logout()
  await router.replace({ name: 'login' })
}
</script>

<!--
  Masaüstünde (md ve üstü) solda sabit duran kenar çubuğu.
  Mobilde soldan kayarak açılan çekmece; açma/kapama AppLayout'ta yönetilir.
-->
<template>
  <aside
    id="app-sidebar"
    aria-label="Kenar çubuğu"
    class="flex w-72 shrink-0 flex-col border-r border-slate-200 bg-white max-md:fixed max-md:transition-transform max-md:duration-200 max-md:ease-out max-md:inset-y-0 max-md:left-0 max-md:z-40 max-md:shadow-xl md:sticky md:top-0 md:h-screen md:w-64 md:translate-x-0 dark:border-slate-800 dark:bg-slate-900"
    :class="open ? 'translate-x-0' : 'max-md:-translate-x-full'"
  >
    <div class="flex items-center gap-2 px-5 pt-6 pb-4">
      <AppLogo subtitle="Proje 1 · Grup 3" />
      <button
        ref="closeButton"
        type="button"
        aria-label="Menüyü kapat"
        class="-mr-2 ml-auto rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden dark:hover:bg-slate-800"
        @click="emit('close')"
      >
        <AppIcon name="close" class="size-5" />
      </button>
    </div>

    <nav aria-label="Ana menü" class="flex-1 overflow-y-auto px-3 py-2">
      <p
        class="px-3 pb-2 text-xs font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500"
      >
        Menü
      </p>
      <ul class="space-y-1">
        <li v-for="item in items" :key="item.to">
          <RouterLink
            :to="item.to"
            :aria-current="isActive(item.to) ? 'page' : undefined"
            class="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
            :class="
              isActive(item.to)
                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
            "
          >
            <AppIcon
              :name="item.icon"
              class="size-5 shrink-0 transition-colors"
              :class="
                isActive(item.to)
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300'
              "
            />
            {{ item.label }}
          </RouterLink>
        </li>
      </ul>
    </nav>

    <div class="border-t border-slate-200 p-3 dark:border-slate-800">
      <div class="flex items-center gap-3 rounded-xl px-2 py-2">
        <span
          class="grid size-9 shrink-0 place-items-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
          aria-hidden="true"
        >
          {{ initials }}
        </span>
        <span class="min-w-0 flex-1">
          <span class="block truncate text-sm font-medium">{{ displayName }}</span>
          <span
            v-if="auth.user?.displayName"
            class="block truncate text-xs text-slate-500 dark:text-slate-400"
          >
            {{ auth.user.email }}
          </span>
        </span>
        <ThemeToggle />
      </div>
      <!-- KVKK aydınlatma metni her zaman bir tık uzakta olsun (#36). -->
      <RouterLink
        to="/gizlilik"
        :aria-current="isActive('/gizlilik') ? 'page' : undefined"
        class="mt-1 flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-colors"
        :class="
          isActive('/gizlilik')
            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300'
            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
        "
      >
        <AppIcon name="shield" class="size-4" />
        Gizlilik ve KVKK
      </RouterLink>
      <button
        type="button"
        class="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-700 dark:text-slate-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
        @click="logout"
      >
        <AppIcon name="logout" class="size-5" />
        Çıkış yap
      </button>
    </div>
  </aside>
</template>
