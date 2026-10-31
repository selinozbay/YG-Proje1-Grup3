import { readFileSync } from 'node:fs'
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing'
import { describe, it, beforeAll, afterAll, beforeEach } from 'vitest'
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore'

let testEnv: RulesTestEnvironment

describe('Firestore Güvenlik Kuralları (firestore.rules)', () => {
  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'demo-test-project',
      firestore: {
        rules: readFileSync('firestore.rules', 'utf8'),
        host: '127.0.0.1',
        port: 8080,
      },
    })
  })

  afterAll(async () => {
    if (testEnv) {
      await testEnv.cleanup()
    }
  })

  beforeEach(async () => {
    if (testEnv) {
      await testEnv.clearFirestore()
    }
  })

  it('giriş yapmamış kullanıcı hiçbir kullanıcının belgesini okuyamaz ve yazamaz', async () => {
    const unauthedDb = testEnv.unauthenticatedContext().firestore()
    await assertFails(getDoc(doc(unauthedDb, 'users/user123')))
    await assertFails(
      setDoc(doc(unauthedDb, 'users/user123'), {
        taskStatuses: { 'yg-w1-t1': 'done' },
      }),
    )
  })

  it('giriş yapmış kullanıcı yalnızca kendi belgesini okuyup yazabilir', async () => {
    const aliceDb = testEnv.authenticatedContext('alice').firestore()
    await assertSucceeds(
      setDoc(doc(aliceDb, 'users/alice'), {
        taskStatuses: { 'yg-w1-t1': 'done' },
      }),
    )
    await assertSucceeds(getDoc(doc(aliceDb, 'users/alice')))
  })

  it('giriş yapmış kullanıcı başka bir kullanıcının belgesine erişemez', async () => {
    const aliceDb = testEnv.authenticatedContext('alice').firestore()
    await assertFails(getDoc(doc(aliceDb, 'users/bob')))
    await assertFails(
      setDoc(doc(aliceDb, 'users/bob'), {
        taskStatuses: { 'yg-w1-t1': 'done' },
      }),
    )
  })

  it('tanımlı olmayan koleksiyonlara doğrudan yazma ve okuma kapalıdır', async () => {
    const aliceDb = testEnv.authenticatedContext('alice').firestore()
    await assertFails(getDoc(doc(aliceDb, 'courses/yazilim-gelistirme')))
  })

  // #23: kullanıcının kendi eklediği görevler aynı belgede, customTasks alanında durur.
  const customTasks = (count: number) =>
    Object.fromEntries(
      Array.from({ length: count }, (_, i) => [
        `custom-${i}`,
        {
          id: `custom-${i}`,
          title: `Görev ${i}`,
          description: '',
          courseId: '',
          dueDate: '',
          createdAt: '2026-10-30T10:00:00.000Z',
        },
      ]),
    )

  it('kullanıcı kendi eklediği görevleri kendi belgesine yazabilir (#23)', async () => {
    const aliceDb = testEnv.authenticatedContext('alice').firestore()
    await assertSucceeds(
      setDoc(doc(aliceDb, 'users/alice'), {
        taskStatuses: { 'custom-0': 'done' },
        customTasks: customTasks(1),
      }),
    )
  })

  it('başka bir kullanıcının belgesine kendi görevi yazılamaz (#23)', async () => {
    const aliceDb = testEnv.authenticatedContext('alice').firestore()
    await assertFails(setDoc(doc(aliceDb, 'users/bob'), { customTasks: customTasks(1) }))
  })

  it('en fazla 100 kendi görevi kaydedilebilir (#23)', async () => {
    const aliceDb = testEnv.authenticatedContext('alice').firestore()
    await assertSucceeds(setDoc(doc(aliceDb, 'users/alice'), { customTasks: customTasks(100) }))
    await assertFails(setDoc(doc(aliceDb, 'users/alice'), { customTasks: customTasks(101) }))
  })

  it('belgeye uygulamanın tanımlamadığı bir alan yazılamaz', async () => {
    const aliceDb = testEnv.authenticatedContext('alice').firestore()
    await assertFails(setDoc(doc(aliceDb, 'users/alice'), { taskStatuses: {}, rol: 'yonetici' }))
    await assertFails(setDoc(doc(aliceDb, 'users/alice'), { customTasks: 'liste değil' }))
  })

  it('kullanıcı kendi belgesini silebilir, başkasınınkini silemez (KVKK)', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), 'users/alice'), { taskStatuses: {} })
      await setDoc(doc(context.firestore(), 'users/bob'), { taskStatuses: {} })
    })
    const aliceDb = testEnv.authenticatedContext('alice').firestore()
    await assertSucceeds(deleteDoc(doc(aliceDb, 'users/alice')))
    await assertFails(deleteDoc(doc(aliceDb, 'users/bob')))
  })
})
