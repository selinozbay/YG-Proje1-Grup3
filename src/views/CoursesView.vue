<script setup lang="ts">
import { RouterLink } from 'vue-router'
import PageHeader from '@/components/common/PageHeader.vue'
import PagePlaceholder from '@/components/common/PagePlaceholder.vue'
import { useCatalogStore } from '@/stores/catalog'

const catalog = useCatalogStore()
</script>

<template>
  <PageHeader title="Derslerim" description="Takip ettiğin dersler." />

  <!-- Örnek: dersler catalog store'dan gelir. Kart tasarımı bu sayfanın işidir. -->
  <ul class="mb-6 list-disc pl-5">
    <li v-for="course in catalog.courses" :key="course.id">
      <RouterLink
        :to="`/derslerim/${course.id}`"
        class="text-indigo-600 underline dark:text-indigo-400"
      >
        {{ course.code }} · {{ course.title }}
      </RouterLink>
    </li>
  </ul>

  <PagePlaceholder
    title="Derslerim"
    :items="[
      'Her ders için kart: kod, ad, öğretim elemanı, açıklama',
      'Kartta dersin ilerleme çubuğu',
      'Duyarlı ızgara: mobilde 1, tablette 2, masaüstünde 3 sütun',
      'Kart bileşenleri components/lessons/ klasörüne',
    ]"
  />
</template>
