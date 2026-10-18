import { computed, ref, watchEffect } from 'vue'
import { defineStore } from 'pinia'
import { STORAGE_KEYS } from '@/config'
import type { ThemePreference } from '@/types/user'

/**
 * Kullanıcı tercihleri (şimdilik tema). Giriş yapmadan da çalışsın diye
 * Firestore'a değil, localStorage'a kaydedilir.
 * Varsayılan tema aydınlıktır; 'system' seçilirse işletim sisteminin teması izlenir.
 */
export const usePreferencesStore = defineStore('preferences', () => {
  const theme = ref<ThemePreference>(readTheme())

  const media = window.matchMedia('(prefers-color-scheme: dark)')
  const systemPrefersDark = ref(media.matches)
  media.addEventListener('change', (event) => (systemPrefersDark.value = event.matches))

  const isDark = computed(
    () => theme.value === 'dark' || (theme.value === 'system' && systemPrefersDark.value),
  )

  // <html class="dark"> ile Tailwind'in dark: sınıfları devreye girer.
  watchEffect(() => document.documentElement.classList.toggle('dark', isDark.value))

  function setTheme(next: ThemePreference) {
    theme.value = next
    try {
      localStorage.setItem(STORAGE_KEYS.theme, next)
    } catch {
      // Depolama kapalıysa tercih yalnızca bu oturumda geçerli olur.
    }
  }

  return { theme, isDark, setTheme }
})

function readTheme(): ThemePreference {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.theme)
    if (saved === 'light' || saved === 'dark' || saved === 'system') return saved
  } catch {
    // Depolama kapalıysa varsayılan tema kullanılır.
  }
  return 'light'
}
