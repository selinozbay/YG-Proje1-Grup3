import { describe, it, expect } from 'vitest'
import {
  createEmptyCustomTaskInput,
  DESCRIPTION_MAX_LENGTH,
  TITLE_MAX_LENGTH,
  validateCustomTask,
} from '../useCustomTaskForm'

const COURSES = ['yazilim-gelistirme', 'veri-tabani']
const input = (overrides = {}) => ({
  ...createEmptyCustomTaskInput(),
  title: 'Sunuma hazırlan',
  ...overrides,
})

describe('validateCustomTask (#23)', () => {
  it('yalnızca başlığı olan görev geçerlidir', () => {
    expect(validateCustomTask(input(), COURSES)).toEqual({})
  })

  it('boş ya da yalnızca boşluktan oluşan başlığı reddeder', () => {
    expect(validateCustomTask(input({ title: '' }), COURSES).title).toBe(
      'Görev başlığı boş olamaz.',
    )
    expect(validateCustomTask(input({ title: '   ' }), COURSES).title).toBe(
      'Görev başlığı boş olamaz.',
    )
  })

  it('çok uzun başlık ve açıklamayı reddeder', () => {
    const errors = validateCustomTask(
      input({
        title: 'a'.repeat(TITLE_MAX_LENGTH + 1),
        description: 'b'.repeat(DESCRIPTION_MAX_LENGTH + 1),
      }),
      COURSES,
    )
    expect(errors.title).toBe(`Başlık en fazla ${TITLE_MAX_LENGTH} karakter olabilir.`)
    expect(errors.description).toBe(
      `Açıklama en fazla ${DESCRIPTION_MAX_LENGTH} karakter olabilir.`,
    )
    expect(validateCustomTask(input({ title: 'a'.repeat(TITLE_MAX_LENGTH) }), COURSES)).toEqual({})
  })

  it('listede olmayan dersi reddeder, derse bağlı olmamayı kabul eder', () => {
    expect(validateCustomTask(input({ courseId: 'olmayan' }), COURSES).courseId).toBe(
      'Geçerli bir ders seçin.',
    )
    expect(validateCustomTask(input({ courseId: 'veri-tabani' }), COURSES)).toEqual({})
    expect(validateCustomTask(input({ courseId: '' }), COURSES)).toEqual({})
  })

  it('geçersiz son tarihi reddeder', () => {
    expect(validateCustomTask(input({ dueDate: '2026-11-11' }), COURSES)).toEqual({})
    expect(validateCustomTask(input({ dueDate: '11.11.2026' }), COURSES).dueDate).toBe(
      'Geçerli bir tarih seçin.',
    )
    expect(validateCustomTask(input({ dueDate: '2026-13-45' }), COURSES).dueDate).toBe(
      'Geçerli bir tarih seçin.',
    )
  })
})
