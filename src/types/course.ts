/** Bir ders (Derslerim sayfasında kart olarak gösterilir). */
export interface Course {
  id: string
  code: string
  title: string
  instructor: string
  description: string
}

/** Bir dersin haftalık içeriği. */
export interface Week {
  id: string
  courseId: string
  weekNo: number
  title: string
  description: string
  learningGoals: string[]
}
