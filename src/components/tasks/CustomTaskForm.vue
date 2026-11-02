<script setup lang="ts">
import { nextTick, onMounted, reactive, ref, useId, useTemplateRef } from 'vue'
import {
  createEmptyCustomTaskInput,
  DESCRIPTION_MAX_LENGTH,
  TITLE_MAX_LENGTH,
  validateCustomTask,
  type CustomTaskErrors,
} from '@/composables/useCustomTaskForm'
import type { CustomTaskInput } from '@/types/task'

/** Kullanıcının kendi görevini ekleme / düzenleme formu (#23). */
const props = withDefaults(
  defineProps<{
    courses: { id: string; title: string }[]
    mode: 'create' | 'edit'
    initial?: CustomTaskInput
    saving?: boolean
    /** Kayıt sırasında oluşan hata (ör. bağlantı yok). */
    error?: string
  }>(),
  { saving: false, error: '' },
)

const emit = defineEmits<{ submit: [input: CustomTaskInput]; cancel: [] }>()

const form = reactive<CustomTaskInput>({ ...(props.initial ?? createEmptyCustomTaskInput()) })
const errors = ref<CustomTaskErrors>({})

const headingId = useId()
const ids = { title: useId(), description: useId(), courseId: useId(), dueDate: useId() }
const errorId = (field: keyof CustomTaskInput) => `${ids[field]}-hata`

const formEl = useTemplateRef<HTMLFormElement>('formEl')
const titleInput = useTemplateRef<HTMLInputElement>('titleInput')

onMounted(() => titleInput.value?.focus())

async function submit() {
  errors.value = validateCustomTask(
    form,
    props.courses.map((course) => course.id),
  )
  if (Object.keys(errors.value).length) {
    // Ekran okuyucu ve klavye kullanıcısı ilk hatalı alana götürülür.
    await nextTick()
    formEl.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
    return
  }
  emit('submit', { ...form, title: form.title.trim(), description: form.description.trim() })
}

const fieldClass =
  'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-none aria-invalid:border-red-500 aria-invalid:ring-2 aria-invalid:ring-red-500/20 dark:border-slate-700 dark:bg-slate-950'
const labelClass = 'mb-1.5 block text-sm font-semibold'
</script>

<template>
  <form
    ref="formEl"
    class="mb-6 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
    :aria-labelledby="headingId"
    novalidate
    data-test="custom-task-form"
    @submit.prevent="submit"
  >
    <!-- Formun başlığı vurgu renginin açık tonunda bir şeritte: sayfada o an doldurulan şey bu. -->
    <div
      class="flex items-center gap-3 border-b border-indigo-100 bg-indigo-50 px-4 py-3 text-indigo-900 sm:px-6 dark:border-indigo-400/15 dark:bg-indigo-400/[0.08] dark:text-indigo-100"
    >
      <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="size-5 shrink-0">
        <path
          v-if="mode === 'edit'"
          d="M13.59 2.59a2 2 0 0 1 2.82 0l1 1a2 2 0 0 1 0 2.82l-9.5 9.5a2 2 0 0 1-.93.53l-3.24.81a.75.75 0 0 1-.91-.91l.81-3.24a2 2 0 0 1 .53-.93l9.42-9.58z"
        />
        <path
          v-else
          d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5z"
        />
      </svg>
      <h2 :id="headingId" class="text-lg font-bold font-stretch-condensed">
        {{ mode === 'edit' ? 'Görevi düzenle' : 'Yeni görev ekle' }}
      </h2>
    </div>

    <div class="grid gap-4 p-4 sm:grid-cols-2 sm:p-6">
      <div class="sm:col-span-2">
        <label :for="ids.title" :class="labelClass">
          Başlık <span class="text-red-600" aria-hidden="true">*</span>
        </label>
        <input
          :id="ids.title"
          ref="titleInput"
          v-model="form.title"
          type="text"
          required
          autocomplete="off"
          :aria-invalid="errors.title ? 'true' : undefined"
          :aria-describedby="errors.title ? errorId('title') : undefined"
          :class="fieldClass"
        />
        <p
          v-if="errors.title"
          :id="errorId('title')"
          class="mt-1 text-sm text-red-700 dark:text-red-400"
        >
          {{ errors.title }}
        </p>
        <p v-else class="mt-1 text-xs text-slate-500 dark:text-slate-400">
          En fazla {{ TITLE_MAX_LENGTH }} karakter.
        </p>
      </div>

      <div class="sm:col-span-2">
        <label :for="ids.description" :class="labelClass">Açıklama</label>
        <textarea
          :id="ids.description"
          v-model="form.description"
          rows="3"
          :aria-invalid="errors.description ? 'true' : undefined"
          :aria-describedby="errors.description ? errorId('description') : undefined"
          :class="fieldClass"
        />
        <p
          v-if="errors.description"
          :id="errorId('description')"
          class="mt-1 text-sm text-red-700 dark:text-red-400"
        >
          {{ errors.description }}
        </p>
        <p v-else class="mt-1 text-xs text-slate-500 dark:text-slate-400">
          İsteğe bağlı, en fazla {{ DESCRIPTION_MAX_LENGTH }} karakter.
        </p>
      </div>

      <div>
        <label :for="ids.courseId" :class="labelClass">Ders</label>
        <select
          :id="ids.courseId"
          v-model="form.courseId"
          :aria-invalid="errors.courseId ? 'true' : undefined"
          :aria-describedby="errors.courseId ? errorId('courseId') : undefined"
          :class="fieldClass"
        >
          <option value="">Derse bağlı değil</option>
          <option v-for="course in courses" :key="course.id" :value="course.id">
            {{ course.title }}
          </option>
        </select>
        <p
          v-if="errors.courseId"
          :id="errorId('courseId')"
          class="mt-1 text-sm text-red-700 dark:text-red-400"
        >
          {{ errors.courseId }}
        </p>
      </div>

      <div>
        <label :for="ids.dueDate" :class="labelClass">Son tarih</label>
        <input
          :id="ids.dueDate"
          v-model="form.dueDate"
          type="date"
          :aria-invalid="errors.dueDate ? 'true' : undefined"
          :aria-describedby="errors.dueDate ? errorId('dueDate') : undefined"
          :class="fieldClass"
        />
        <p
          v-if="errors.dueDate"
          :id="errorId('dueDate')"
          class="mt-1 text-sm text-red-700 dark:text-red-400"
        >
          {{ errors.dueDate }}
        </p>
      </div>
    </div>

    <p
      v-if="error"
      role="alert"
      class="mx-4 mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800 ring-1 ring-red-200 sm:mx-6 dark:bg-red-500/10 dark:text-red-200 dark:ring-red-900"
    >
      {{ error }}
    </p>

    <div
      class="flex flex-wrap justify-end gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3 sm:px-6 dark:border-slate-800 dark:bg-slate-950/40"
    >
      <button
        type="button"
        class="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-300 hover:bg-white dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-800"
        @click="emit('cancel')"
      >
        Vazgeç
      </button>
      <button
        type="submit"
        :disabled="saving"
        class="rounded-xl px-4 py-2.5 text-sm font-semibold disabled:opacity-60 bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-400 dark:text-slate-950 dark:hover:bg-indigo-300"
      >
        {{ saving ? 'Kaydediliyor…' : mode === 'edit' ? 'Değişiklikleri kaydet' : 'Görevi ekle' }}
      </button>
    </div>
  </form>
</template>
