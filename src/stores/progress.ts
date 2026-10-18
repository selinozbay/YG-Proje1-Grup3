import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { userDataService } from '@/services/userData'
import type { TaskStatus, TaskWithStatus } from '@/types/task'
import { useCatalogStore } from './catalog'

/**
 * Giriş yapan kullanıcının görev durumları ve ilerlemesi.
 * Ana Sayfa, Derslerim ve Görevlerim aynı veriyi buradan okur; bir sayfada
 * görev tamamlanınca diğer sayfalardaki ilerleme de kendiliğinden güncellenir.
 */
export const useProgressStore = defineStore('progress', () => {
  const catalog = useCatalogStore()

  const taskStatuses = ref<Record<string, TaskStatus>>({})
  const loading = ref(false)
  let currentUid: string | null = null

  /** Katalogdaki tüm görevler, kullanıcının durumlarıyla birlikte. */
  const tasks = computed<TaskWithStatus[]>(() =>
    catalog.tasks.map((task) => ({ ...task, status: statusOf(task.id) })),
  )

  /** Tüm görevler için genel ilerleme. */
  const overall = computed(() => summarize(tasks.value))

  function statusOf(taskId: string): TaskStatus {
    return taskStatuses.value[taskId] ?? 'todo'
  }

  /** Verilen görev listesi için tamamlanan/toplam ve yüzde (0-100). */
  function summarize(list: TaskWithStatus[]) {
    const total = list.length
    const done = list.filter((task) => task.status === 'done').length
    return { done, total, percent: total === 0 ? 0 : Math.round((done / total) * 100) }
  }

  async function load(uid: string) {
    currentUid = uid
    loading.value = true
    try {
      const data = await userDataService.load(uid)
      if (currentUid === uid) taskStatuses.value = data.taskStatuses
    } finally {
      loading.value = false
    }
  }

  function reset() {
    currentUid = null
    taskStatuses.value = {}
  }

  async function setStatus(taskId: string, status: TaskStatus) {
    if (!currentUid) return
    const previous = statusOf(taskId)
    // Arayüz beklemeden güncellenir; kayıt başarısız olursa eski duruma dönülür.
    taskStatuses.value = { ...taskStatuses.value, [taskId]: status }
    try {
      await userDataService.setTaskStatus(currentUid, taskId, status)
    } catch (error) {
      taskStatuses.value = { ...taskStatuses.value, [taskId]: previous }
      throw error
    }
  }

  return { taskStatuses, loading, tasks, overall, statusOf, summarize, load, reset, setStatus }
})
