<script setup lang="ts">
import { computed, useId } from 'vue'
import { RouterLink } from 'vue-router'
import BackLink from '@/components/common/BackLink.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import ProgressBar from '@/components/common/ProgressBar.vue'
import WeekCard from '@/components/lessons/WeekCard.vue'
import WeekTimeline from '@/components/lessons/WeekTimeline.vue'
import { getWeekStates } from '@/components/lessons/weekState'
import { useCatalogStore } from '@/stores/catalog'
import { useProgressStore } from '@/stores/progress'

const props = defineProps<{ courseId: string }>()

const catalog = useCatalogStore()
const progress = useProgressStore()

const course = computed(() => catalog.getCourse(props.courseId))

// Her hafta: bağlantısı, ilerlemesi ve akıştaki yeri (tamamlandı / şu anki / sırada).
const weeks = computed(() => {
  const list = catalog.getWeeks(props.courseId).map((week) => ({
    week,
    to: `/derslerim/${props.courseId}/hafta/${week.weekNo}`,
    progress: progress.summarize(
      progress.tasks.filter((t) => t.courseId === props.courseId && t.weekNo === week.weekNo),
    ),
  }))
  const states = getWeekStates(list.map((item) => item.progress))
  return list.map((item, i) => ({ ...item, state: states[i]! }))
})

// Dersin genel ilerlemesi; kendi eklenen görevler de dahil.
const courseProgress = computed(() =>
  progress.summarize(progress.tasks.filter((t) => t.courseId === props.courseId)),
)

const timelineTitleId = useId()
const weeksTitleId = useId()
</script>

<template>
  <template v-if="course">
    <BackLink to="/derslerim">Derslerim</BackLink>
    <PageHeader :title="course.title" :description="course.description" />

    <div
      class="mb-6 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:gap-6 dark:border-slate-800 dark:bg-slate-900"
    >
      <dl class="flex flex-wrap gap-x-6 gap-y-1 text-sm">
        <div>
          <dt class="inline text-slate-500 dark:text-slate-400">Kod:</dt>
          <dd class="ms-1 inline font-medium">{{ course.code }}</dd>
        </div>
        <div>
          <dt class="inline text-slate-500 dark:text-slate-400">Öğretim elemanı:</dt>
          <dd class="ms-1 inline font-medium">{{ course.instructor }}</dd>
        </div>
      </dl>
      <div class="flex-1 sm:min-w-48">
        <p class="mb-1 text-xs text-slate-600 dark:text-slate-400" data-test="course-summary">
          Dersin ilerlemesi: {{ courseProgress.done }} / {{ courseProgress.total }} görev
        </p>
        <ProgressBar :value="courseProgress.percent" label="Dersin ilerlemesi" />
      </div>
    </div>

    <section :aria-labelledby="timelineTitleId" class="mb-8">
      <h2 :id="timelineTitleId" class="mb-4 font-semibold">Haftaların akışı</h2>
      <WeekTimeline :items="weeks" />
    </section>

    <section :aria-labelledby="weeksTitleId" class="mb-8">
      <h2 :id="weeksTitleId" class="mb-3 font-semibold">Haftalar</h2>
      <ul v-if="weeks.length" class="grid gap-4 sm:grid-cols-2" aria-label="Dersin haftaları">
        <li v-for="item in weeks" :key="item.week.id">
          <WeekCard v-bind="item" />
        </li>
      </ul>
      <p
        v-else
        class="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400"
      >
        Bu derse henüz hafta eklenmemiş.
      </p>
    </section>
  </template>

  <template v-else>
    <PageHeader title="Ders bulunamadı" />
    <RouterLink to="/derslerim" class="text-indigo-600 underline dark:text-indigo-400">
      Derslerime dön
    </RouterLink>
  </template>
</template>
