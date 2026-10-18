import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { authService } from '@/services/auth'
import { userDataService } from '@/services/userData'
import type { AppUser } from '@/types/user'
import { useProgressStore } from './progress'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AppUser | null>(null)
  const isAuthenticated = computed(() => user.value !== null)

  // Firebase oturumu sayfa açılışında birkaç milisaniye sonra belli olur.
  // Router, kullanıcıyı yönlendirmeden önce bunu bekler (bkz. router/index.ts).
  let markReady: () => void = () => {}
  const ready = new Promise<void>((resolve) => (markReady = resolve))
  let started = false

  /** Uygulama açılırken bir kez çağrılır (main.ts). */
  function init() {
    if (started) return
    started = true
    authService.onChange((nextUser) => {
      user.value = nextUser
      const progress = useProgressStore()
      if (nextUser) void progress.load(nextUser.uid)
      else progress.reset()
      markReady()
    })
  }

  function waitUntilReady() {
    return ready
  }

  async function register(email: string, password: string, displayName: string) {
    user.value = await authService.register(email, password, displayName)
  }

  async function login(email: string, password: string) {
    user.value = await authService.login(email, password)
  }

  async function logout() {
    await authService.logout()
  }

  async function resetPassword(email: string) {
    await authService.resetPassword(email)
  }

  /** KVKK: önce kullanıcının verisi, sonra hesabın kendisi silinir. */
  async function deleteAccount() {
    if (!user.value) return
    await userDataService.remove(user.value.uid)
    await authService.deleteAccount()
  }

  return {
    user,
    isAuthenticated,
    init,
    waitUntilReady,
    register,
    login,
    logout,
    resetPassword,
    deleteAccount,
  }
})
