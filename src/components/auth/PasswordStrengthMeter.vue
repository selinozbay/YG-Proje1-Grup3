<script setup lang="ts">
import { computed } from 'vue'
import {
  checkPasswordStrength,
  PASSWORD_STRENGTH_LABELS,
  type PasswordStrength,
} from '@/services/auth/registration'

// Kayıt formunda şifre gücü göstergesi (#7). Şifre boşken görünmez.
const props = defineProps<{ password: string; id: string }>()

const result = computed(() => checkPasswordStrength(props.password))

const FILLED: Record<PasswordStrength, number> = { weak: 1, medium: 2, strong: 3 }

const COLORS: Record<PasswordStrength, string> = {
  weak: 'bg-red-600 dark:bg-red-500',
  medium: 'bg-amber-500 dark:bg-amber-400',
  strong: 'bg-green-600 dark:bg-green-500',
}

const TEXT_COLORS: Record<PasswordStrength, string> = {
  weak: 'text-red-700 dark:text-red-400',
  medium: 'text-amber-700 dark:text-amber-300',
  strong: 'text-green-700 dark:text-green-400',
}
</script>

<template>
  <div :id="id" class="mt-2">
    <div v-if="password" class="flex gap-1" aria-hidden="true">
      <span
        v-for="n in 3"
        :key="n"
        class="h-1.5 flex-1 rounded-full"
        :class="n <= FILLED[result.level] ? COLORS[result.level] : 'bg-slate-200 dark:bg-slate-800'"
      />
    </div>
    <!-- Yalnızca derece değişince okunur; ipuçları her tuşta tekrar okunmaz. -->
    <p aria-live="polite" class="mt-1 text-xs font-medium" :class="TEXT_COLORS[result.level]">
      <template v-if="password">Şifre gücü: {{ PASSWORD_STRENGTH_LABELS[result.level] }}</template>
    </p>
    <ul
      v-if="password && result.level !== 'strong' && result.hints.length"
      class="mt-1 list-disc pl-4 text-xs text-slate-600 dark:text-slate-400"
    >
      <li v-for="hint in result.hints" :key="hint">{{ hint }}</li>
    </ul>
  </div>
</template>
