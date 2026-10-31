import { describe, it, expect } from 'vitest'
import { courseColor } from '../courseColors'
import coursesData from '@/data/courses.json'

describe('courseColor', () => {
  it('her derse farklı bir renk verir, aynı ders her zaman aynı rengi alır', () => {
    const bars = coursesData.map((course) => courseColor(course.id).bar)
    expect(new Set(bars).size).toBe(coursesData.length)
    expect(courseColor('veri-tabani')).toBe(courseColor('veri-tabani'))
  })

  it('görev durumlarının renklerini (yeşil, sarı) kullanmaz', () => {
    for (const course of coursesData) {
      expect(courseColor(course.id).bar).not.toMatch(/emerald|green|amber|yellow/)
    }
  })

  it('katalogda olmayan ders için ilk rengi verir', () => {
    expect(courseColor('olmayan-ders')).toBe(courseColor(coursesData[0]!.id))
  })
})
