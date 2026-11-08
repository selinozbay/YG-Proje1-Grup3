<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useId, useTemplateRef } from 'vue'
import { toISODate } from '@/utils/date'

/**
 * Tarih alanı (#110). Tarih kutuya elle yazılabilir (tarayıcının tarih kutusu) ya da sağdaki
 * düğmeyle açılan uygulamanın takviminden seçilebilir. Değer görevlerdeki biçimdedir:
 * "2026-11-10"; boşsa "".
 */
const props = withDefaults(
  defineProps<{
    /** Kutunun id'si; etiketin `for` değeri buna bağlanır. */
    id: string
    invalid?: boolean
    describedby?: string
    /** Takvimde işaretlenen bugün; testlerde sabit bir gün vermek için. */
    today?: string
  }>(),
  { invalid: false, describedby: undefined, today: () => toISODate(new Date()) },
)

const model = defineModel<string>({ required: true })

const MONTHS = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık',
]
const WEEKDAYS: [string, string][] = [
  ['Pt', 'Pazartesi'],
  ['Sa', 'Salı'],
  ['Ça', 'Çarşamba'],
  ['Pe', 'Perşembe'],
  ['Cu', 'Cuma'],
  ['Ct', 'Cumartesi'],
  ['Pz', 'Pazar'],
]
const WEEKDAY_NAMES = ['Pazar', ...WEEKDAYS.slice(0, 6).map(([, name]) => name)]

const root = useTemplateRef<HTMLElement>('root')
const trigger = useTemplateRef<HTMLButtonElement>('trigger')
const dialogId = useId()
const titleId = useId()

const isOpen = ref(false)
const openUp = ref(false)
/** Takvimde gösterilen ay (ayın ilk günü) ve klavyeyle üzerinde durulan gün. */
const view = ref({ year: 0, month: 0 })
const focused = ref('')

const isValidISO = (value: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value))
const parse = (iso: string) => new Date(`${iso}T00:00:00`)

const title = computed(() => `${MONTHS[view.value.month]} ${view.value.year}`)

/** Ayın günleri; hafta Pazartesi başlar, ayın başındaki boş günler `null`. */
const weeks = computed(() => {
  const { year, month } = view.value
  const lead = (new Date(year, month, 1).getDay() + 6) % 7
  const days = new Date(year, month + 1, 0).getDate()
  const cells: (string | null)[] = Array.from({ length: lead }, () => null)
  for (let day = 1; day <= days; day++) cells.push(toISODate(new Date(year, month, day)))
  while (cells.length % 7) cells.push(null)
  const rows: (string | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7))
  return rows
})

const dayLabel = (iso: string) => {
  const date = parse(iso)
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()} ${WEEKDAY_NAMES[date.getDay()]}`
}

function showMonthOf(iso: string) {
  const date = parse(iso)
  view.value = { year: date.getFullYear(), month: date.getMonth() }
}

async function focusDay(iso: string) {
  focused.value = iso
  showMonthOf(iso)
  await nextTick()
  root.value?.querySelector<HTMLButtonElement>(`[data-date="${iso}"]`)?.focus()
}

function open() {
  const start = isValidISO(model.value) ? model.value : props.today
  const rect = root.value?.getBoundingClientRect()
  // Altta yer yoksa ve üstte varsa takvim kutunun üstünde açılır.
  openUp.value = !!rect && window.innerHeight - rect.bottom < 380 && rect.top > 380
  isOpen.value = true
  document.addEventListener('pointerdown', onOutsidePointer, true)
  focusDay(start)
}

function close(returnFocus = false) {
  if (!isOpen.value) return
  isOpen.value = false
  document.removeEventListener('pointerdown', onOutsidePointer, true)
  if (returnFocus) trigger.value?.focus()
}

function onOutsidePointer(event: PointerEvent) {
  if (!root.value?.contains(event.target as Node)) close()
}

/** Odak takvimden ve kutudan tamamen çıkınca (Tab ile) takvim kapanır. */
function onFocusOut(event: FocusEvent) {
  const next = event.relatedTarget as Node | null
  if (next && !root.value?.contains(next)) close()
}

function select(iso: string) {
  model.value = iso
  close(true)
}

function clear() {
  model.value = ''
  close(true)
}

function shiftMonth(delta: number) {
  const { year, month } = view.value
  const first = new Date(year, month + delta, 1)
  view.value = { year: first.getFullYear(), month: first.getMonth() }
  // Odaklı gün yeni ayda aynı güne taşınır (ay kısaysa son güne).
  const day = Math.min(
    focused.value ? parse(focused.value).getDate() : 1,
    new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate(),
  )
  focused.value = toISODate(new Date(first.getFullYear(), first.getMonth(), day))
}

/**
 * Takvimdeki bütün tuşlar tek dinleyicide: Esc kapatır; bir gün odaktayken oklar, Home/End ve
 * Page Up/Down günler arasında gezdirir (Shift ile Page Up/Down bir yıl).
 */
function onCalendarKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault()
    event.stopPropagation()
    close(true)
    return
  }
  const iso = (event.target as HTMLElement).dataset?.date
  if (iso) onDayKeydown(event, iso)
}

function onDayKeydown(event: KeyboardEvent, iso: string) {
  const date = parse(iso)
  const weekday = (date.getDay() + 6) % 7
  const move: Record<string, () => Date> = {
    ArrowLeft: () => new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1),
    ArrowRight: () => new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
    ArrowUp: () => new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7),
    ArrowDown: () => new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7),
    Home: () => new Date(date.getFullYear(), date.getMonth(), date.getDate() - weekday),
    End: () => new Date(date.getFullYear(), date.getMonth(), date.getDate() + 6 - weekday),
    PageUp: () => addMonths(date, event.shiftKey ? -12 : -1),
    PageDown: () => addMonths(date, event.shiftKey ? 12 : 1),
  }
  const target = move[event.key]
  if (!target) return
  event.preventDefault()
  focusDay(toISODate(target()))
}

function addMonths(date: Date, delta: number) {
  const first = new Date(date.getFullYear(), date.getMonth() + delta, 1)
  const last = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate()
  return new Date(first.getFullYear(), first.getMonth(), Math.min(date.getDate(), last))
}

onBeforeUnmount(() => document.removeEventListener('pointerdown', onOutsidePointer, true))

const navButtonClass =
  'grid size-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
</script>

<template>
  <div ref="root" class="relative" @focusout="onFocusOut">
    <input
      :id="id"
      v-model="model"
      type="date"
      class="field pr-12"
      :class="{ 'is-empty': !model }"
      :aria-invalid="invalid ? 'true' : undefined"
      :aria-describedby="describedby"
      @keydown.alt.down.prevent="open"
    />
    <button
      ref="trigger"
      type="button"
      class="absolute top-1/2 right-1.5 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-700 aria-expanded:bg-indigo-50 aria-expanded:text-indigo-700 dark:text-slate-400 dark:hover:bg-indigo-400/10 dark:hover:text-indigo-300 dark:aria-expanded:bg-indigo-400/10 dark:aria-expanded:text-indigo-300"
      aria-label="Takvimden seç"
      aria-haspopup="dialog"
      :aria-expanded="isOpen"
      :aria-controls="isOpen ? dialogId : undefined"
      data-test="date-picker-toggle"
      @click="isOpen ? close() : open()"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        class="size-[1.1rem]"
      >
        <path d="M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </svg>
    </button>

    <div
      v-if="isOpen"
      :id="dialogId"
      role="dialog"
      :aria-labelledby="titleId"
      class="absolute left-0 z-30 w-[19rem] max-w-[calc(100vw-2rem)] rounded-2xl bg-white p-3 shadow-[0_16px_40px_-12px_rgb(14_18_27/0.25)] ring-1 ring-slate-200 dark:bg-slate-900 dark:shadow-[0_16px_40px_-12px_rgb(0_0_0/0.7)] dark:ring-slate-700"
      :class="openUp ? 'bottom-full mb-2' : 'top-full mt-2'"
      data-test="date-picker"
      @keydown="onCalendarKeydown"
    >
      <div class="mb-2 flex items-center justify-between gap-2">
        <button
          type="button"
          :class="navButtonClass"
          aria-label="Önceki ay"
          @click="shiftMonth(-1)"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="size-5">
            <path
              d="M12.79 5.23a.75.75 0 0 1-.02 1.06L8.94 10l3.83 3.71a.75.75 0 1 1-1.04 1.08l-4.39-4.25a.75.75 0 0 1 0-1.08l4.39-4.25a.75.75 0 0 1 1.06.02z"
            />
          </svg>
        </button>
        <p
          :id="titleId"
          class="text-base font-bold font-stretch-condensed"
          aria-live="polite"
          data-test="date-picker-title"
        >
          {{ title }}
        </p>
        <button
          type="button"
          :class="navButtonClass"
          aria-label="Sonraki ay"
          @click="shiftMonth(1)"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="size-5">
            <path
              d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.06 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.39 4.25a.75.75 0 0 1 0 1.08l-4.39 4.25a.75.75 0 0 1-1.06-.02z"
            />
          </svg>
        </button>
      </div>

      <table role="grid" :aria-labelledby="titleId" class="w-full border-collapse text-center">
        <thead>
          <tr>
            <th
              v-for="[short, name] in WEEKDAYS"
              :key="short"
              scope="col"
              class="pb-1 text-xs font-semibold text-slate-500 dark:text-slate-400"
            >
              <abbr :title="name" class="no-underline">{{ short }}</abbr>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(week, w) in weeks" :key="w">
            <td
              v-for="(day, d) in week"
              :key="day ?? `bos-${w}-${d}`"
              class="p-0.5"
              :role="day ? 'gridcell' : undefined"
              :aria-selected="day ? day === model : undefined"
            >
              <button
                v-if="day"
                type="button"
                :data-date="day"
                :tabindex="day === focused ? 0 : -1"
                :aria-label="dayLabel(day)"
                :aria-current="day === today ? 'date' : undefined"
                class="grid h-9 w-full place-items-center rounded-lg text-sm tabular-nums transition-colors"
                :class="[
                  day === model
                    ? 'bg-indigo-600 font-semibold text-white hover:bg-indigo-700 dark:bg-indigo-400 dark:text-slate-950 dark:hover:bg-indigo-300'
                    : 'text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
                  day === today && day !== model
                    ? 'font-semibold text-indigo-700 ring-1 ring-indigo-300 ring-inset dark:text-indigo-300 dark:ring-indigo-400/50'
                    : '',
                ]"
                @click="select(day)"
              >
                {{ Number(day.slice(8)) }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div
        class="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 dark:border-slate-800"
      >
        <button
          type="button"
          class="rounded-lg px-2.5 py-1.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-indigo-400/10"
          @click="select(today)"
        >
          Bugün
        </button>
        <button
          v-if="model"
          type="button"
          class="rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          @click="clear"
        >
          Temizle
        </button>
      </div>
    </div>
  </div>
</template>
