import type { Course, Week } from '@/types/course'
import type { Task, TaskWithStatus } from '@/types/task'

export interface CurrentWeek {
  course: Course
  week: Week
  /** Haftanın son tarihi: o haftadaki ders görevlerinin en geç son tarihi ("2026-11-04"). */
  deadline: string
}

/**
 * Bugünün tarihine göre her dersin içinde bulunulan haftası (#48). Haftaların kendi
 * tarihi olmadığı için hafta, görevlerinin son tarihinden çıkarılır: son tarihi bugün
 * ya da daha sonra olan ilk hafta. Bütün haftaları geçmiş ders listede yer almaz.
 */
export function getCurrentWeeks(
  courses: Course[],
  weeks: Week[],
  tasks: Task[],
  today: string,
): CurrentWeek[] {
  const result: CurrentWeek[] = []
  for (const course of courses) {
    const courseWeeks = weeks
      .filter((week) => week.courseId === course.id)
      .sort((a, b) => a.weekNo - b.weekNo)
    for (const week of courseWeeks) {
      const deadline = tasks
        .filter((task) => task.courseId === course.id && task.weekNo === week.weekNo)
        .map((task) => task.dueDate ?? '')
        .reduce((latest, date) => (date > latest ? date : latest), '')
      if (deadline && deadline >= today) {
        result.push({ course, week, deadline })
        break
      }
    }
  }
  return result
}

/** Bitmemiş ve son tarihi bugün ya da sonra olan görevler, son tarihe göre sıralı (#13). */
export function getUpcomingTasks(tasks: TaskWithStatus[], today: string, limit = 5) {
  return tasks
    .filter((task) => task.status !== 'done' && !!task.dueDate && task.dueDate >= today)
    .sort((a, b) => a.dueDate!.localeCompare(b.dueDate!) || a.weekNo - b.weekNo)
    .slice(0, limit)
}

/** Bitmemiş ve son tarihi geçmiş görev sayısı. */
export function countOverdue(tasks: TaskWithStatus[], today: string) {
  return tasks.filter((task) => task.status !== 'done' && !!task.dueDate && task.dueDate < today)
    .length
}

/** Son tarihe kalan gün: "Bugün", "Yarın", "3 gün kaldı". */
export function daysLeftText(dueDate: string, today: string) {
  const days = Math.round((Date.parse(dueDate) - Date.parse(today)) / 86_400_000)
  if (days <= 0) return 'Bugün'
  if (days === 1) return 'Yarın'
  return `${days} gün kaldı`
}
