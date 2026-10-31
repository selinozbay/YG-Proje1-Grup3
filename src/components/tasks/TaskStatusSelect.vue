<script setup lang="ts">
import { TASK_STATUS_LABELS, type TaskStatus } from '@/types/task'
import { STATUS_CLASSES } from './statusStyles'

/** Görev durumunu değiştiren açılır liste. `label` ekranda görünmez, ekran okuyucu okur. */
defineProps<{ label: string }>()
const status = defineModel<TaskStatus>({ required: true })

const options = Object.entries(TASK_STATUS_LABELS) as [TaskStatus, string][]
</script>

<template>
  <label class="inline-flex">
    <span class="sr-only">{{ label }}</span>
    <select
      v-model="status"
      class="cursor-pointer rounded-full border-0 py-0.5 pr-7 pl-2.5 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
      :class="STATUS_CLASSES[status]"
      data-test="status-select"
    >
      <option v-for="[value, text] in options" :key="value" :value="value">{{ text }}</option>
    </select>
  </label>
</template>
