import { isFirebaseEnabled } from '@/firebase'
import type { AppUser } from '@/types/user'
import { firebaseAuthService } from './firebase'
import { localAuthService } from './local'

/**
 * Giriş işlemlerinin ortak arayüzü. Bileşenler bu servisi doğrudan değil,
 * stores/auth.ts üzerinden kullanır.
 */
export interface AuthService {
  /** Oturum açılınca/kapanınca çağrılır. Dinlemeyi bitiren fonksiyonu döndürür. */
  onChange(callback: (user: AppUser | null) => void): () => void
  register(email: string, password: string, displayName: string): Promise<AppUser>
  login(email: string, password: string): Promise<AppUser>
  logout(): Promise<void>
  resetPassword(email: string): Promise<void>
  deleteAccount(): Promise<void>
}

export const authService: AuthService = isFirebaseEnabled ? firebaseAuthService : localAuthService

export { getAuthErrorMessage } from './errors'
