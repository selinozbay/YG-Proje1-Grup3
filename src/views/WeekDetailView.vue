<script setup lang="ts">
import { computed, useId, watch } from 'vue'
import { RouterLink } from 'vue-router'
import AppIcon from '@/components/common/AppIcon.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import ProgressBar from '@/components/common/ProgressBar.vue'
import TaskCard from '@/components/tasks/TaskCard.vue'
import { useTaskStatusChange } from '@/composables/useTaskStatusChange'
import { useCatalogStore } from '@/stores/catalog'
import { useProgressStore } from '@/stores/progress'

const props = defineProps<{ courseId: string; weekNo: number }>()

const catalog = useCatalogStore()
const progress = useProgressStore()

const course = computed(() => catalog.getCourse(props.courseId))
const week = computed(() => catalog.getWeek(props.courseId, props.weekNo))
const tasks = computed(() =>
  progress.tasks.filter((task) => task.courseId === props.courseId && task.weekNo === props.weekNo),
)
const weekProgress = computed(() => progress.summarize(tasks.value))

// Önceki / sonraki hafta: dersin haftaları sıralı, aradaki boşluklar atlanır.
const courseWeeks = computed(() => catalog.getWeeks(props.courseId))
const weekIndex = computed(() => courseWeeks.value.findIndex((w) => w.weekNo === props.weekNo))
const previousWeek = computed(() =>
  weekIndex.value > 0 ? courseWeeks.value[weekIndex.value - 1] : undefined,
)
const nextWeek = computed(() =>
  weekIndex.value >= 0 ? courseWeeks.value[weekIndex.value + 1] : undefined,
)
const weekLink = (weekNo: number) => `/derslerim/${props.courseId}/hafta/${weekNo}`

const { saveError, changeStatus } = useTaskStatusChange()
// Başka bir haftaya geçince eski hata mesajı kalmasın.
watch(
  () => [props.courseId, props.weekNo],
  () => (saveError.value = ''),
)

const progressTitleId = useId()
const goalsTitleId = useId()
const tasksTitleId = useId()
</script>

<template>
  <template v-if="week && course">
    <RouterLink
      :to="`/derslerim/${courseId}`"
      class="mb-2 inline-block text-sm text-indigo-600 underline hover:no-underline dark:text-indigo-400"
    >
      ← {{ course.title }}
    </RouterLink>
    <PageHeader :title="`${week.weekNo}. Hafta · ${week.title}`" :description="week.description" />

    <section
      :aria-labelledby="progressTitleId"
      class="mb-6 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
    >
      <div class="mb-2 flex flex-wrap items-baseline justify-between gap-x-3">
        <h2 :id="progressTitleId" class="font-semibold">Bu haftanın ilerlemesi</h2>
        <p class="text-sm text-slate-600 dark:text-slate-400" data-test="week-summary">
          {{ weekProgress.done }} / {{ weekProgress.total }} görev tamamlandı
        </p>
      </div>
      <ProgressBar :value="weekProgress.percent" label="Bu haftanın ilerlemesi" />
    </section>

    <section
      :aria-labelledby="goalsTitleId"
      class="mb-8 rounded-xl border border-indigo-200 bg-indigo-50/60 p-5 dark:border-indigo-500/30 dark:bg-indigo-500/10"
      data-test="learning-goals"
    >
      <h2 :id="goalsTitleId" class="mb-3 font-semibold">Öğrenme hedefleri</h2>
      <ul class="space-y-2">
        <li v-for="goal in week.learningGoals" :key="goal" class="flex items-start gap-2">
          <AppIcon
            name="tasks"
            class="mt-0.5 size-4 shrink-0 text-indigo-600 dark:text-indigo-400"
          />
          <span>{{ goal }}</span>
        </li>
      </ul>
    </section>

    <section :aria-labelledby="tasksTitleId" class="mb-8">
      <h2 :id="tasksTitleId" class="mb-3 font-semibold">Görevler</h2>
      <p
        v-if="saveError"
        role="alert"
        class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
      >
        {{ saveError }}
      </p>
      <ul v-if="tasks.length" class="grid gap-4 sm:grid-cols-2" aria-label="Bu haftanın görevleri">
        <li v-for="task in tasks" :key="task.id">
          <TaskCard
            :task="task"
            :course-title="course.title"
            :heading-level="3"
            editable
            @status-change="changeStatus(task.id, $event)"
          />
        </li>
      </ul>
      <p
        v-else
        class="rounded-xl border-2 border-dashed border-slate-300 p-6 text-center text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400"
      >
        Bu haftaya henüz görev eklenmemiş.
      </p>
    </section>

    <nav
      aria-label="Haftalar arasında gezinme"
      class="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-between dark:border-slate-800"
    >
      <RouterLink
        v-if="previousWeek"
        :to="weekLink(previousWeek.weekNo)"
        rel="prev"
        class="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
        data-test="previous-week"
      >
        <span class="block text-xs text-slate-500 dark:text-slate-400">← Önceki hafta</span>
        <span class="font-medium">{{ previousWeek.weekNo }}. Hafta · {{ previousWeek.title }}</span>
      </RouterLink>
      <span v-else aria-hidden="true" />
      <RouterLink
        v-if="nextWeek"
        :to="weekLink(nextWeek.weekNo)"
        rel="next"
        class="rounded-lg p-2 hover:bg-slate-100 sm:text-right dark:hover:bg-slate-800"
        data-test="next-week"
      >
        <span class="block text-xs text-slate-500 dark:text-slate-400">Sonraki hafta →</span>
        <span class="font-medium">{{ nextWeek.weekNo }}. Hafta · {{ nextWeek.title }}</span>
      </RouterLink>
    </nav>
  </template>

  <template v-else>
    <PageHeader title="Hafta bulunamadı" />
    <RouterLink to="/derslerim" class="text-indigo-600 underline dark:text-indigo-400">
      Derslerime dön
    </RouterLink>
  </template>
</template>
