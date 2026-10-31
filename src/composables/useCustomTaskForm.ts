import type { CustomTaskInput } from '@/types/task'

export const TITLE_MAX_LENGTH = 100
export const DESCRIPTION_MAX_LENGTH = 500

export type CustomTaskErrors = Partial<Record<keyof CustomTaskInput, string>>

export const createEmptyCustomTaskInput = (): CustomTaskInput => ({
  title: '',
  description: '',
  courseId: '',
  dueDate: '',
})

/**
 * Kendi görevini ekleme formunu denetler (#23). Hata yoksa boş nesne döner.
 * `courseIds`: seçilebilecek derslerin id'leri ('' = derse bağlı değil her zaman geçerli).
 */
export function validateCustomTask(input: CustomTaskInput, courseIds: string[]): CustomTaskErrors {
  const errors: CustomTaskErrors = {}
  const title = input.title.trim()

  if (!title) errors.title = 'Görev başlığı boş olamaz.'
  else if (title.length > TITLE_MAX_LENGTH)
    errors.title = `Başlık en fazla ${TITLE_MAX_LENGTH} karakter olabilir.`

  if (input.description.trim().length > DESCRIPTION_MAX_LENGTH)
    errors.description = `Açıklama en fazla ${DESCRIPTION_MAX_LENGTH} karakter olabilir.`

  if (input.courseId && !courseIds.includes(input.courseId))
    errors.courseId = 'Geçerli bir ders seçin.'

  if (
    input.dueDate &&
    (!/^\d{4}-\d{2}-\d{2}$/.test(input.dueDate) || Number.isNaN(Date.parse(input.dueDate)))
  )
    errors.dueDate = 'Geçerli bir tarih seçin.'

  return errors
}
