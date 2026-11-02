<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import StatusIcon from '@/components/common/StatusIcon.vue'
import { courseColor } from '@/components/lessons/courseColors'
import type { StatusCounts } from '@/composables/useCourseProgress'
import type { TermWeek } from '@/composables/useDashboard'
import type { TaskWithStatus } from '@/types/task'
import { formatDate } from '@/utils/date'

/**
 * Ana Sayfa'nın üstündeki dönem çizelgesi (#9, #11): bir ders programı gibi, sütunlar
 * dönemin haftaları, satırlar dersler. Her hücrede o dersin o haftaki görevleri durum
 * simgeleriyle durur (hücre o haftanın sayfasına götürür). Bu hafta fosforlu sarıyla
 * işaretlidir, "Bugün" çizgisi dönemin ne kadarının geçtiğini gösterir. Üstteki iki çubuk
 * tamamlanan görev oranını geçen süreyle karşılaştırır: öğrenci takvimin önünde mi, gerisinde mi?
 */
const props = withDefaults(
  defineProps<{
    weeks: TermWeek[]
    elapsedPercent: number
    counts: StatusCounts
    /** Satırlar: dersler (katalog sırasıyla). Verilmezse yalnızca hafta sütunları çizilir. */
    courses?: { id: string; code: string; title: string }[]
    /** Ders görevleri (kendi görevleri hariç), hücreleri doldurmak için. */
    tasks?: TaskWithStatus[]
    /** Bugünün tarihi ("2026-10-31"); geciken görevler kırmızı halkayla çizilir. */
    today?: string
  }>(),
  { courses: () => [], tasks: () => [], today: '' },
)

const first = computed(() => props.weeks[0])
const last = computed(() => props.weeks[props.weeks.length - 1])

/** "29 Ekim – 4 Kasım"; aynı aydaysa "22 – 28 Ekim". */
function rangeText(week: TermWeek) {
  const [startDay, startMonth] = formatDate(week.start).split(' ')
  const end = formatDate(week.end)
  return end.endsWith(startMonth ?? '')
    ? `${startDay} – ${end}`
    : `${formatDate(week.start)} – ${end}`
}

const share = (week: TermWeek) => (week.total === 0 ? 0 : (week.done / week.total) * 100)

/** Bir dersin bir haftadaki görevleri. */
function cellTasks(courseId: string, weekNo: number) {
  return props.tasks.filter((task) => task.courseId === courseId && task.weekNo === weekNo)
}

function cellLabel(course: { title: string }, weekNo: number, tasks: TaskWithStatus[]) {
  const done = tasks.filter((task) => task.status === 'done').length
  return `${course.title} ${weekNo}. hafta: ${done} / ${tasks.length} görev tamamlandı`
}

const isLate = (task: TaskWithStatus) =>
  !!props.today && task.status !== 'done' && !!task.dueDate && task.dueDate < props.today

const showToday = computed(() => props.elapsedPercent > 0 && props.elapsedPercent < 100)
</script>

<template>
  <section
    aria-labelledby="term-title"
    class="mb-6 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 sm:mb-8 dark:bg-slate-900 dark:ring-slate-800"
    data-test="overall-progress"
  >
    <div
      class="flex flex-col gap-5 px-4 pt-5 pb-5 sm:px-6 sm:pt-6 lg:flex-row lg:items-center lg:justify-between"
    >
      <div>
        <h2 id="term-title" class="text-2xl leading-tight font-bold font-stretch-condensed">
          Dönem çizelgesi
        </h2>
        <p v-if="last" class="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Teslim: {{ formatDate(last.end) }}
        </p>
      </div>

      <!-- Hız karşılaştırması: tamamlanan görevler takvimin gerisinde kalırsa iki çubuk arasındaki fark görünür. -->
      <dl class="grid w-full gap-2.5 lg:max-w-[26rem]">
        <div class="flex items-center gap-3">
          <dt class="w-28 shrink-0 text-sm text-slate-600 sm:w-32 dark:text-slate-400">
            Tamamlanan görev
          </dt>
          <dd class="flex min-w-0 flex-1 items-center gap-3">
            <span
              class="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
              aria-hidden="true"
            >
              <span
                class="block h-full rounded-full bg-emerald-500 transition-[width] duration-500 motion-reduce:transition-none"
                :style="{ width: `${counts.percent}%` }"
              />
            </span>
            <span class="w-24 shrink-0 leading-none">
              <span
                class="block text-2xl font-bold font-stretch-condensed tabular-nums"
                data-test="overall-percent"
                >%{{ counts.percent }}</span
              >
              <span
                class="mt-1 block text-xs text-slate-500 dark:text-slate-400"
                data-test="overall-summary"
                >{{ counts.done }} / {{ counts.total }} görev</span
              >
            </span>
          </dd>
        </div>
        <div class="flex items-center gap-3">
          <dt class="w-28 shrink-0 text-sm text-slate-600 sm:w-32 dark:text-slate-400">
            Geçen süre
          </dt>
          <dd class="flex min-w-0 flex-1 items-center gap-3">
            <span
              class="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
              aria-hidden="true"
            >
              <span
                class="block h-full rounded-full bg-ink dark:bg-slate-300"
                :style="{ width: `${elapsedPercent}%` }"
              />
            </span>
            <span class="w-24 shrink-0 leading-none">
              <span
                class="block text-2xl font-bold font-stretch-condensed tabular-nums"
                data-test="elapsed"
                >%{{ elapsedPercent }}</span
              >
            </span>
          </dd>
        </div>
      </dl>
    </div>

    <div v-if="weeks.length" class="flex border-t border-slate-200 dark:border-slate-800">
      <!-- Satır adları: ders kodları. Hücrelerin bağlantı adlarında dersin adı yazdığı için gizli. -->
      <div v-if="courses.length" class="w-11 shrink-0 sm:w-16" aria-hidden="true">
        <div class="h-[4.5rem] sm:h-[4.25rem]" />
        <div
          v-for="course in courses"
          :key="course.id"
          class="flex h-11 items-center justify-center"
        >
          <span
            class="rounded-md px-1.5 py-0.5 text-xs font-bold font-stretch-condensed"
            :class="courseColor(course.id).solid"
            >{{ course.code }}</span
          >
        </div>
      </div>

      <div class="relative min-w-0 flex-1">
        <ol
          class="grid"
          :style="{ gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))` }"
          aria-label="Dönemin haftaları"
        >
          <li
            v-for="(week, w) in weeks"
            :key="week.weekNo"
            class="flex min-w-0 flex-col border-l border-slate-200 dark:border-slate-800"
            :class="
              week.state === 'current'
                ? 'bg-marker-soft/70 dark:bg-marker/[0.07]'
                : courses.length === 0 && w === 0 && 'border-l-0'
            "
            :aria-current="week.state === 'current' ? 'step' : undefined"
            data-test="term-week"
          >
            <div class="h-[4.5rem] px-2 pt-3 sm:h-[4.25rem] sm:px-4">
              <p class="flex flex-wrap items-center gap-x-2">
                <span
                  class="text-base leading-tight font-bold font-stretch-condensed sm:text-lg"
                  :class="week.state === 'past' && 'text-slate-500 dark:text-slate-400'"
                  >{{ week.weekNo }}. hafta</span
                >
                <span
                  v-if="week.state === 'current'"
                  class="rounded bg-marker px-1.5 py-px text-[0.6875rem] font-semibold text-ink max-sm:sr-only"
                  >Bu hafta</span
                >
              </p>
              <p
                class="mt-0.5 text-[0.6875rem] leading-tight text-slate-500 sm:text-xs dark:text-slate-400"
              >
                {{ rangeText(week) }}
              </p>
            </div>

            <RouterLink
              v-for="course in courses"
              :key="course.id"
              :to="`/derslerim/${course.id}/hafta/${week.weekNo}`"
              :aria-label="cellLabel(course, week.weekNo, cellTasks(course.id, week.weekNo))"
              class="term-reveal flex h-11 items-center gap-1 border-t border-slate-100 px-2 transition-colors hover:bg-slate-50 sm:gap-1.5 sm:px-4 dark:border-slate-800/70 dark:hover:bg-white/[0.04]"
              :style="{ '--i': w }"
            >
              <StatusIcon
                v-for="task in cellTasks(course.id, week.weekNo)"
                :key="task.id"
                :status="task.status"
                :late="isLate(task)"
                class="size-4 sm:size-[1.125rem]"
              />
            </RouterLink>

            <div class="h-7" aria-hidden="true" />

            <div class="mt-auto px-2 pb-4 sm:px-4">
              <p class="text-xs sm:text-sm">
                <span class="font-bold">{{ week.done }}</span
                ><span class="text-slate-500 dark:text-slate-400"> / {{ week.total }} görev</span>
              </p>
              <p
                v-if="week.overdue"
                class="text-xs font-semibold text-red-700 dark:text-red-400"
                data-test="week-overdue"
              >
                {{ week.overdue }} gecikti
              </p>
              <div
                class="mt-1.5 h-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
                role="progressbar"
                :aria-label="`${week.weekNo}. haftanın görevleri`"
                aria-valuemin="0"
                aria-valuemax="100"
                :aria-valuenow="Math.round(share(week))"
              >
                <div
                  class="h-full rounded-full bg-emerald-500 transition-[width] duration-300 motion-reduce:transition-none"
                  :style="{ width: `${share(week)}%` }"
                />
              </div>
            </div>
          </li>
        </ol>

        <!--
          "Bugün" çizgisi: haftalar eşit uzunlukta olduğu için geçen süre yüzdesi sütunlarla hizalanır.
          Yalnızca görsel; aynı bilgi yukarıda "Geçen süre" olarak yazılı.
        -->
        <div
          v-if="showToday && first"
          class="pointer-events-none absolute top-[4.5rem] bottom-0 sm:top-[4.25rem]"
          :style="{ left: `${elapsedPercent}%` }"
          aria-hidden="true"
        >
          <span
            class="today-line absolute top-0 -left-px block w-0.5 bg-ink dark:bg-marker"
            :style="{ height: `${courses.length * 2.75}rem` }"
          />
          <span
            class="absolute -translate-x-1/2 rounded-full bg-ink px-2 py-0.5 text-[0.6875rem] font-semibold whitespace-nowrap text-marker dark:bg-marker dark:text-ink"
            :style="{ top: `${courses.length * 2.75 + 0.2}rem` }"
            >Bugün</span
          >
        </div>
      </div>
    </div>
  </section>
</template>
