<script setup lang="ts">
import { useId } from 'vue'

withDefaults(
  defineProps<{
    label: string
    type?: string
    autocomplete?: string
    required?: boolean
    minlength?: number
    /** Alanın altında görünen açıklama; ekran okuyucu alanla birlikte okur. */
    hint?: string
    /** Alanın altındaki ek içeriğin id'si (ör. şifre gücü göstergesi). */
    describedby?: string
  }>(),
  {
    type: 'text',
    autocomplete: undefined,
    required: false,
    minlength: undefined,
    hint: undefined,
    describedby: undefined,
  },
)

const model = defineModel<string>({ required: true })
const id = useId() // etiket ile alanı bağlar (ekran okuyucular için)
const hintId = `${id}-hint`
</script>

<template>
  <div>
    <label :for="id" class="mb-1 block text-sm font-medium">{{ label }}</label>
    <input
      :id="id"
      v-model="model"
      :type="type"
      :autocomplete="autocomplete"
      :required="required"
      :minlength="minlength"
      :aria-describedby="[hint ? hintId : '', describedby ?? ''].join(' ').trim() || undefined"
      class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
    />
    <p v-if="hint" :id="hintId" class="mt-1 text-xs text-slate-500 dark:text-slate-400">
      {{ hint }}
    </p>
  </div>
</template>
