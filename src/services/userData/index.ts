import { isFirebaseEnabled } from '@/firebase'
import type { CustomTask, TaskStatus } from '@/types/task'
import type { UserData } from '@/types/user'
import { firestoreUserDataService } from './firestore'
import { localUserDataService } from './local'

/** Kullanıcıya özel verinin (görev durumları, kendi görevleri) okunup yazıldığı ortak arayüz. */
export interface UserDataService {
  load(uid: string): Promise<UserData>
  setTaskStatus(uid: string, taskId: string, status: TaskStatus): Promise<void>
  /** Kullanıcının kendi görevini ekler ya da (aynı id ile) tamamen değiştirir. */
  saveCustomTask(uid: string, task: CustomTask): Promise<void>
  /** Kullanıcının kendi görevini ve o görevin durumunu siler. */
  deleteCustomTask(uid: string, taskId: string): Promise<void>
  /** Hesap silinirken kullanıcının tüm verisini siler (KVKK). */
  remove(uid: string): Promise<void>
}

export const userDataService: UserDataService = isFirebaseEnabled
  ? firestoreUserDataService
  : localUserDataService
