import { STORAGE_KEYS } from '@/config'
import type { UserData } from '@/types/user'
import type { UserDataService } from '.'

// DEMO MODU: kullanıcı verisi bu tarayıcının localStorage'ında tutulur.

function read(uid: string): UserData {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.userData(uid))
    const data = raw ? (JSON.parse(raw) as Partial<UserData>) : {}
    return { taskStatuses: data.taskStatuses ?? {} }
  } catch {
    return { taskStatuses: {} }
  }
}

function write(uid: string, data: UserData) {
  try {
    localStorage.setItem(STORAGE_KEYS.userData(uid), JSON.stringify(data))
  } catch {
    // Depolama kapalıysa değişiklik yalnızca sayfa açıkken korunur.
  }
}

export const localUserDataService: UserDataService = {
  async load(uid) {
    return read(uid)
  },

  async setTaskStatus(uid, taskId, status) {
    const data = read(uid)
    data.taskStatuses[taskId] = status
    write(uid, data)
  },

  async remove(uid) {
    try {
      localStorage.removeItem(STORAGE_KEYS.userData(uid))
    } catch {
      // Depolama kapalıysa silinecek veri de yoktur.
    }
  },
}
