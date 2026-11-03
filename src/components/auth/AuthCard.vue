<script setup lang="ts">
import AppIcon from '@/components/common/AppIcon.vue'

defineProps<{ title: string; subtitle?: string; error?: string }>()
defineEmits<{ submit: [] }>()
</script>

<!--
  Giriş, kayıt ve şifre sıfırlama formlarının ortak bölümü (#3).
  AuthLayout'un sağ tarafında, kart olmadan doğrudan sayfa üzerinde durur.
-->
<template>
  <section>
    <h1
      class="text-[2rem] leading-[1.05] font-bold font-stretch-condensed text-slate-900 sm:text-[2.5rem] dark:text-white"
    >
      {{ title }}
    </h1>
    <p v-if="subtitle" class="mt-2 text-slate-600 dark:text-slate-400">{{ subtitle }}</p>

    <form class="mt-10 space-y-6" @submit.prevent="$emit('submit')">
      <slot />
      <p
        v-if="error"
        role="alert"
        class="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/60 dark:text-red-200"
      >
        <AppIcon name="alert" class="mt-0.5 size-4 shrink-0" />
        <span>{{ error }}</span>
      </p>
    </form>

    <slot name="after-form" />

    <div
      v-if="$slots.footer"
      class="mt-10 border-t border-slate-200 pt-8 text-center text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400"
    >
      <slot name="footer" />
    </div>
  </section>
</template>
