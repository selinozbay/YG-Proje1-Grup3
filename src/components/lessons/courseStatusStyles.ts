import type { CourseStatus } from '@/composables/useCourseProgress'

/** Ders durumu rozetinin renkleri; görev durumu rozetleriyle aynı tonlar (aydınlık ve karanlık tema). */
export const COURSE_STATUS_CLASSES: Record<CourseStatus, string> = {
  'not-started': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  'in-progress': 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
  done: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300',
}
