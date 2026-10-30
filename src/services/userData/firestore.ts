import {
  deleteDoc,
  deleteField,
  doc,
  FieldPath,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { getFirebase } from '@/firebase'
import type { UserData } from '@/types/user'
import type { UserDataService } from '.'

// Her kullanıcının tek bir belgesi var: users/{uid}. Erişim kuralı: firestore.rules
const userDoc = (uid: string) => doc(getFirebase().db, 'users', uid)

export const firestoreUserDataService: UserDataService = {
  async load(uid) {
    const snapshot = await getDoc(userDoc(uid))
    const data = snapshot.data() as Partial<UserData> | undefined
    return { taskStatuses: data?.taskStatuses ?? {}, customTasks: data?.customTasks ?? {} }
  },

  async setTaskStatus(uid, taskId, status) {
    // merge: true → yalnızca bu görevin durumu yazılır, diğer görevler korunur.
    await setDoc(
      userDoc(uid),
      { taskStatuses: { [taskId]: status }, updatedAt: serverTimestamp() },
      { merge: true },
    )
  },

  async saveCustomTask(uid, task) {
    // mergeFields: yalnızca customTasks.<id> alanı baştan yazılır (düzenlemede silinen
    // alanlar eski haliyle kalmaz); diğer görevler ve durumlar korunur.
    await setDoc(
      userDoc(uid),
      { customTasks: { [task.id]: task }, updatedAt: serverTimestamp() },
      { mergeFields: [new FieldPath('customTasks', task.id), 'updatedAt'] },
    )
  },

  async deleteCustomTask(uid, taskId) {
    // FieldPath: id'de nokta gibi özel karakter olsa da doğru alan silinir.
    await updateDoc(
      userDoc(uid),
      new FieldPath('customTasks', taskId),
      deleteField(),
      new FieldPath('taskStatuses', taskId),
      deleteField(),
      'updatedAt',
      serverTimestamp(),
    )
  },

  async remove(uid) {
    // Kendi görevleri de bu belgede olduğu için hepsi birlikte silinir.
    await deleteDoc(userDoc(uid))
  },
}
