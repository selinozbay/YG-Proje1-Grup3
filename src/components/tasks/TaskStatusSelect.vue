<script setup lang="ts">
import { TASK_STATUS_LABELS, type TaskStatus } from '@/types/task'
import StatusIcon from '@/components/common/StatusIcon.vue'
import { STATUS_CLASSES } from './statusStyles'

/** Görev durumunu değiştiren açılır liste. `label` ekranda görünmez, ekran okuyucu okur. */
defineProps<{ label: string }>()
const status = defineModel<TaskStatus>({ required: true })

const options = Object.entries(TASK_STATUS_LABELS) as [TaskStatus, string][]
</script>

<!--
  Renkli rozet (durum simgesi ve adı) ayrı çizilir, gerçek <select> onun üstünde görünmez durur (#78).
  Tarayıcı açılan listeyi select'in kendi renkleriyle çizdiği için select tema renginde
  tutulur; böylece liste rozetin rengini almaz, aydınlık ve karanlık temada okunaklı kalır.
-->
<template>
  <label
    class="relative inline-flex cursor-pointer items-center gap-1.5 rounded-full py-1 pr-7 pl-1.5 text-xs font-semibold whitespace-nowrap ring-1 ring-black/5 ring-inset focus-within:ring-2 focus-within:ring-indigo-500 dark:ring-white/10"
    :class="STATUS_CLASSES[status]"
  >
    <span class="sr-only">{{ label }}</span>
    <StatusIcon :status="status" class="size-4" />
    <span aria-hidden="true">{{ TASK_STATUS_LABELS[status] }}</span>
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      class="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2"
    >
      <path
        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.06l3.71-3.83a.75.75 0 1 1 1.08 1.04l-4.25 4.39a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06z"
      />
    </svg>
    <select
      v-model="status"
      class="absolute inset-0 cursor-pointer appearance-none rounded-full bg-white text-slate-900 opacity-0 dark:bg-slate-900 dark:text-slate-100"
      data-test="status-select"
    >
      <option
        v-for="[value, text] in options"
        :key="value"
        :value="value"
        class="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100"
      >
        {{ text }}
      </option>
    </select>
  </label>
</template>
