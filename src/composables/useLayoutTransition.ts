import { readonly, ref } from 'vue'

/** Uygulama çerçevesi kapanış animasyonundayken true (App.vue bu sınıfı uygular). */
const leaving = ref(false)

const LEAVE_ANIMATION_MS = 200

/**
 * Menülü çerçeveyi önce soldurur, sonra verilen işi yapar (ör. çıkış yapıp giriş
 * ekranına gitmek). Giriş ekranı da App.vue'daki "layout" geçişiyle kayarak gelir (#35).
 * "Hareketi azalt" açıksa beklemeden devam edilir.
 */
export function useLayoutTransition() {
  async function leaveApp(action: () => Promise<void>) {
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    leaving.value = true
    try {
      if (!reduceMotion) await new Promise((resolve) => setTimeout(resolve, LEAVE_ANIMATION_MS))
      await action()
    } finally {
      leaving.value = false
    }
  }

  return { leaving: readonly(leaving), leaveApp }
}
