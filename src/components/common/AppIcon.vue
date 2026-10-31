<script setup lang="ts">
// Uygulamadaki tüm ikonlar tek yerde. Yeni ikon eklemek için IconName'e ad,
// PATHS'e 24x24 çizim yolunu ekleyin. Boyut ve renk kullanıldığı yerde verilir:
// <AppIcon name="home" class="size-5 text-slate-400" />
type IconName =
  | 'logo'
  | 'home'
  | 'book'
  | 'tasks'
  | 'user'
  | 'logout'
  | 'menu'
  | 'close'
  | 'sun'
  | 'moon'
  | 'shield'

defineProps<{ name: IconName }>()

const PATHS: Record<IconName, string[]> = {
  logo: ['M22 10 12 5 2 10l10 5 10-5z', 'M6 12v5c3 3 9 3 12 0v-5'],
  home: ['M3 10.5 12 3l9 7.5', 'M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5'],
  book: ['M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z', 'M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z'],
  tasks: ['M9 11l3 3L22 4', 'M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11'],
  user: ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z'],
  logout: ['M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4', 'M16 17l5-5-5-5', 'M21 12H9'],
  menu: ['M4 6h16', 'M4 12h16', 'M4 18h16'],
  close: ['M18 6 6 18', 'M6 6l12 12'],
  sun: [
    'M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z',
    'M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  ],
  moon: ['M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z'],
  shield: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', 'M9 12l2 2 4-4'],
}
</script>

<template>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path v-for="d in PATHS[name]" :key="d" :d="d" />
  </svg>
</template>
