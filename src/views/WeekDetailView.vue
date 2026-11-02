<script setup lang="ts">
import { computed, useId, watch } from 'vue'
import { RouterLink } from 'vue-router'
import BackLink from '@/components/common/BackLink.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import ProgressBar from '@/components/common/ProgressBar.vue'
import { courseColor } from '@/components/lessons/courseColors'
import TaskCard from '@/components/tasks/TaskCard.vue'
import { useTaskStatusChange } from '@/composables/useTaskStatusChange'
import { useCatalogStore } from '@/stores/catalog'
import { useProgressStore } from '@/stores/progress'

const props = defineProps<{ courseId: string; weekNo: number }>()

const catalog = useCatalogStore()
const progress = useProgressStore()

const course = computed(() => catalog.getCourse(props.courseId))
const week = computed(() => catalog.getWeek(props.courseId, props.weekNo))
const color = computed(() => courseColor(props.courseId))
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
    <BackLink :to="`/derslerim/${courseId}`">{{ course.title }}</BackLink>
    <PageHeader :title="`${week.weekNo}. Hafta · ${week.title}`" :description="week.description" />

    <div class="mb-10 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <section
        :aria-labelledby="progressTitleId"
        class="rounded-2xl bg-white p-5 ring-1 ring-slate-200 lg:col-start-2 lg:row-start-1 dark:bg-slate-900 dark:ring-slate-800"
      >
        <h2 :id="progressTitleId" class="text-lg font-bold font-stretch-condensed">
          Bu haftanın ilerlemesi
        </h2>
        <p class="mt-0.5 mb-3 text-sm text-slate-600 dark:text-slate-400" data-test="week-summary">
          {{ weekProgress.done }} / {{ weekProgress.total }} görev tamamlandı
        </p>
        <ProgressBar
          :value="weekProgress.percent"
          label="Bu haftanın ilerlemesi"
          :bar-class="color.bar"
          size="md"
        />
      </section>

      <section
        :aria-labelledby="goalsTitleId"
        class="rounded-2xl bg-white p-5 ring-1 ring-slate-200 lg:col-start-2 lg:row-start-2 dark:bg-slate-900 dark:ring-slate-800"
        data-test="learning-goals"
      >
        <h2 :id="goalsTitleId" class="mb-3 text-lg font-bold font-stretch-condensed">
          Öğrenme hedefleri
        </h2>
        <ul class="space-y-2.5 text-sm">
          <li v-for="goal in week.learningGoals" :key="goal" class="flex items-start gap-2.5">
            <svg
              viewBox="0 0 20 20"
              aria-hidden="true"
              class="mt-px size-[1.125rem] shrink-0 rounded-md bg-marker p-0.5 text-ink"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m5 10.5 3.2 3L15 6.5" />
            </svg>
            <span>{{ goal }}</span>
          </li>
        </ul>
      </section>

      <section :aria-labelledby="tasksTitleId" class="lg:col-start-1 lg:row-span-2 lg:row-start-1">
        <h2 :id="tasksTitleId" class="mb-3 text-xl font-bold font-stretch-condensed">Görevler</h2>
        <p
          v-if="saveError"
          role="alert"
          class="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800 ring-1 ring-red-200 dark:bg-red-500/10 dark:text-red-200 dark:ring-red-900"
        >
          {{ saveError }}
        </p>
        <ul
          v-if="tasks.length"
          class="divide-y divide-slate-200 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 dark:divide-slate-800 dark:bg-slate-900 dark:ring-slate-800"
          aria-label="Bu haftanın görevleri"
        >
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
          class="rounded-2xl border-2 border-dashed border-slate-300 p-6 text-center text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400"
        >
          Bu haftaya henüz görev eklenmemiş.
        </p>
      </section>
    </div>

    <nav aria-label="Haftalar arasında gezinme" class="grid gap-3 sm:grid-cols-2">
      <RouterLink
        v-if="previousWeek"
        :to="weekLink(previousWeek.weekNo)"
        rel="prev"
        class="group flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-slate-200 hover:ring-slate-400 dark:bg-slate-900 dark:ring-slate-800 dark:hover:ring-slate-600"
        data-test="previous-week"
      >
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          class="size-5 shrink-0 text-slate-400 transition-transform group-hover:-translate-x-0.5 motion-reduce:transition-none"
        >
          <path
            fill-rule="evenodd"
            d="M12.79 5.23a.75.75 0 0 1-.02 1.06L8.83 10l3.94 3.71a.75.75 0 1 1-1.04 1.08l-4.5-4.25a.75.75 0 0 1 0-1.08l4.5-4.25a.75.75 0 0 1 1.06.02z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="min-w-0">
          <span class="block text-xs text-slate-500 dark:text-slate-400">Önceki hafta</span>
          <span class="block font-semibold"
            >{{ previousWeek.weekNo }}. Hafta · {{ previousWeek.title }}</span
          >
        </span>
      </RouterLink>
      <span v-else aria-hidden="true" class="max-sm:hidden" />
      <RouterLink
        v-if="nextWeek"
        :to="weekLink(nextWeek.weekNo)"
        rel="next"
        class="group flex items-center justify-end gap-3 rounded-2xl bg-white p-4 text-right ring-1 ring-slate-200 hover:ring-slate-400 dark:bg-slate-900 dark:ring-slate-800 dark:hover:ring-slate-600"
        data-test="next-week"
      >
        <span class="min-w-0">
          <span class="block text-xs text-slate-500 dark:text-slate-400">Sonraki hafta</span>
          <span class="block font-semibold"
            >{{ nextWeek.weekNo }}. Hafta · {{ nextWeek.title }}</span
          >
        </span>
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          class="size-5 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
        >
          <path
            fill-rule="evenodd"
            d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.17 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02z"
            clip-rule="evenodd"
          />
        </svg>
      </RouterLink>
    </nav>
  </template>

  <template v-else>
    <PageHeader title="Hafta bulunamadı" />
    <RouterLink to="/derslerim" class="font-medium text-indigo-700 underline dark:text-indigo-300">
      Derslerime dön
    </RouterLink>
  </template>
</template>
