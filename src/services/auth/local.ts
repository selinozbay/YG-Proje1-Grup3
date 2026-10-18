import { STORAGE_KEYS } from '@/config'
import type { AppUser } from '@/types/user'
import type { AuthService } from '.'
import { createAuthError } from './errors'

/*
 * DEMO MODU girişi: Firebase yokken uygulamanın denenebilmesi için.
 * Şifre saklanmaz ve kontrol edilmez; oturum yalnızca bu tarayıcıda tutulur.
 */

const listeners = new Set<(user: AppUser | null) => void>()
let currentUser = readUser()

function readUser(): AppUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.demoUser)
    return raw ? (JSON.parse(raw) as AppUser) : null
  } catch {
    return null
  }
}

function setUser(user: AppUser | null) {
  currentUser = user
  try {
    if (user) localStorage.setItem(STORAGE_KEYS.demoUser, JSON.stringify(user))
    else localStorage.removeItem(STORAGE_KEYS.demoUser)
  } catch {
    // Depolama kapalıysa oturum yalnızca bu sekme açıkken yaşar.
  }
  listeners.forEach((listener) => listener(user))
}

function validate(email: string, password: string) {
  if (!/^\S+@\S+\.\S+$/.test(email)) throw createAuthError('auth/invalid-email')
  if (password.length < 6) throw createAuthError('auth/weak-password')
}

const toUser = (email: string, displayName: string | null): AppUser => ({
  uid: `demo-${email.toLowerCase()}`,
  email,
  displayName,
})

export const localAuthService: AuthService = {
  onChange(callback) {
    listeners.add(callback)
    callback(currentUser)
    return () => {
      listeners.delete(callback)
    }
  },

  async register(email, password, displayName) {
    validate(email, password)
    const user = toUser(email, displayName)
    setUser(user)
    return user
  },

  async login(email, password) {
    validate(email, password)
    const user = toUser(email, null)
    setUser(user)
    return user
  },

  async logout() {
    setUser(null)
  },

  async resetPassword() {
    // Demo modunda e-posta gönderilmez.
  },

  async deleteAccount() {
    setUser(null)
  },
}
