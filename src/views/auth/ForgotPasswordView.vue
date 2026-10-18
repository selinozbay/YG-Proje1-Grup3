<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import AuthCard from '@/components/auth/AuthCard.vue'
import SubmitButton from '@/components/auth/SubmitButton.vue'
import TextField from '@/components/common/TextField.vue'
import { isFirebaseEnabled } from '@/firebase'
import { getAuthErrorMessage } from '@/services/auth'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const email = ref('')
const sent = ref(false)
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await auth.resetPassword(email.value.trim())
    sent.value = true
  } catch (e) {
    error.value = getAuthErrorMessage(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthCard title="Şifremi unuttum" :error="error" @submit="submit">
    <!-- Hesabın var olup olmadığı söylenmez; böylece kayıtlı e-postalar tahmin edilemez. -->
    <p
      v-if="sent"
      role="status"
      class="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800 dark:bg-green-950 dark:text-green-300"
    >
      Bu adrese kayıtlı bir hesap varsa şifre sıfırlama bağlantısı gönderildi.
      <template v-if="!isFirebaseEnabled"> (Demo modunda e-posta gönderilmez.)</template>
    </p>
    <template v-else>
      <TextField v-model="email" label="E-posta" type="email" autocomplete="email" required />
      <SubmitButton :loading="loading">Bağlantı gönder</SubmitButton>
    </template>

    <template #footer>
      <RouterLink to="/giris" class="text-indigo-600 underline dark:text-indigo-400">
        Giriş sayfasına dön
      </RouterLink>
    </template>
  </AuthCard>
</template>
