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
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-none aria-invalid:border-red-500 dark:border-slate-700 dark:bg-slate-950'
</script>

<template>
  <form
    ref="formEl"
    class="mb-6 rounded-xl border border-indigo-200 bg-white p-4 shadow-sm dark:border-indigo-500/30 dark:bg-slate-900"
    :aria-labelledby="headingId"
    novalidate
    data-test="custom-task-form"
    @submit.prevent="submit"
  >
    <h2 :id="headingId" class="mb-4 font-semibold">
      {{ mode === 'edit' ? 'Görevi düzenle' : 'Yeni görev ekle' }}
    </h2>

    <div class="grid gap-4 sm:grid-cols-2">
      <div class="sm:col-span-2">
        <label :for="ids.title" class="mb-1 block text-sm font-medium">
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
        <label :for="ids.description" class="mb-1 block text-sm font-medium">Açıklama</label>
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
        <label :for="ids.courseId" class="mb-1 block text-sm font-medium">Ders</label>
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
        <label :for="ids.dueDate" class="mb-1 block text-sm font-medium">Son tarih</label>
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
      class="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
    >
      {{ error }}
    </p>

    <div class="mt-4 flex flex-wrap justify-end gap-3">
      <button
        type="button"
        class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:border-slate-700 dark:hover:bg-slate-800"
        @click="emit('cancel')"
      >
        Vazgeç
      </button>
      <button
        type="submit"
        :disabled="saving"
        class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:opacity-60 dark:bg-indigo-500 dark:hover:bg-indigo-400"
      >
        {{ saving ? 'Kaydediliyor…' : mode === 'edit' ? 'Değişiklikleri kaydet' : 'Görevi ekle' }}
      </button>
    </div>
  </form>
</template>
