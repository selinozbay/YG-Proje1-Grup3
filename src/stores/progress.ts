import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { userDataService } from '@/services/userData'
import type { CustomTask, CustomTaskInput, Task, TaskStatus, TaskWithStatus } from '@/types/task'
import { useCatalogStore } from './catalog'

/** Kendi görevini, ders görevleriyle aynı listede gösterilebilecek göreve çevirir. */
function toTask(task: CustomTask): Task {
  return {
    id: task.id,
    courseId: task.courseId,
    weekNo: 0,
    title: task.title,
    description: task.description,
    ...(task.dueDate ? { dueDate: task.dueDate } : {}),
    tags: [],
    custom: true,
  }
}

function createCustomTaskId() {
  const random =
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
  return `custom-${random}`
}

/**
 * Giriş yapan kullanıcının görev durumları, kendi eklediği görevler ve ilerlemesi.
 * Ana Sayfa, Derslerim ve Görevlerim aynı veriyi buradan okur; bir sayfada
 * görev tamamlanınca diğer sayfalardaki ilerleme de kendiliğinden güncellenir.
 */
export const useProgressStore = defineStore('progress', () => {
  const catalog = useCatalogStore()

  const taskStatuses = ref<Record<string, TaskStatus>>({})
  const customTasks = ref<Record<string, CustomTask>>({})
  const loading = ref(false)
  let currentUid: string | null = null

  /** Kullanıcının kendi görevleri, eklenme sırasına göre. */
  const customTaskList = computed(() =>
    Object.values(customTasks.value)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      .map(toTask),
  )

  /** Katalogdaki tüm görevler ve kullanıcının kendi görevleri, durumlarıyla birlikte. */
  const tasks = computed<TaskWithStatus[]>(() =>
    [...catalog.tasks, ...customTaskList.value].map((task) => ({
      ...task,
      status: statusOf(task.id),
    })),
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
      if (currentUid === uid) {
        taskStatuses.value = data.taskStatuses
        customTasks.value = data.customTasks
      }
    } finally {
      loading.value = false
    }
  }

  function reset() {
    currentUid = null
    taskStatuses.value = {}
    customTasks.value = {}
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

  /**
   * Kendi görevini ekler; `id` verilirse o görevi günceller. Görevin id'sini döner.
   * Kayıt başarısız olursa liste eski haline döner ve hata iletilir.
   */
  async function saveCustomTask(input: CustomTaskInput, id?: string): Promise<string> {
    if (!currentUid) throw new Error('Görev eklemek için giriş yapılmalı.')
    const existing = id ? customTasks.value[id] : undefined
    const task: CustomTask = {
      id: existing?.id ?? createCustomTaskId(),
      title: input.title.trim(),
      description: input.description.trim(),
      courseId: input.courseId,
      dueDate: input.dueDate,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    }

    const previous = customTasks.value
    customTasks.value = { ...previous, [task.id]: task }
    try {
      await userDataService.saveCustomTask(currentUid, task)
    } catch (error) {
      customTasks.value = previous
      throw error
    }
    return task.id
  }

  /** Kendi görevini ve durumunu siler; kayıt başarısız olursa görev geri gelir. */
  async function deleteCustomTask(taskId: string) {
    if (!currentUid || !customTasks.value[taskId]) return
    const previousTasks = customTasks.value
    const previousStatuses = taskStatuses.value

    const nextTasks = { ...previousTasks }
    delete nextTasks[taskId]
    const nextStatuses = { ...previousStatuses }
    delete nextStatuses[taskId]
    customTasks.value = nextTasks
    taskStatuses.value = nextStatuses

    try {
      await userDataService.deleteCustomTask(currentUid, taskId)
    } catch (error) {
      customTasks.value = previousTasks
      taskStatuses.value = previousStatuses
      throw error
    }
  }

  return {
    taskStatuses,
    customTasks,
    loading,
    tasks,
    overall,
    statusOf,
    summarize,
    load,
    reset,
    setStatus,
    saveCustomTask,
    deleteCustomTask,
  }
})
