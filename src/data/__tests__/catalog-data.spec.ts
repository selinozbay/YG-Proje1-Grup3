import { describe, it, expect } from 'vitest'
import coursesData from '@/data/courses.json'
import weeksData from '@/data/weeks.json'
import tasksData from '@/data/tasks.json'
import type { Course, Week } from '@/types/course'
import type { Task } from '@/types/task'

// Ders kataloğunun (src/data/*.json) sayfaların güvendiği kurallara uyduğunu denetler.
const courses: Course[] = coursesData
const weeks: Week[] = weeksData
const tasks: Task[] = tasksData

const WEEKS_PER_COURSE = 4
const lower = (text: string) => text.toLocaleLowerCase('tr-TR')

describe('örnek ders verisi', () => {
  it("ders, hafta ve görev id'leri benzersiz", () => {
    for (const list of [courses, weeks, tasks]) {
      const ids = list.map((item) => item.id)
      expect(new Set(ids).size).toBe(ids.length)
    }
  })

  it("her dersin 1'den 4'e kadar sıralı haftaları var", () => {
    for (const course of courses) {
      const weekNos = weeks
        .filter((week) => week.courseId === course.id)
        .map((week) => week.weekNo)
        .sort((a, b) => a - b)
      expect(weekNos, course.id).toEqual(Array.from({ length: WEEKS_PER_COURSE }, (_, i) => i + 1))
    }
  })

  it('her hafta var olan bir derse bağlı ve en az bir öğrenme hedefi içeriyor', () => {
    const courseIds = new Set(courses.map((course) => course.id))
    for (const week of weeks) {
      expect(courseIds.has(week.courseId), week.id).toBe(true)
      expect(week.learningGoals.length, week.id).toBeGreaterThan(0)
    }
  })

  it('her görev var olan bir ders ve haftayı gösteriyor', () => {
    const weekKeys = new Set(weeks.map((week) => `${week.courseId}#${week.weekNo}`))
    for (const task of tasks) {
      expect(weekKeys.has(`${task.courseId}#${task.weekNo}`), task.id).toBe(true)
    }
  })

  it('her haftada en az bir görev var', () => {
    for (const week of weeks) {
      const count = tasks.filter(
        (task) => task.courseId === week.courseId && task.weekNo === week.weekNo,
      ).length
      expect(count, week.id).toBeGreaterThan(0)
    }
  })

  it('başlık ve açıklamalar boş değil', () => {
    for (const item of [...courses, ...weeks, ...tasks]) {
      expect(item.title.trim(), item.id).not.toBe('')
      expect(item.description.trim(), item.id).not.toBe('')
    }
  })

  it('son tarihler geçerli ve sonraki haftalar daha önceki bir tarihe düşmüyor', () => {
    for (const course of courses) {
      let previousWeekLatest = ''
      for (let weekNo = 1; weekNo <= WEEKS_PER_COURSE; weekNo++) {
        const dates = tasks
          .filter((task) => task.courseId === course.id && task.weekNo === weekNo && task.dueDate)
          .map((task) => task.dueDate!)
        for (const date of dates) {
          expect(date, course.id).toMatch(/^\d{4}-\d{2}-\d{2}$/)
          expect(Number.isNaN(Date.parse(date)), date).toBe(false)
          expect(date >= previousWeekLatest, `${course.id} hafta ${weekNo}: ${date}`).toBe(true)
        }
        previousWeekLatest = dates.reduce(
          (latest, date) => (date > latest ? date : latest),
          previousWeekLatest,
        )
      }
    }
  })

  it('etiketler küçük harfli, tekrarsız ve filtreleme için yeterince çeşitli', () => {
    for (const task of tasks) {
      expect(task.tags.length, task.id).toBeGreaterThan(0)
      expect(new Set(task.tags).size, task.id).toBe(task.tags.length)
      for (const tag of task.tags) expect(tag, task.id).toBe(lower(tag.trim()))
    }
    const distinctTags = new Set(tasks.flatMap((task) => task.tags))
    expect(distinctTags.size).toBeGreaterThanOrEqual(8)
  })

  it('raporun 3.3 senaryosundaki "SQL" araması başlık veya açıklamada sonuç buluyor', () => {
    const matches = tasks.filter((task) =>
      lower(`${task.title} ${task.description}`).includes('sql'),
    )
    expect(matches.length).toBeGreaterThanOrEqual(2)
  })
})
