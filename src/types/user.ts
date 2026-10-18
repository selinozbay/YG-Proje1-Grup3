import type { TaskStatus } from './task'

export interface AppUser {
  uid: string
  email: string
  displayName: string | null
}

/** Kullanıcıya özel saklanan veri (Firestore'da users/{uid}, demo modunda localStorage). */
export interface UserData {
  taskStatuses: Record<string, TaskStatus> // görev id → durum
}

export type ThemePreference = 'light' | 'dark' | 'system'
