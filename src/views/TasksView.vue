<script setup lang="ts">
import PageHeader from '@/components/common/PageHeader.vue'
import PagePlaceholder from '@/components/common/PagePlaceholder.vue'
import TaskCard from '@/components/tasks/TaskCard.vue'
import { useCatalogStore } from '@/stores/catalog'
import { useProgressStore } from '@/stores/progress'

const catalog = useCatalogStore()
const progress = useProgressStore()

const courseTitle = (courseId: string) => catalog.getCourse(courseId)?.title ?? ''
</script>

<template>
  <PageHeader title="Görevlerim" description="Tüm derslerindeki görevler tek listede." />

  <p class="mb-4 text-sm text-slate-600 dark:text-slate-400">{{ progress.tasks.length }} görev</p>

  <ul class="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Görevler">
    <li v-for="task in progress.tasks" :key="task.id">
      <TaskCard :task="task" :course-title="courseTitle(task.courseId)" />
    </li>
  </ul>

  <PagePlaceholder
    title="Görevlerim"
    :items="[
      'Durum değiştirme: progress.setStatus(görevId, durum)',
      'Duruma, derse ve haftaya göre filtre',
      'Arama: yazarken liste anında güncellenir',
      'Sonuç yoksa boş durum mesajı',
    ]"
  />
</template>
