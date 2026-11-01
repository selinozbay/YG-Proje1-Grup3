<script setup lang="ts">
import { nextTick, ref, useId, watch } from 'vue'

/**
 * Evet / Hayır onay penceresi (#35). Tarayıcının <dialog> öğesini kullanır; böylece
 * arkadaki sayfa tıklanamaz, odak pencerede kalır ve Esc ile kapanır.
 * Kullanım: <ConfirmDialog :open="acik" title="..." @confirm="..." @cancel="acik = false" />
 */
const props = withDefaults(
  defineProps<{
    open: boolean
    title: string
    message?: string
    confirmLabel?: string
    cancelLabel?: string
    /** İşlem sürerken düğmeler kilitlenir ve onay düğmesinde bu yazı görünür. */
    busyLabel?: string
    busy?: boolean
    /** 'danger': onay düğmesi kırmızı (çıkış, silme gibi işlemler). */
    tone?: 'default' | 'danger'
  }>(),
  {
    message: '',
    confirmLabel: 'Evet',
    cancelLabel: 'Hayır',
    busyLabel: 'Lütfen bekleyin…',
    busy: false,
    tone: 'default',
  },
)
const emit = defineEmits<{ confirm: []; cancel: [] }>()

const dialogEl = ref<HTMLDialogElement | null>(null)
const cancelButton = ref<HTMLButtonElement | null>(null)
/** Kapanma animasyonu sürerken true; animasyon bitince pencere gerçekten kapanır. */
const closing = ref(false)
const titleId = useId()
const messageId = useId()

const CLOSE_ANIMATION_MS = 150

function show() {
  const el = dialogEl.value
  if (!el || el.open) return
  closing.value = false
  // Test ortamı (jsdom) showModal'ı desteklemez; orada yalnızca görünür yapılır.
  if (typeof el.showModal === 'function') el.showModal()
  else el.setAttribute('open', '')
  // İlk odak "Hayır"da: yanlışlıkla Enter'a basan kişi işlemi onaylamış olmasın.
  cancelButton.value?.focus()
}

function hide() {
  const el = dialogEl.value
  if (!el?.open) return
  closing.value = true
  setTimeout(() => {
    if (typeof el.close === 'function') el.close()
    else el.removeAttribute('open')
    closing.value = false
  }, CLOSE_ANIMATION_MS)
}

watch(
  () => props.open,
  async (open) => {
    await nextTick()
    if (open) show()
    else hide()
  },
  { immediate: true },
)

function cancel() {
  if (!props.busy) emit('cancel')
}

/** Esc tuşu: tarayıcının kendi kapatmasını durdurup animasyonlu kapanış için "Hayır" sayılır. */
function onNativeCancel(event: Event) {
  event.preventDefault()
  cancel()
}

/** Pencerenin dışına (karartılmış alana) tıklamak "Hayır" sayılır. */
function onBackdropClick(event: MouseEvent) {
  if (event.target === dialogEl.value) cancel()
}
</script>

<template>
  <Teleport to="body">
    <dialog
      ref="dialogEl"
      :aria-labelledby="titleId"
      :aria-describedby="message ? messageId : undefined"
      class="confirm-dialog m-auto w-[calc(100%-2rem)] max-w-sm rounded-2xl bg-white p-0 text-slate-900 shadow-xl ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-800"
      :data-state="closing ? 'closing' : 'open'"
      @cancel="onNativeCancel"
      @click="onBackdropClick"
    >
      <div class="p-6">
        <h2 :id="titleId" class="text-lg font-semibold">{{ title }}</h2>
        <p v-if="message" :id="messageId" class="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {{ message }}
        </p>
        <div class="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            ref="cancelButton"
            type="button"
            :disabled="busy"
            class="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-300 hover:bg-slate-100 disabled:opacity-60 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-800"
            data-test="confirm-cancel"
            @click="cancel"
          >
            {{ cancelLabel }}
          </button>
          <button
            type="button"
            :disabled="busy"
            class="rounded-lg px-4 py-2 text-sm font-medium text-white disabled:cursor-wait disabled:opacity-70"
            :class="
              tone === 'danger'
                ? 'bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400'
                : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400'
            "
            data-test="confirm-ok"
            @click="emit('confirm')"
          >
            {{ busy ? busyLabel : confirmLabel }}
          </button>
        </div>
      </div>
    </dialog>
  </Teleport>
</template>
