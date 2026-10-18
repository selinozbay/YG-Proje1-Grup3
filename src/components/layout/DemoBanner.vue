<script setup lang="ts">
import { isFirebaseEnabled } from '@/firebase'
</script>

<template>
  <p
    v-if="!isFirebaseEnabled"
    role="status"
    class="bg-amber-100 px-4 py-2 text-center text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-200"
  >
    <strong>Demo modu:</strong> Firebase bağlı değil. Giriş ve ilerleme yalnızca bu tarayıcıda
    saklanır.
  </p>
</template>
