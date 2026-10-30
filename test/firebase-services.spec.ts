// Uygulamanın Firebase'li servislerini, gerçek projeye dokunmadan, bilgisayardaki Auth ve
// Firestore emülatörlerine karşı dener. Firestore kuralları (firestore.rules) da devrededir.
// Çalıştırma: npm run test:firebase (emülatörleri açar, testleri koşar, kapatır)
import { deleteApp, getApps } from 'firebase/app'
import { afterAll, beforeEach, describe, expect, it } from 'vitest'
import { getFirebase } from '@/firebase'
import { getAuthErrorMessage } from '@/services/auth/errors'
import { firebaseAuthService as auth } from '@/services/auth/firebase'
import { firestoreUserDataService as userData } from '@/services/userData/firestore'
import type { CustomTask } from '@/types/task'
import type { AppUser } from '@/types/user'

const PROJECT_ID = 'demo-yg-proje1'
const AUTH_EMULATOR = `http://127.0.0.1:9099/emulator/v1/projects/${PROJECT_ID}`
const PASSWORD = 'parola123'

let counter = 0
const newEmail = () => `ogrenci${Date.now()}${counter++}@example.com`

/** Bir işlemin hatasını yakalayıp kullanıcıya gösterilecek Türkçe mesajı döndürür. */
async function messageOf(action: Promise<unknown>) {
  try {
    await action
  } catch (error) {
    return getAuthErrorMessage(error)
  }
  throw new Error('İşlem hata vermesi gerekirken başarılı oldu.')
}

beforeEach(async () => {
  await auth.logout()
  await fetch(`${AUTH_EMULATOR}/accounts`, { method: 'DELETE' })
})

afterAll(async () => {
  await Promise.all(getApps().map((app) => deleteApp(app)))
})

describe('Giriş ve kayıt (Firebase Authentication) — #4', () => {
  it('kayıt olan kullanıcı adıyla birlikte oluşturulur', async () => {
    const email = newEmail()
    const user = await auth.register(email, PASSWORD, 'Deneme Öğrenci')

    expect(user.uid).toBeTruthy()
    expect(user.email).toBe(email)
    expect(user.displayName).toBe('Deneme Öğrenci')
  })

  it('aynı e-postayla ikinci kez kayıt olunamaz, Türkçe uyarı gösterilir', async () => {
    const email = newEmail()
    await auth.register(email, PASSWORD, 'Deneme Öğrenci')
    await auth.logout()

    expect(await messageOf(auth.register(email, PASSWORD, 'Başka Biri'))).toBe(
      'Bu e-posta adresiyle zaten bir hesap var.',
    )
  })

  it('6 karakterden kısa şifreyle kayıt olunamaz', async () => {
    expect(await messageOf(auth.register(newEmail(), '123', 'Deneme'))).toBe(
      'Şifre en az 6 karakter olmalı.',
    )
  })

  it('doğru şifreyle giriş yapılır, yanlış şifrede Türkçe uyarı gösterilir', async () => {
    const email = newEmail()
    const registered = await auth.register(email, PASSWORD, 'Deneme Öğrenci')
    await auth.logout()

    const loggedIn = await auth.login(email, PASSWORD)
    expect(loggedIn.uid).toBe(registered.uid)
    await auth.logout()

    expect(await messageOf(auth.login(email, 'yanlis-sifre'))).toBe('E-posta veya şifre hatalı.')
  })

  it('kayıtlı olmayan e-postayla giriş yapılamaz, hangi bilginin yanlış olduğu söylenmez', async () => {
    expect(await messageOf(auth.login(newEmail(), PASSWORD))).toBe('E-posta veya şifre hatalı.')
  })

  it('giriş ve çıkışta oturum değişikliği uygulamaya bildirilir', async () => {
    const seen: (AppUser | null)[] = []
    const stop = auth.onChange((user) => seen.push(user))

    const email = newEmail()
    await auth.register(email, PASSWORD, 'Deneme Öğrenci')
    await expect.poll(() => seen.at(-1)?.email).toBe(email)

    await auth.logout()
    await expect.poll(() => seen.at(-1)).toBeNull()
    stop()
  })
})

describe('Şifremi unuttum — #5', () => {
  it('kayıtlı kullanıcıya şifre sıfırlama e-postası gönderilir', async () => {
    const email = newEmail()
    await auth.register(email, PASSWORD, 'Deneme Öğrenci')
    await auth.logout()

    await auth.resetPassword(email)

    const { oobCodes } = (await (await fetch(`${AUTH_EMULATOR}/oobCodes`)).json()) as {
      oobCodes: { email: string; requestType: string }[]
    }
    expect(oobCodes).toContainEqual(
      expect.objectContaining({ email, requestType: 'PASSWORD_RESET' }),
    )
  })

  it('e-postalar Türkçe gönderilir', () => {
    expect(getFirebase().auth.languageCode).toBe('tr')
  })

  it('kayıtlı olmayan e-posta için hata verilmez (hesabın varlığı belli edilmez)', async () => {
    await expect(auth.resetPassword(newEmail())).resolves.toBeUndefined()
  })
})

describe('Görev durumlarının saklanması (Cloud Firestore)', () => {
  it('kullanıcı görev durumlarını kaydeder; her kayıt diğer görevleri korur', async () => {
    const { uid } = await auth.register(newEmail(), PASSWORD, 'Deneme Öğrenci')

    await userData.setTaskStatus(uid, 'yg-w1-t1', 'done')
    await userData.setTaskStatus(uid, 'wp-w1-t1', 'in-progress')

    expect((await userData.load(uid)).taskStatuses).toEqual({
      'yg-w1-t1': 'done',
      'wp-w1-t1': 'in-progress',
    })
  })

  it('kullanıcı başka bir kullanıcının verisini okuyamaz', async () => {
    const other = await auth.register(newEmail(), PASSWORD, 'Birinci')
    await userData.setTaskStatus(other.uid, 'yg-w1-t1', 'done')
    await auth.logout()
    await auth.register(newEmail(), PASSWORD, 'İkinci')

    await expect(userData.load(other.uid)).rejects.toThrow()
  })

  it('hesap silinince görev durumları ve hesap silinir (KVKK)', async () => {
    const email = newEmail()
    const { uid } = await auth.register(email, PASSWORD, 'Deneme Öğrenci')
    await userData.setTaskStatus(uid, 'yg-w1-t1', 'done')

    // stores/auth.ts deleteAccount() ile aynı sıra: önce veri, sonra hesap
    await userData.remove(uid)
    expect((await userData.load(uid)).taskStatuses).toEqual({})
    await auth.deleteAccount()

    expect(await messageOf(auth.login(email, PASSWORD))).toBe('E-posta veya şifre hatalı.')
  })
})

describe('Kendi eklenen görevlerin saklanması (Cloud Firestore) — #23', () => {
  const customTask = (id: string, title: string): CustomTask => ({
    id,
    title,
    description: '',
    courseId: '',
    dueDate: '',
    createdAt: '2026-10-30T10:00:00.000Z',
  })

  it('kendi görevi eklenir, güncellenir ve silinir; silinen görevin durumu da silinir', async () => {
    const { uid } = await auth.register(newEmail(), PASSWORD, 'Deneme Öğrenci')

    await userData.saveCustomTask(uid, customTask('custom-1', 'Sunum'))
    await userData.saveCustomTask(uid, {
      ...customTask('custom-2', 'Rapor'),
      dueDate: '2026-11-10',
    })
    await userData.setTaskStatus(uid, 'custom-1', 'done')
    await userData.setTaskStatus(uid, 'yg-w1-t1', 'in-progress')

    // Düzenlemede kaldırılan son tarih eski haliyle kalmamalı (alan baştan yazılır).
    await userData.saveCustomTask(uid, customTask('custom-2', 'Rapor taslağı'))
    let data = await userData.load(uid)
    expect(Object.keys(data.customTasks).sort()).toEqual(['custom-1', 'custom-2'])
    expect(data.customTasks['custom-2']).toEqual(customTask('custom-2', 'Rapor taslağı'))

    await userData.deleteCustomTask(uid, 'custom-1')
    data = await userData.load(uid)
    expect(Object.keys(data.customTasks)).toEqual(['custom-2'])
    expect(data.taskStatuses).toEqual({ 'yg-w1-t1': 'in-progress' })
  })

  it('hesap verisi silinince kendi görevleri de silinir (KVKK)', async () => {
    const { uid } = await auth.register(newEmail(), PASSWORD, 'Deneme Öğrenci')
    await userData.saveCustomTask(uid, customTask('custom-1', 'Sunum'))

    await userData.remove(uid)

    expect((await userData.load(uid)).customTasks).toEqual({})
  })
})
