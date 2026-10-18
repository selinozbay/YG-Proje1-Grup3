<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import PageHeader from '@/components/common/PageHeader.vue'
import PagePlaceholder from '@/components/common/PagePlaceholder.vue'
import { useCatalogStore } from '@/stores/catalog'

const props = defineProps<{ courseId: string }>()

const catalog = useCatalogStore()
const course = computed(() => catalog.getCourse(props.courseId))
const weeks = computed(() => catalog.getWeeks(props.courseId))
</script>

<template>
  <template v-if="course">
    <PageHeader :title="course.title" :description="course.description" />

    <!-- Örnek: haftalar catalog store'dan gelir. Hafta kartları bu sayfanın işidir. -->
    <ul class="mb-6 list-disc pl-5">
      <li v-for="week in weeks" :key="week.id">
        <RouterLink
          :to="`/derslerim/${course.id}/hafta/${week.weekNo}`"
          class="text-indigo-600 underline dark:text-indigo-400"
        >
          {{ week.weekNo }}. Hafta · {{ week.title }}
        </RouterLink>
      </li>
    </ul>

    <PagePlaceholder
      title="Ders detayı"
      :items="[
        'Haftalık ders kartları (hafta no, başlık, açıklama)',
        'Her haftanın ilerleme göstergesi',
        'Haftaların akışını gösteren zaman çizelgesi',
      ]"
    />
  </template>

  <template v-else>
    <PageHeader title="Ders bulunamadı" />
    <RouterLink to="/derslerim" class="text-indigo-600 underline dark:text-indigo-400">
      Derslerime dön
    </RouterLink>
  </template>
</template>
