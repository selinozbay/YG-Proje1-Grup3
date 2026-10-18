import { isFirebaseEnabled } from '@/firebase'
import type { TaskStatus } from '@/types/task'
import type { UserData } from '@/types/user'
import { firestoreUserDataService } from './firestore'
import { localUserDataService } from './local'

/** Kullanıcıya özel verinin (görev durumları) okunup yazıldığı ortak arayüz. */
export interface UserDataService {
  load(uid: string): Promise<UserData>
  setTaskStatus(uid: string, taskId: string, status: TaskStatus): Promise<void>
  /** Hesap silinirken kullanıcının tüm verisini siler (KVKK). */
  remove(uid: string): Promise<void>
}

export const userDataService: UserDataService = isFirebaseEnabled
  ? firestoreUserDataService
  : localUserDataService
