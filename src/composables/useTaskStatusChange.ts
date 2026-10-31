import { ref } from 'vue'
import { useProgressStore } from '@/stores/progress'
import type { TaskStatus } from '@/types/task'

/**
 * Bir görevin durumunu değiştirir; kayıt başarısız olursa store eski durumu geri
 * yükler, burada da kullanıcıya gösterilecek hata mesajı hazırlanır.
 * Görevlerim ve Hafta detayı sayfaları ortak kullanır.
 */
export function useTaskStatusChange() {
  const progress = useProgressStore()
  const saveError = ref('')

  async function changeStatus(taskId: string, status: TaskStatus) {
    saveError.value = ''
    try {
      await progress.setStatus(taskId, status)
    } catch {
      saveError.value = 'Görevin durumu kaydedilemedi. Bağlantını kontrol edip tekrar dene.'
    }
  }

  return { saveError, changeStatus }
}
