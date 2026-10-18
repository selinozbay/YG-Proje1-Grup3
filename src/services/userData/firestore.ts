import { deleteDoc, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { getFirebase } from '@/firebase'
import type { UserData } from '@/types/user'
import type { UserDataService } from '.'

// Her kullanıcının tek bir belgesi var: users/{uid}. Erişim kuralı: firestore.rules
const userDoc = (uid: string) => doc(getFirebase().db, 'users', uid)

export const firestoreUserDataService: UserDataService = {
  async load(uid) {
    const snapshot = await getDoc(userDoc(uid))
    const data = snapshot.data() as Partial<UserData> | undefined
    return { taskStatuses: data?.taskStatuses ?? {} }
  },

  async setTaskStatus(uid, taskId, status) {
    // merge: true → yalnızca bu görevin durumu yazılır, diğer görevler korunur.
    await setDoc(
      userDoc(uid),
      { taskStatuses: { [taskId]: status }, updatedAt: serverTimestamp() },
      { merge: true },
    )
  },

  async remove(uid) {
    await deleteDoc(userDoc(uid))
  },
}
