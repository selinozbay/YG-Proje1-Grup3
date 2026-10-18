<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import PageHeader from '@/components/common/PageHeader.vue'
import PagePlaceholder from '@/components/common/PagePlaceholder.vue'
import { useCatalogStore } from '@/stores/catalog'
import { useProgressStore } from '@/stores/progress'
import { TASK_STATUS_LABELS } from '@/types/task'

const props = defineProps<{ courseId: string; weekNo: number }>()

const catalog = useCatalogStore()
const progress = useProgressStore()

const week = computed(() => catalog.getWeek(props.courseId, props.weekNo))
const tasks = computed(() =>
  progress.tasks.filter((task) => task.courseId === props.courseId && task.weekNo === props.weekNo),
)
</script>

<template>
  <template v-if="week">
    <RouterLink
      :to="`/derslerim/${courseId}`"
      class="mb-2 inline-block text-sm text-indigo-600 underline dark:text-indigo-400"
    >
      ← {{ catalog.getCourse(courseId)?.title }}
    </RouterLink>
    <PageHeader :title="`${week.weekNo}. Hafta · ${week.title}`" :description="week.description" />

    <!-- Örnek: hedefler ve görevler store'lardan gelir. Tasarım bu sayfanın işidir. -->
    <h2 class="font-semibold">Öğrenme hedefleri</h2>
    <ul class="mb-4 list-disc pl-5">
      <li v-for="goal in week.learningGoals" :key="goal">{{ goal }}</li>
    </ul>
    <h2 class="font-semibold">Görevler</h2>
    <ul class="mb-6 list-disc pl-5">
      <li v-for="task in tasks" :key="task.id">
        {{ task.title }} — {{ TASK_STATUS_LABELS[task.status] }}
      </li>
    </ul>

    <PagePlaceholder
      title="Hafta detayı"
      :items="[
        'Öğrenme hedefleri kartı',
        'Görev kartları ve durum değiştirme: progress.setStatus(görevId, durum)',
        'Bu haftanın ilerleme göstergesi',
        'Önceki / sonraki hafta bağlantıları',
      ]"
    />
  </template>

  <template v-else>
    <PageHeader title="Hafta bulunamadı" />
    <RouterLink to="/derslerim" class="text-indigo-600 underline dark:text-indigo-400">
      Derslerime dön
    </RouterLink>
  </template>
</template>
