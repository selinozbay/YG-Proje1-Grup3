<script setup lang="ts">
import { computed } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import PagePlaceholder from '@/components/common/PagePlaceholder.vue'
import { useAuthStore } from '@/stores/auth'
import { useProgressStore } from '@/stores/progress'

const auth = useAuthStore()
const progress = useProgressStore()

const greeting = computed(() =>
  auth.user?.displayName ? `Merhaba, ${auth.user.displayName}` : 'Merhaba',
)
</script>

<template>
  <PageHeader :title="greeting" description="Derslerindeki genel durumun." />

  <!-- Örnek: ilerleme progress store'dan okunur. Görsel gösterge bu sayfanın işidir. -->
  <p class="mb-6">
    {{ progress.overall.done }} / {{ progress.overall.total }} görev tamamlandı (%{{
      progress.overall.percent
    }})
  </p>

  <PagePlaceholder
    title="Ana Sayfa"
    :items="[
      'Genel ilerleme göstergesi (halka veya çubuk): progress.overall',
      'Derslere göre ilerleme: progress.summarize(...)',
      'Yaklaşan görevler (son tarihe göre sıralı)',
      'Bu haftanın dersi ve öğrenme hedefleri',
      'Mobil, tablet ve masaüstünde düzgün görünüm',
    ]"
  />
</template>
