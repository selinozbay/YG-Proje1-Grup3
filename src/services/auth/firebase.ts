import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth'
import { getFirebase } from '@/firebase'
import type { AppUser } from '@/types/user'
import type { AuthService } from '.'

const toAppUser = (user: User): AppUser => ({
  uid: user.uid,
  email: user.email ?? '',
  displayName: user.displayName,
})

export const firebaseAuthService: AuthService = {
  onChange(callback) {
    return onAuthStateChanged(getFirebase().auth, (user) => callback(user ? toAppUser(user) : null))
  },

  async register(email, password, displayName) {
    const { user } = await createUserWithEmailAndPassword(getFirebase().auth, email, password)
    await updateProfile(user, { displayName })
    return toAppUser(user)
  },

  async login(email, password) {
    const { user } = await signInWithEmailAndPassword(getFirebase().auth, email, password)
    return toAppUser(user)
  },

  async logout() {
    await signOut(getFirebase().auth)
  },

  async resetPassword(email) {
    await sendPasswordResetEmail(getFirebase().auth, email)
  },

  async deleteAccount() {
    const user = getFirebase().auth.currentUser
    if (user) await deleteUser(user)
  },
}
