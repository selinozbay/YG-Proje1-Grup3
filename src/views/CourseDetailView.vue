<script setup lang="ts">
import { computed, useId } from 'vue'
import { RouterLink } from 'vue-router'
import BackLink from '@/components/common/BackLink.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import ProgressBar from '@/components/common/ProgressBar.vue'
import WeekCard from '@/components/lessons/WeekCard.vue'
import WeekTimeline from '@/components/lessons/WeekTimeline.vue'
import { courseColor } from '@/components/lessons/courseColors'
import { getWeekStates } from '@/components/lessons/weekState'
import { useCatalogStore } from '@/stores/catalog'
import { useProgressStore } from '@/stores/progress'

const props = defineProps<{ courseId: string }>()

const catalog = useCatalogStore()
const progress = useProgressStore()

const course = computed(() => catalog.getCourse(props.courseId))
const color = computed(() => courseColor(props.courseId))

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

    <!-- Dersin kapağı: dersin renginde, büyük ders kodu, ad, öğretim elemanı ve ilerleme. -->
    <header
      class="relative mb-8 overflow-hidden rounded-2xl px-5 py-6 sm:px-8 sm:py-8"
      :class="color.solid"
    >
      <span
        class="pointer-events-none absolute -top-6 -right-2 text-[9rem] leading-none font-bold font-stretch-condensed opacity-15 select-none sm:text-[12rem]"
        aria-hidden="true"
        >{{ course.code }}</span
      >
      <div class="relative max-w-2xl">
        <h1
          class="text-[2rem] leading-[1.05] font-bold font-stretch-condensed text-balance sm:text-[2.75rem]"
        >
          {{ course.title }}
        </h1>
        <p class="mt-3 text-[0.9375rem]">{{ course.description }}</p>
        <dl class="mt-5 flex flex-wrap gap-x-6 gap-y-1 text-sm">
          <div>
            <dt class="inline opacity-90">Kod:</dt>
            <dd class="ms-1 inline font-semibold">{{ course.code }}</dd>
          </div>
          <div>
            <dt class="inline opacity-90">Öğretim elemanı:</dt>
            <dd class="ms-1 inline font-semibold">{{ course.instructor }}</dd>
          </div>
        </dl>
      </div>
      <div class="relative mt-6 max-w-md">
        <p class="mb-1.5 text-sm font-medium" data-test="course-summary">
          Dersin ilerlemesi: {{ courseProgress.done }} / {{ courseProgress.total }} görev
        </p>
        <ProgressBar
          :value="courseProgress.percent"
          label="Dersin ilerlemesi"
          bar-class="bg-white"
          size="md"
          inverse
        />
      </div>
    </header>

    <section :aria-labelledby="timelineTitleId" class="mb-10">
      <h2 :id="timelineTitleId" class="mb-5 text-xl font-bold font-stretch-condensed">
        Haftaların akışı
      </h2>
      <WeekTimeline :items="weeks" />
    </section>

    <section :aria-labelledby="weeksTitleId" class="mb-8">
      <h2 :id="weeksTitleId" class="mb-4 text-xl font-bold font-stretch-condensed">Haftalar</h2>
      <ul v-if="weeks.length" class="grid gap-4 sm:grid-cols-2" aria-label="Dersin haftaları">
        <li v-for="item in weeks" :key="item.week.id">
          <WeekCard v-bind="item" :bar-class="color.bar" />
        </li>
      </ul>
      <p
        v-else
        class="rounded-2xl border-2 border-dashed border-slate-300 p-6 text-center text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400"
      >
        Bu derse henüz hafta eklenmemiş.
      </p>
    </section>
  </template>

  <template v-else>
    <PageHeader title="Ders bulunamadı" />
    <RouterLink to="/derslerim" class="font-medium text-indigo-700 underline dark:text-indigo-300">
      Derslerime dön
    </RouterLink>
  </template>
</template>
