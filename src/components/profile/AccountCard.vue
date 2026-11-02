<script setup lang="ts">
import { computed, ref } from 'vue'
import { getAuthErrorMessage } from '@/services/auth'
import { useAuthStore } from '@/stores/auth'

// Hesap bilgileri ve şifre sıfırlama bağlantısı (#30). Üst kısım öğrenci kartı gibi vurgu renginin açık tonunda.
const auth = useAuthStore()

/** "Ayşe Yılmaz" → "AY"; ad yoksa e-postanın ilk harfi. */
const initials = computed(() => {
  const name = auth.user?.displayName?.trim()
  const source = name ? name.split(/\s+/).map((part) => part[0]) : [auth.user?.email[0] ?? '?']
  return [source[0], source.length > 1 ? source[source.length - 1] : '']
    .join('')
    .toLocaleUpperCase('tr-TR')
})

const sending = ref(false)
const sentTo = ref('')
const error = ref('')

async function sendResetLink() {
  if (!auth.user) return
  error.value = ''
  sentTo.value = ''
  sending.value = true
  try {
    await auth.resetPassword(auth.user.email)
    sentTo.value = auth.user.email
  } catch (e) {
    error.value = getAuthErrorMessage(e)
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <section
    aria-labelledby="account-title"
    class="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
    data-test="account-card"
  >
    <h2 id="account-title" class="sr-only">Hesap bilgileri</h2>
    <div
      class="flex items-center gap-4 border-b border-indigo-100 bg-indigo-50 px-5 py-6 dark:border-indigo-400/15 dark:bg-indigo-400/[0.08]"
    >
      <span
        aria-hidden="true"
        class="flex size-16 shrink-0 items-center justify-center rounded-2xl text-2xl font-bold font-stretch-condensed bg-indigo-600 text-white dark:bg-indigo-400 dark:text-slate-950"
        data-test="avatar"
      >
        {{ initials }}
      </span>
      <dl class="min-w-0">
        <dt class="sr-only">Ad soyad</dt>
        <dd class="truncate text-2xl leading-tight font-bold font-stretch-condensed">
          {{ auth.user?.displayName || 'Adsız kullanıcı' }}
        </dd>
        <dt class="sr-only">E-posta</dt>
        <dd class="truncate text-sm text-slate-600 dark:text-slate-400">{{ auth.user?.email }}</dd>
      </dl>
    </div>

    <div class="p-5">
      <h3 class="text-sm font-bold">Şifre</h3>
      <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Şifrenizi değiştirmek için e-posta adresinize bir sıfırlama bağlantısı gönderilir.
      </p>
      <button
        type="button"
        :disabled="sending"
        class="mt-3 rounded-xl px-3.5 py-2 text-sm font-semibold ring-1 ring-slate-300 hover:bg-slate-50 disabled:opacity-60 dark:ring-slate-700 dark:hover:bg-slate-800"
        data-test="reset-password"
        @click="sendResetLink"
      >
        {{ sending ? 'Gönderiliyor…' : 'Şifre sıfırlama bağlantısı gönder' }}
      </button>
      <p role="status" class="mt-2 text-sm text-emerald-700 empty:hidden dark:text-emerald-400">
        <template v-if="sentTo">Sıfırlama bağlantısı {{ sentTo }} adresine gönderildi.</template>
      </p>
      <p v-if="error" role="alert" class="mt-2 text-sm text-red-700 dark:text-red-400">
        {{ error }}
      </p>
    </div>
  </section>
</template>
