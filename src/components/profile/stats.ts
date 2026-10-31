import type { TaskWithStatus } from '@/types/task'

/**
 * Profildeki kişisel istatistikler (#29).
 * - Aktif ders: bitmemiş en az bir görevi olan ders.
 * - Tamamlanan ders: görevi olan ve bütün görevleri tamamlanmış ders.
 */
export function getProfileStats(courses: { id: string; title: string }[], tasks: TaskWithStatus[]) {
  const percent = (done: number, total: number) =>
    total === 0 ? 0 : Math.round((done / total) * 100)
  const count = (status: TaskWithStatus['status']) =>
    tasks.filter((task) => task.status === status).length

  const done = count('done')
  const courseRows = courses.map((course) => {
    const courseTasks = tasks.filter((task) => task.courseId === course.id)
    const courseDone = courseTasks.filter((task) => task.status === 'done').length
    return {
      id: course.id,
      title: course.title,
      done: courseDone,
      total: courseTasks.length,
      percent: percent(courseDone, courseTasks.length),
    }
  })

  return {
    tasks: {
      total: tasks.length,
      done,
      inProgress: count('in-progress'),
      todo: count('todo'),
      percent: percent(done, tasks.length),
    },
    activeCourses: courseRows.filter((c) => c.done < c.total).length,
    completedCourses: courseRows.filter((c) => c.total > 0 && c.done === c.total).length,
    courses: courseRows,
  }
}

export type ProfileStats = ReturnType<typeof getProfileStats>
