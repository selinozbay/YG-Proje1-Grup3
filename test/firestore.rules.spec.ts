import { readFileSync } from 'node:fs'
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing'
import { describe, it, beforeAll, afterAll, beforeEach } from 'vitest'
import { doc, getDoc, setDoc } from 'firebase/firestore'

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
})
