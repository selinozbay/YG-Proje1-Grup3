import type { CustomTask, TaskStatus } from './task'

export interface AppUser {
  uid: string
  email: string
  displayName: string | null
}

/** Kullanıcıya özel saklanan veri (Firestore'da users/{uid}, demo modunda localStorage). */
export interface UserData {
  taskStatuses: Record<string, TaskStatus> // görev id → durum
  customTasks: Record<string, CustomTask> // kullanıcının kendi eklediği görevler (#23), id → görev
}

export type ThemePreference = 'light' | 'dark' | 'system'
