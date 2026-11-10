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
 * simgeleriyle durur (hücre o haftanın sayfasına götürür). Bu hafta vurgu rengiyle
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

const DAY_MS = 24 * 60 * 60 * 1000
/** İki tarih arasındaki gün farkı ("2026-10-15" → "2026-10-17" = 2). */
const daysFrom = (from: string, to: string) =>
  Math.round((new Date(`${to}T00:00:00`).getTime() - new Date(`${from}T00:00:00`).getTime()) / DAY_MS)

/**
 * Gün cetveli (#116): hafta başlıklarının altında soluk bir çizgi, üzerinde dönemin her günü
 * için soluk bir çentik. Çentikler günlerin ortasındadır; böylece ilk ve son gün kartın
 * kenarına değil, yarım gün içeride durur ve her haftanın 7 günü kendi sütununa düşer.
 * Bugün, kendi gününün çentiğinden aşağı inen kısa turuncu çizgi ve "Bugün" etiketiyle
 * işaretlenir; çizgi ders satırlarına inmez, görev daireleriyle kesişmez. Dönem dışındaysa
 * (öncesi ya da teslim gününden sonrası) yalnızca cetvel görünür.
 */
const ruler = computed(() => {
  if (!first.value || !last.value) return null
  const start = first.value.start
  const days = daysFrom(start, last.value.end) + 1
  const at = (day: number) => ((day + 0.5) / days) * 100
  const index = props.today ? daysFrom(start, props.today) : -1
  return {
    ticks: Array.from({ length: days }, (_, day) => at(day)),
    from: at(0),
    to: at(days - 1),
    today: index >= 0 && index < days ? at(index) : null,
  }
})

/**
 * "Bugün" etiketinin çizgiye bağlandığı yer: dönemin başında etiket çizginin sağında (çizgi sol
 * üst köşeye iner), sonunda solunda (sağ üst köşeye iner), arada ortasından. Böylece etiket
 * kartın kenarında kesilmez.
 */
const todayAnchor = computed(() => {
  const at = ruler.value?.today ?? 50
  return at <= 10 ? 'start' : at >= 90 ? 'end' : 'center'
})
const TODAY_ANCHOR_CLASS = {
  start: '-translate-x-px rounded-tl-none',
  center: '-translate-x-1/2',
  end: 'translate-x-[calc(-100%+1px)] rounded-tr-none',
}
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
                class="block h-full rounded-full bg-slate-600 dark:bg-slate-300"
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
        <div class="h-14" />
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
                ? 'bg-indigo-50/80 dark:bg-indigo-400/[0.07]'
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
                  class="rounded px-1.5 py-px text-[0.6875rem] font-semibold max-xl:sr-only bg-indigo-600 text-white dark:bg-indigo-400 dark:text-slate-950"
                  >Bu hafta</span
                >
              </p>
              <p
                class="mt-0.5 text-[0.6875rem] leading-tight text-slate-500 sm:text-xs dark:text-slate-400"
              >
                {{ rangeText(week) }}
              </p>
            </div>

            <!-- Gün cetveli ve "Bugün" etiketi için yer (aşağıda bütün haftaların üstüne çizilir). -->
            <div class="h-14" aria-hidden="true" />

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

            <div class="mt-auto px-2 pt-3 pb-4 sm:px-4">
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
          Gün cetveli: haftalar eşit uzunlukta olduğu için günler sütunlarla hizalanır. Yalnızca
          görsel; aynı bilgi yukarıda "Geçen süre" olarak yazılı. Bant 3,5rem: taban çizgisi 0,75rem'de,
          bugün çizgisi 0,375rem'den etiketin üstüne (1,5rem) iner; etiketle tablo arasında boşluk kalır.
        -->
        <div
          v-if="ruler"
          class="pointer-events-none absolute inset-x-0 top-[4.5rem] sm:top-[4.25rem]"
          aria-hidden="true"
          data-test="day-ruler"
        >
          <span
            class="absolute top-3 h-px bg-slate-200 dark:bg-slate-700/70"
            :style="{ left: `${ruler.from}%`, right: `${100 - ruler.to}%` }"
          />
          <span
            v-for="tick in ruler.ticks"
            :key="tick"
            class="absolute top-[0.5625rem] h-1.5 w-px -translate-x-1/2 bg-slate-300 dark:bg-slate-600"
            :style="{ left: `${tick}%` }"
            data-test="day-tick"
          />
          <template v-if="ruler.today !== null">
            <span
              class="today-line absolute top-1.5 h-[1.125rem] w-0.5 -translate-x-1/2 bg-indigo-500 dark:bg-indigo-400"
              :style="{ left: `${ruler.today}%` }"
              data-test="today-marker"
            />
            <span
              data-test="today-label"
              :data-anchor="todayAnchor"
              class="absolute top-6 rounded-full px-2 py-0.5 text-[0.6875rem] font-semibold whitespace-nowrap bg-indigo-600 text-white dark:bg-indigo-400 dark:text-slate-950"
              :class="TODAY_ANCHOR_CLASS[todayAnchor]"
              :style="{ left: `${ruler.today}%` }"
              >Bugün</span
            >
          </template>
        </div>
      </div>
    </div>
  </section>
</template>
