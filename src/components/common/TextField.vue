<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import AppIcon from './AppIcon.vue'

const props = withDefaults(
  defineProps<{
    label: string
    type?: string
    autocomplete?: string
    required?: boolean
    minlength?: number
    placeholder?: string
    /** Kutunun solunda gösterilen ikon. */
    icon?: 'mail' | 'lock' | 'user'
    /** Alanın altında görünen açıklama (ör. kurallar); ekran okuyucu alanla birlikte okur. */
    hint?: string
    /** Bu alana özel hata; doluysa kutu kırmızı çerçeveyle gösterilir. */
    error?: string
    /** Alanın altındaki ek içeriğin id'si (ör. şifre gücü göstergesi). */
    describedby?: string
  }>(),
  {
    type: 'text',
    autocomplete: undefined,
    required: false,
    minlength: undefined,
    placeholder: undefined,
    icon: undefined,
    hint: '',
    error: '',
    describedby: undefined,
  },
)

const model = defineModel<string>({ required: true })
const id = useId() // etiket ile alanı bağlar (ekran okuyucular için)
const hintId = `${id}-hint`
const errorId = `${id}-error`

// Şifre alanlarında yazılanı göster/gizle düğmesi.
const isPassword = computed(() => props.type === 'password')
const revealed = ref(false)
const inputType = computed(() => (isPassword.value && revealed.value ? 'text' : props.type))

// Ekran okuyucu sırayla hatayı, açıklamayı ve ek içeriği (ör. şifre gücü) okur.
const describedBy = computed(
  () =>
    [props.error && errorId, props.hint && hintId, props.describedby].filter(Boolean).join(' ') ||
    undefined,
)
</script>

<template>
  <div>
    <label :for="id" class="mb-2 block text-sm font-semibold">{{ label }}</label>
    <div class="relative">
      <AppIcon
        v-if="icon"
        :name="icon"
        class="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-slate-400 dark:text-slate-500"
      />
      <input
        :id="id"
        v-model="model"
        :type="inputType"
        :autocomplete="autocomplete"
        :required="required"
        :minlength="minlength"
        :placeholder="placeholder"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="describedBy"
        class="h-12 w-full rounded-xl border bg-slate-50 text-slate-900 transition placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:outline-none dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-900"
        :class="[
          icon ? 'pl-11' : 'pl-4',
          isPassword ? 'pr-12' : 'pr-4',
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-500/15 dark:border-red-500/70'
            : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/15 dark:border-slate-800 dark:focus:border-indigo-400',
        ]"
      />
      <button
        v-if="isPassword"
        type="button"
        :aria-label="revealed ? 'Şifreyi gizle' : 'Şifreyi göster'"
        :aria-pressed="revealed"
        :title="revealed ? 'Şifreyi gizle' : 'Şifreyi göster'"
        class="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        @click="revealed = !revealed"
      >
        <AppIcon :name="revealed ? 'eye-off' : 'eye'" class="size-5" />
      </button>
    </div>
    <p v-if="error" :id="errorId" class="mt-1.5 text-sm text-red-600 dark:text-red-400">
      {{ error }}
    </p>
    <p v-if="hint" :id="hintId" class="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
      {{ hint }}
    </p>
  </div>
</template>
