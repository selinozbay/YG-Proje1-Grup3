<script setup lang="ts">
import { isFirebaseEnabled } from '@/firebase'
</script>

<template>
  <p
    v-if="!isFirebaseEnabled"
    role="status"
    class="border-b border-amber-200 bg-amber-50 px-4 py-1.5 text-center text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200"
  >
    <strong>Demo modu:</strong> Firebase bağlı değil. Giriş ve ilerleme yalnızca bu tarayıcıda
    saklanır.
  </p>
</template>
