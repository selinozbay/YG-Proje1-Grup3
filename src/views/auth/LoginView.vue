<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import AuthCard from '@/components/auth/AuthCard.vue'
import SubmitButton from '@/components/auth/SubmitButton.vue'
import TextField from '@/components/common/TextField.vue'
import { getAuthErrorMessage } from '@/services/auth'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

// Yalnızca uygulama içi adreslere geri dönülür; başka bir siteye yönlendirme yapılamaz.
function safeRedirect(value: unknown) {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : '/'
}

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(email.value.trim(), password.value)
    await router.replace(safeRedirect(route.query.redirect))
  } catch (e) {
    error.value = getAuthErrorMessage(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthCard
    title="Giriş yap"
    subtitle="Tekrar hoş geldin! Derslerine kaldığın yerden devam et."
    :error="error"
    @submit="submit"
  >
    <TextField
      v-model="email"
      label="E-posta"
      type="email"
      icon="mail"
      placeholder="ornek@eposta.com"
      autocomplete="email"
      required
    />
    <div>
      <TextField
        v-model="password"
        label="Şifre"
        type="password"
        icon="lock"
        autocomplete="current-password"
        required
      />
      <p class="mt-2 text-right text-sm">
        <RouterLink
          to="/sifremi-unuttum"
          class="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
        >
          Şifremi unuttum
        </RouterLink>
      </p>
    </div>
    <SubmitButton :loading="loading">Giriş yap</SubmitButton>

    <template #footer>
      <p>
        Hesabınız yok mu?
        <RouterLink
          to="/kayit"
          class="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
        >
          Kayıt olun
        </RouterLink>
      </p>
    </template>
  </AuthCard>
</template>
