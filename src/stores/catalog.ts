import { defineStore } from 'pinia'
import coursesData from '@/data/courses.json'
import weeksData from '@/data/weeks.json'
import tasksData from '@/data/tasks.json'
import type { Course, Week } from '@/types/course'
import type { Task } from '@/types/task'

/**
 * Ders kataloğu: dersler, haftalar ve görevler. Herkes için aynıdır ve
 * src/data/*.json dosyalarından okunur. Yeni ders/hafta/görev eklemek için
 * bu JSON dosyalarını düzenleyin.
 */
export const useCatalogStore = defineStore('catalog', () => {
  const courses: Course[] = coursesData
  const weeks: Week[] = weeksData
  const tasks: Task[] = tasksData

  function getCourse(courseId: string) {
    return courses.find((course) => course.id === courseId)
  }

  function getWeeks(courseId: string) {
    return weeks.filter((week) => week.courseId === courseId).sort((a, b) => a.weekNo - b.weekNo)
  }

  function getWeek(courseId: string, weekNo: number) {
    return weeks.find((week) => week.courseId === courseId && week.weekNo === weekNo)
  }

  return { courses, weeks, tasks, getCourse, getWeeks, getWeek }
})
