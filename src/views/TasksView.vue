<script setup lang="ts">
import PageHeader from '@/components/common/PageHeader.vue'
import PagePlaceholder from '@/components/common/PagePlaceholder.vue'
import { useProgressStore } from '@/stores/progress'

const progress = useProgressStore()
</script>

<template>
  <PageHeader title="Görevlerim" description="Tüm derslerindeki görevler." />

  <!-- Örnek: görevler durumlarıyla birlikte progress.tasks içinde. -->
  <p class="mb-6">Toplam {{ progress.tasks.length }} görev var.</p>

  <PagePlaceholder
    title="Görevlerim"
    :items="[
      'Görev listesi: başlık, ders, hafta, son tarih, etiketler, durum',
      'Durum değiştirme: progress.setStatus(görevId, durum)',
      'Duruma, derse ve haftaya göre filtre',
      'Arama: yazarken liste anında güncellenir',
      'Sonuç yoksa boş durum mesajı',
      'Görev bileşenleri components/tasks/ klasörüne',
    ]"
  />
</template>
