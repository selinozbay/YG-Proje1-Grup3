<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import AuthCard from '@/components/auth/AuthCard.vue'
import AppIcon from '@/components/common/AppIcon.vue'
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
  <AuthCard
    title="Şifremi unuttum"
    :subtitle="
      sent
        ? undefined
        : 'E-posta adresini yaz; şifreni yenilemen için sana bir bağlantı gönderelim.'
    "
    :error="error"
    @submit="submit"
  >
    <!-- Hesabın var olup olmadığı söylenmez; böylece kayıtlı e-postalar tahmin edilemez. -->
    <div
      v-if="sent"
      role="status"
      class="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-900 dark:border-green-900 dark:bg-green-950/60 dark:text-green-200"
    >
      <AppIcon
        name="check-circle"
        class="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400"
      />
      <div class="space-y-1.5">
        <p class="font-medium">
          Bu adrese kayıtlı bir hesap varsa şifre sıfırlama bağlantısı gönderildi.
        </p>
        <p v-if="isFirebaseEnabled">
          Gelen kutunu ve gereksiz (spam) klasörünü kontrol et. Bağlantıdan yeni şifreni
          belirledikten sonra giriş yapabilirsin.
        </p>
        <p v-else>Demo modunda e-posta gönderilmez.</p>
      </div>
    </div>
    <template v-else>
      <TextField
        v-model="email"
        label="E-posta"
        type="email"
        icon="mail"
        placeholder="ornek@eposta.com"
        autocomplete="email"
        required
      />
      <SubmitButton :loading="loading">Bağlantı gönder</SubmitButton>
    </template>

    <template #footer>
      <RouterLink
        to="/giris"
        class="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
      >
        ← Giriş sayfasına dön
      </RouterLink>
    </template>
  </AuthCard>
</template>
