import { describe, it, expect } from 'vitest'
import { courseColor } from '../courseColors'
import coursesData from '@/data/courses.json'

describe('courseColor', () => {
  it('her derse farklı bir renk verir, aynı ders her zaman aynı rengi alır', () => {
    const bars = coursesData.map((course) => courseColor(course.id).bar)
    expect(new Set(bars).size).toBe(coursesData.length)
    expect(courseColor('veri-tabani')).toBe(courseColor('veri-tabani'))
  })

  it('vurgu ve görev durumu renklerini (turuncu, yeşil, kırmızı) kullanmaz', () => {
    for (const course of coursesData) {
      // indigo, uygulamada turuncu vurgu rengine eşlenmiştir (assets/main.css).
      expect(courseColor(course.id).bar).not.toMatch(/orange|indigo|amber|emerald|green|red/)
    }
  })

  it('katalogda olmayan ders için ilk rengi verir', () => {
    expect(courseColor('olmayan-ders')).toBe(courseColor(coursesData[0]!.id))
  })
})
