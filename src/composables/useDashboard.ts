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

const DAY = 86_400_000

/** "2026-10-31" tarihine gün ekler (eksi değer geri gider). */
export const addDays = (isoDate: string, days: number) =>
  new Date(Date.parse(isoDate) + days * DAY).toISOString().slice(0, 10)

const daysBetween = (from: string, to: string) =>
  Math.round((Date.parse(to) - Date.parse(from)) / DAY)

export interface TermWeek {
  weekNo: number
  /** Haftanın ilk ve son günü ("2026-10-29", "2026-11-04"). */
  start: string
  end: string
  done: number
  total: number
  /** Son tarihi geçmiş, bitmemiş görev sayısı. */
  overdue: number
  state: 'past' | 'current' | 'upcoming'
}

/**
 * Dönem çizelgesi için haftalar (Ana Sayfa). Haftaların kendi tarihi olmadığı için bir
 * haftanın sonu, o haftadaki görevlerin en geç son tarihidir; başı bir önceki haftanın
 * ertesi günü (ilk hafta için son günden 6 gün önce). Kendi görevleri (hafta 0) sayılmaz.
 */
export function getTermWeeks(tasks: TaskWithStatus[], today: string): TermWeek[] {
  const weekNos = [...new Set(tasks.filter((t) => t.weekNo > 0).map((t) => t.weekNo))].sort(
    (a, b) => a - b,
  )
  const result: TermWeek[] = []
  for (const weekNo of weekNos) {
    const weekTasks = tasks.filter((task) => task.weekNo === weekNo)
    const end = weekTasks
      .map((task) => task.dueDate ?? '')
      .reduce((latest, date) => (date > latest ? date : latest), '')
    if (!end) continue
    const previous = result[result.length - 1]
    const start = previous ? addDays(previous.end, 1) : addDays(end, -6)
    result.push({
      weekNo,
      start,
      end,
      done: weekTasks.filter((task) => task.status === 'done').length,
      total: weekTasks.length,
      overdue: weekTasks.filter(
        (task) => task.status !== 'done' && !!task.dueDate && task.dueDate < today,
      ).length,
      state: today > end ? 'past' : today >= start ? 'current' : 'upcoming',
    })
  }
  return result
}

/** Dönemin geçen kısmı (0-100), bugün dahil. Dönem başlamadıysa 0, bittiyse 100. */
export function getElapsedPercent(weeks: TermWeek[], today: string) {
  const first = weeks[0]
  const last = weeks[weeks.length - 1]
  if (!first || !last) return 0
  const total = daysBetween(first.start, last.end) + 1
  const elapsed = daysBetween(first.start, today) + 1
  return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)))
}

/** Yaklaşan görevleri son tarihlerine göre günlere ayırır (sıra korunur). */
export function groupByDueDate(tasks: TaskWithStatus[]) {
  const groups: { date: string; tasks: TaskWithStatus[] }[] = []
  for (const task of tasks) {
    const date = task.dueDate ?? ''
    const group = groups.find((g) => g.date === date)
    if (group) group.tasks.push(task)
    else groups.push({ date, tasks: [task] })
  }
  return groups
}

/** Son tarihe kalan gün: "Bugün", "Yarın", "3 gün kaldı". */
export function daysLeftText(dueDate: string, today: string) {
  const days = Math.round((Date.parse(dueDate) - Date.parse(today)) / 86_400_000)
  if (days <= 0) return 'Bugün'
  if (days === 1) return 'Yarın'
  return `${days} gün kaldı`
}
